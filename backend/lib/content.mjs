import { basenameFromPath, guessMimeType, slugify, sqlNow, toBoolean, toInteger } from "./http.mjs";
import { query, transaction } from "./db.mjs";

const inClause = (values) => values.map(() => "?").join(", ");

const ensureConfiguredRows = (rows) => rows ?? [];

const findCategory = async (connection, table, input) => {
  const rawName = String(input?.name || input?.category || input?.categoryName || "").trim();
  const rawSlug = String(input?.slug || input?.categorySlug || slugify(rawName)).trim();

  if (!rawName) {
    throw new Error("Category name is required.");
  }

  const [existing] = await connection.execute(
    `SELECT id FROM ${table} WHERE slug = ? OR name = ? LIMIT 1`,
    [rawSlug, rawName],
  );

  if (existing.length > 0) {
    return existing[0].id;
  }

  const [insertResult] = await connection.execute(
    `INSERT INTO ${table} (name, slug, description) VALUES (?, ?, ?)`,
    [rawName, rawSlug, String(input?.description || "").trim() || null],
  );

  return insertResult.insertId;
};

const storeMedia = async (connection, input, fallbackName) => {
  const mediaId = input?.mediaId ? toInteger(input.mediaId, 0) : 0;
  if (mediaId > 0) {
    return mediaId;
  }

  const imageUrl = String(input?.imageUrl || input?.image || "").trim();
  if (!imageUrl) {
    return null;
  }

  const fileName = basenameFromPath(imageUrl) || `${slugify(fallbackName)}.jpg`;
  const [insertResult] = await connection.execute(
    `
      INSERT INTO media_assets (
        kind, original_name, file_name, mime_type, file_size_bytes,
        storage_path, public_url, alt_text
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      "image",
      fileName,
      fileName,
      guessMimeType(imageUrl),
      0,
      imageUrl,
      imageUrl,
      String(input?.altText || fallbackName || "").trim() || null,
    ],
  );

  return insertResult.insertId;
};

const mapProductRows = (rows, specRows = []) => {
  const specsByProduct = new Map();

  for (const row of specRows) {
    if (!specsByProduct.has(row.product_id)) {
      specsByProduct.set(row.product_id, []);
    }

    specsByProduct.get(row.product_id).push({
      id: row.id,
      label: row.label,
      value: row.value,
      sortOrder: row.sort_order,
    });
  }

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    categoryId: row.categoryId,
    category: row.category,
    categorySlug: row.categorySlug,
    image: row.image || "",
    shortDesc: row.shortDesc,
    description: row.description,
    status: row.status,
    isFeatured: Boolean(row.isFeatured),
    sortOrder: row.sortOrder,
    publishedAt: row.publishedAt,
    specs: specsByProduct.get(row.id) || [],
  }));
};

const loadProducts = async ({ includeDrafts = false, slug = null, id = null } = {}) => {
  const filters = [];
  const params = [];

  if (!includeDrafts) {
    filters.push("p.status = 'published'");
  }

  if (slug) {
    filters.push("p.slug = ?");
    params.push(slug);
  }

  if (id) {
    filters.push("p.id = ?");
    params.push(id);
  }

  const [rows] = await query(
    `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.category_id AS categoryId,
        c.name AS category,
        c.slug AS categorySlug,
        p.media_id AS mediaId,
        COALESCE(m.public_url, '') AS image,
        p.short_description AS shortDesc,
        p.description,
        p.status,
        p.is_featured AS isFeatured,
        p.sort_order AS sortOrder,
        p.published_at AS publishedAt
      FROM products p
      INNER JOIN product_categories c ON c.id = p.category_id
      LEFT JOIN media_assets m ON m.id = p.media_id
      ${filters.length ? `WHERE ${filters.join(" AND ")}` : ""}
      ORDER BY p.sort_order ASC, p.created_at DESC
    `,
    params,
  );

  const safeRows = ensureConfiguredRows(rows);
  if (safeRows.length === 0) {
    return [];
  }

  const ids = safeRows.map((row) => row.id);
  const [specRows] = await query(
    `
      SELECT id, product_id, label, value, sort_order
      FROM product_spec_items
      WHERE product_id IN (${inClause(ids)})
      ORDER BY product_id, sort_order, id
    `,
    ids,
  );

  return mapProductRows(safeRows, ensureConfiguredRows(specRows));
};

const loadServices = async ({ includeDrafts = false, slug = null, id = null } = {}) => {
  const filters = [];
  const params = [];

  if (!includeDrafts) {
    filters.push("s.status = 'published'");
  }

  if (slug) {
    filters.push("s.slug = ?");
    params.push(slug);
  }

  if (id) {
    filters.push("s.id = ?");
    params.push(id);
  }

  const [rows] = await query(
    `
      SELECT
        s.id,
        s.title,
        s.slug,
        s.media_id AS mediaId,
        COALESCE(m.public_url, '') AS image,
        s.short_description AS shortDesc,
        s.description,
        s.status,
        s.sort_order AS sortOrder
      FROM services s
      LEFT JOIN media_assets m ON m.id = s.media_id
      ${filters.length ? `WHERE ${filters.join(" AND ")}` : ""}
      ORDER BY s.sort_order ASC, s.created_at DESC
    `,
    params,
  );

  const safeRows = ensureConfiguredRows(rows);
  if (safeRows.length === 0) {
    return [];
  }

  const ids = safeRows.map((row) => row.id);
  const [itemRows] = await query(
    `
      SELECT id, service_id, item_text, sort_order
      FROM service_items
      WHERE service_id IN (${inClause(ids)})
      ORDER BY service_id, sort_order, id
    `,
    ids,
  );

  const itemsByService = new Map();
  for (const item of ensureConfiguredRows(itemRows)) {
    if (!itemsByService.has(item.service_id)) {
      itemsByService.set(item.service_id, []);
    }

    itemsByService.get(item.service_id).push({
      id: item.id,
      text: item.item_text,
      sortOrder: item.sort_order,
    });
  }

  return safeRows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    image: row.image || "",
    shortDesc: row.shortDesc,
    description: row.description,
    status: row.status,
    sortOrder: row.sortOrder,
    items: itemsByService.get(row.id) || [],
  }));
};

const loadBlogs = async ({ includeDrafts = false, slug = null, id = null } = {}) => {
  const filters = [];
  const params = [];

  if (!includeDrafts) {
    filters.push("b.status = 'published'");
  }

  if (slug) {
    filters.push("b.slug = ?");
    params.push(slug);
  }

  if (id) {
    filters.push("b.id = ?");
    params.push(id);
  }

  const [rows] = await query(
    `
      SELECT
        b.id,
        b.title,
        b.slug,
        b.category_id AS categoryId,
        c.name AS category,
        c.slug AS categorySlug,
        b.media_id AS mediaId,
        COALESCE(m.public_url, '') AS image,
        b.excerpt,
        b.content,
        b.status,
        b.author_name AS authorName,
        b.read_time_minutes AS readTimeMinutes,
        b.published_at AS publishedAt
      FROM blog_posts b
      LEFT JOIN blog_categories c ON c.id = b.category_id
      LEFT JOIN media_assets m ON m.id = b.media_id
      ${filters.length ? `WHERE ${filters.join(" AND ")}` : ""}
      ORDER BY b.published_at DESC, b.created_at DESC
    `,
    params,
  );

  return ensureConfiguredRows(rows).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    categoryId: row.categoryId,
    category: row.category,
    categorySlug: row.categorySlug,
    image: row.image || "",
    excerpt: row.excerpt,
    content: row.content,
    status: row.status,
    authorName: row.authorName,
    readTimeMinutes: row.readTimeMinutes,
    publishedAt: row.publishedAt,
  }));
};

const resolveProductPayload = async (connection, input, existing = null) => {
  const categoryId = await findCategory(connection, "product_categories", input);
  const mediaId = await storeMedia(connection, input, input?.name || existing?.name || "product");
  const name = String(input?.name || existing?.name || "").trim();
  if (!name) {
    throw new Error("Product name is required.");
  }

  const shortDesc = String(input?.shortDesc || input?.short_description || existing?.shortDesc || "").trim();
  const description = String(input?.description || existing?.description || "").trim();
  if (!shortDesc || !description) {
    throw new Error("Product short description and description are required.");
  }

  const specsInput = Array.isArray(input?.specs) ? input.specs : [];
  const specs = specsInput
    .map((spec, index) => ({
      label: String(spec?.label || "").trim(),
      value: String(spec?.value || "").trim(),
      sortOrder: toInteger(spec?.sortOrder ?? index, index),
    }))
    .filter((spec) => spec.label && spec.value);

  const status = String(input?.status || existing?.status || "draft").toLowerCase();
  const isFeatured = toBoolean(input?.isFeatured ?? existing?.isFeatured ?? false);
  const sortOrder = toInteger(input?.sortOrder ?? existing?.sortOrder ?? 0, 0);
  const slug = String(input?.slug || existing?.slug || slugify(name)).trim() || slugify(name);
  const publishedAt = status === "published" ? String(input?.publishedAt || existing?.publishedAt || sqlNow()) : null;

  return {
    categoryId,
    mediaId,
    name,
    slug,
    shortDesc,
    description,
    status: ["draft", "published", "archived"].includes(status) ? status : "draft",
    isFeatured,
    sortOrder,
    publishedAt,
    specs,
  };
};

const resolveServicePayload = async (connection, input, existing = null) => {
  const mediaId = await storeMedia(connection, input, input?.title || existing?.title || "service");
  const title = String(input?.title || existing?.title || "").trim();
  if (!title) {
    throw new Error("Service title is required.");
  }

  const shortDesc = String(input?.shortDesc || input?.short_description || existing?.shortDesc || "").trim();
  const description = String(input?.description || existing?.description || "").trim();
  if (!shortDesc || !description) {
    throw new Error("Service short description and description are required.");
  }

  const itemsInput = Array.isArray(input?.items) ? input.items : [];
  const items = itemsInput
    .map((item, index) => ({
      text: String(item?.text || item || "").trim(),
      sortOrder: toInteger(item?.sortOrder ?? index, index),
    }))
    .filter((item) => item.text);

  const status = String(input?.status || existing?.status || "draft").toLowerCase();
  const sortOrder = toInteger(input?.sortOrder ?? existing?.sortOrder ?? 0, 0);
  const slug = String(input?.slug || existing?.slug || slugify(title)).trim() || slugify(title);

  return {
    mediaId,
    title,
    slug,
    shortDesc,
    description,
    status: ["draft", "published", "archived"].includes(status) ? status : "draft",
    sortOrder,
    items,
  };
};

const resolveBlogPayload = async (connection, input, existing = null) => {
  const categoryId = await findCategory(connection, "blog_categories", input);
  const mediaId = await storeMedia(connection, input, input?.title || existing?.title || "blog");
  const title = String(input?.title || existing?.title || "").trim();
  if (!title) {
    throw new Error("Blog title is required.");
  }

  const excerpt = String(input?.excerpt || existing?.excerpt || "").trim();
  const content = String(input?.content || existing?.content || "").trim();
  const authorName = String(input?.authorName || input?.author || existing?.authorName || "Aayush Editorial").trim();
  const readTimeMinutes = toInteger(input?.readTimeMinutes ?? existing?.readTimeMinutes ?? 4, 4);
  if (!excerpt || !content) {
    throw new Error("Blog excerpt and content are required.");
  }

  const status = String(input?.status || existing?.status || "draft").toLowerCase();
  const slug = String(input?.slug || existing?.slug || slugify(title)).trim() || slugify(title);
  const publishedAt = status === "published" ? String(input?.publishedAt || existing?.publishedAt || sqlNow()) : null;

  return {
    categoryId,
    mediaId,
    title,
    slug,
    excerpt,
    content,
    authorName,
    readTimeMinutes,
    status: ["draft", "review", "published", "archived"].includes(status) ? status : "draft",
    publishedAt,
  };
};

export const listProductCategories = async () => {
  const [rows] = await query(
    `
      SELECT id, name, slug, description, sort_order AS sortOrder, is_active AS isActive
      FROM product_categories
      ORDER BY sort_order ASC, name ASC
    `,
  );

  return ensureConfiguredRows(rows);
};

export const listBlogCategories = async () => {
  const [rows] = await query(
    `
      SELECT id, name, slug, description, sort_order AS sortOrder, is_active AS isActive
      FROM blog_categories
      ORDER BY sort_order ASC, name ASC
    `,
  );

  return ensureConfiguredRows(rows);
};

export const listProducts = async (options = {}) => loadProducts(options);

export const getProductById = async (id, options = {}) => {
  const products = await loadProducts({ ...options, id });
  return products[0] || null;
};

export const getProductBySlug = async (slug, options = {}) => {
  const products = await loadProducts({ ...options, slug });
  return products[0] || null;
};

export const createProduct = async (input) =>
  transaction(async (connection) => {
    const payload = await resolveProductPayload(connection, input);
    const [result] = await connection.execute(
      `
        INSERT INTO products (
          category_id, media_id, name, slug, short_description, description,
          status, is_featured, sort_order, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.categoryId,
        payload.mediaId,
        payload.name,
        payload.slug,
        payload.shortDesc,
        payload.description,
        payload.status,
        payload.isFeatured ? 1 : 0,
        payload.sortOrder,
        payload.publishedAt,
      ],
    );

    for (const spec of payload.specs) {
      await connection.execute(
        `
          INSERT INTO product_spec_items (product_id, label, value, sort_order)
          VALUES (?, ?, ?, ?)
        `,
        [result.insertId, spec.label, spec.value, spec.sortOrder],
      );
    }

    return result.insertId;
  }).then((id) => getProductById(id, { includeDrafts: true }));

export const updateProduct = async (id, input) =>
  transaction(async (connection) => {
    const [existingRows] = await connection.execute(
      `SELECT id, slug, name, short_description AS shortDesc, description, status, is_featured AS isFeatured, sort_order AS sortOrder, published_at AS publishedAt
       FROM products WHERE id = ? LIMIT 1`,
      [id],
    );

    if (existingRows.length === 0) {
      return null;
    }

    const payload = await resolveProductPayload(connection, input, existingRows[0]);
    await connection.execute(
      `
        UPDATE products
        SET category_id = ?, media_id = ?, name = ?, slug = ?, short_description = ?, description = ?,
            status = ?, is_featured = ?, sort_order = ?, published_at = ?
        WHERE id = ?
      `,
      [
        payload.categoryId,
        payload.mediaId,
        payload.name,
        payload.slug,
        payload.shortDesc,
        payload.description,
        payload.status,
        payload.isFeatured ? 1 : 0,
        payload.sortOrder,
        payload.publishedAt,
        id,
      ],
    );

    await connection.execute(`DELETE FROM product_spec_items WHERE product_id = ?`, [id]);
    for (const spec of payload.specs) {
      await connection.execute(
        `
          INSERT INTO product_spec_items (product_id, label, value, sort_order)
          VALUES (?, ?, ?, ?)
        `,
        [id, spec.label, spec.value, spec.sortOrder],
      );
    }

    return id;
  }).then((updatedId) => {
    if (!updatedId) {
      return null;
    }

    return getProductById(updatedId, { includeDrafts: true });
  });

export const deleteProduct = async (id) =>
  transaction(async (connection) => {
    const [result] = await connection.execute(`DELETE FROM products WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  });

export const listServices = async (options = {}) => loadServices(options);

export const getServiceById = async (id, options = {}) => {
  const services = await loadServices({ ...options, id });
  return services[0] || null;
};

export const getServiceBySlug = async (slug, options = {}) => {
  const services = await loadServices({ ...options, slug });
  return services[0] || null;
};

export const createService = async (input) =>
  transaction(async (connection) => {
    const payload = await resolveServicePayload(connection, input);
    const [result] = await connection.execute(
      `
        INSERT INTO services (
          media_id, title, slug, short_description, description,
          status, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.mediaId,
        payload.title,
        payload.slug,
        payload.shortDesc,
        payload.description,
        payload.status,
        payload.sortOrder,
      ],
    );

    for (const item of payload.items) {
      await connection.execute(
        `
          INSERT INTO service_items (service_id, item_text, sort_order)
          VALUES (?, ?, ?)
        `,
        [result.insertId, item.text, item.sortOrder],
      );
    }

    return result.insertId;
  }).then((id) => getServiceById(id, { includeDrafts: true }));

export const updateService = async (id, input) =>
  transaction(async (connection) => {
    const [existingRows] = await connection.execute(
      `SELECT id, title, slug, short_description AS shortDesc, description, status, sort_order AS sortOrder
       FROM services WHERE id = ? LIMIT 1`,
      [id],
    );

    if (existingRows.length === 0) {
      return null;
    }

    const payload = await resolveServicePayload(connection, input, existingRows[0]);
    await connection.execute(
      `
        UPDATE services
        SET media_id = ?, title = ?, slug = ?, short_description = ?, description = ?,
            status = ?, sort_order = ?
        WHERE id = ?
      `,
      [
        payload.mediaId,
        payload.title,
        payload.slug,
        payload.shortDesc,
        payload.description,
        payload.status,
        payload.sortOrder,
        id,
      ],
    );

    await connection.execute(`DELETE FROM service_items WHERE service_id = ?`, [id]);
    for (const item of payload.items) {
      await connection.execute(
        `
          INSERT INTO service_items (service_id, item_text, sort_order)
          VALUES (?, ?, ?)
        `,
        [id, item.text, item.sortOrder],
      );
    }

    return id;
  }).then((updatedId) => {
    if (!updatedId) {
      return null;
    }

    return getServiceById(updatedId, { includeDrafts: true });
  });

export const deleteService = async (id) =>
  transaction(async (connection) => {
    const [result] = await connection.execute(`DELETE FROM services WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  });

export const listBlogs = async (options = {}) => loadBlogs(options);

export const getBlogById = async (id, options = {}) => {
  const blogs = await loadBlogs({ ...options, id });
  return blogs[0] || null;
};

export const getBlogBySlug = async (slug, options = {}) => {
  const blogs = await loadBlogs({ ...options, slug });
  return blogs[0] || null;
};

export const createBlog = async (input) =>
  transaction(async (connection) => {
    const payload = await resolveBlogPayload(connection, input);
    const [result] = await connection.execute(
      `
        INSERT INTO blog_posts (
          category_id, media_id, title, slug, excerpt, content,
          status, author_name, read_time_minutes, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        payload.categoryId,
        payload.mediaId,
        payload.title,
        payload.slug,
        payload.excerpt,
        payload.content,
        payload.status,
        payload.authorName,
        payload.readTimeMinutes,
        payload.publishedAt,
      ],
    );

    return result.insertId;
  }).then((id) => getBlogById(id, { includeDrafts: true }));

export const updateBlog = async (id, input) =>
  transaction(async (connection) => {
    const [existingRows] = await connection.execute(
      `SELECT id, title, slug, excerpt, content, status, author_name AS authorName, read_time_minutes AS readTimeMinutes, published_at AS publishedAt
       FROM blog_posts WHERE id = ? LIMIT 1`,
      [id],
    );

    if (existingRows.length === 0) {
      return null;
    }

    const payload = await resolveBlogPayload(connection, input, existingRows[0]);
    await connection.execute(
      `
        UPDATE blog_posts
        SET category_id = ?, media_id = ?, title = ?, slug = ?, excerpt = ?, content = ?,
            status = ?, author_name = ?, read_time_minutes = ?, published_at = ?
        WHERE id = ?
      `,
      [
        payload.categoryId,
        payload.mediaId,
        payload.title,
        payload.slug,
        payload.excerpt,
        payload.content,
        payload.status,
        payload.authorName,
        payload.readTimeMinutes,
        payload.publishedAt,
        id,
      ],
    );

    return id;
  }).then((updatedId) => {
    if (!updatedId) {
      return null;
    }

    return getBlogById(updatedId, { includeDrafts: true });
  });

export const deleteBlog = async (id) =>
  transaction(async (connection) => {
    const [result] = await connection.execute(`DELETE FROM blog_posts WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  });

export const dashboardSummary = async () => {
  const [rows] = await query(
    `
      SELECT
        (SELECT COUNT(*) FROM products) AS products,
        (SELECT COUNT(*) FROM services) AS services,
        (SELECT COUNT(*) FROM blog_posts) AS blogs,
        (SELECT COUNT(*) FROM contact_messages) AS messages,
        (SELECT COUNT(*) FROM products WHERE status = 'published') AS publishedProducts,
        (SELECT COUNT(*) FROM services WHERE status = 'published') AS publishedServices,
        (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') AS publishedBlogs
    `,
  );

  return ensureConfiguredRows(rows)[0] || {
    products: 0,
    services: 0,
    blogs: 0,
    messages: 0,
    publishedProducts: 0,
    publishedServices: 0,
    publishedBlogs: 0,
  };
};

export const createContactMessage = async (input) => {
  const name = String(input?.name || "").trim();
  const email = String(input?.email || "").trim();
  const phone = String(input?.phone || "").trim();
  const message = String(input?.message || "").trim();
  const subject = String(input?.subject || "").trim() || null;
  const sourcePage = String(input?.sourcePage || "contact").trim() || "contact";

  if (!name || !email || !phone || !message) {
    throw new Error("Name, email, phone and message are required.");
  }

  const [result] = await query(
    `
      INSERT INTO contact_messages (name, email, phone, subject, message, source_page)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, email, phone, subject, message, sourcePage],
  );

  return result.insertId;
};

export const listContactMessages = async () => {
  const [rows] = await query(
    `
      SELECT id, name, email, phone, subject, message, source_page AS sourcePage, status, created_at AS createdAt
      FROM contact_messages
      ORDER BY created_at DESC
    `,
  );

  return ensureConfiguredRows(rows);
};
