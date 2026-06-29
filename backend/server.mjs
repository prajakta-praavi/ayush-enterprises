import "dotenv/config";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import {
  createBlog,
  createContactMessage,
  createProduct,
  createService,
  dashboardSummary,
  deleteBlog,
  deleteProduct,
  deleteService,
  getBlogById,
  getBlogBySlug,
  getProductById,
  getProductBySlug,
  getServiceById,
  getServiceBySlug,
  listBlogCategories,
  listBlogs,
  listContactMessages,
  listProductCategories,
  listProducts,
  listServices,
  updateBlog,
  updateProduct,
  updateService,
} from "./lib/content.mjs";
import { isDatabaseConfigured, pingDatabase } from "./lib/db.mjs";
import { handleOptions, readJsonBody, sendBuffer, sendError, sendJson, sendText, toInteger } from "./lib/http.mjs";

const host = process.env.HOST || "0.0.0.0";
const port = toInteger(process.env.PORT || process.env.BACKEND_PORT || 3000, 3000);
const distDir = path.resolve(process.cwd(), "dist");

const staticTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

const fileExists = async (filePath) => {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
};

const getStaticFilePath = (pathname) => {
  const normalizedPath = pathname === "/" ? "/index.html" : pathname;
  const safePath = normalizedPath.replace(/^\/+/, "");
  const resolvedPath = path.resolve(distDir, safePath);

  if (!resolvedPath.startsWith(distDir)) {
    return null;
  }

  return resolvedPath;
};

const serveFrontend = async (res, pathname) => {
  if (!pathname || pathname.startsWith("/api")) {
    return false;
  }

  const hasExtension = path.extname(pathname).length > 0;
  const assetPath = getStaticFilePath(pathname);
  const indexPath = path.resolve(distDir, "index.html");

  if (assetPath && (await fileExists(assetPath))) {
    const buffer = await fs.readFile(assetPath);
    const contentType = staticTypes.get(path.extname(assetPath).toLowerCase()) || "application/octet-stream";
    sendBuffer(res, 200, buffer, {
      "Content-Type": contentType,
      "Cache-Control": contentType.includes("text/html") ? "no-store" : "public, max-age=31536000, immutable",
    });
    return true;
  }

  if (hasExtension) {
    return false;
  }

  if (await fileExists(indexPath)) {
    const buffer = await fs.readFile(indexPath);
    sendBuffer(res, 200, buffer, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    return true;
  }

  sendText(res, 503, "Frontend build not found. Run `npm run build` before starting the server.");
  return true;
};

const isMissingDatabaseError = (error) =>
  error instanceof Error && error.message.includes("Database configuration is missing");

const withDatabaseGuard = async (res, handler) => {
  if (!isDatabaseConfigured()) {
    sendError(res, 503, "Database is not configured yet.");
    return;
  }

  try {
    await handler();
  } catch (error) {
    if (isMissingDatabaseError(error)) {
      sendError(res, 503, "Database is not configured yet.");
      return;
    }

    sendError(res, 500, error instanceof Error ? error.message : "Server error");
  }
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || `${host}:${port}`}`);
  const { pathname } = url;

  if (req.method === "OPTIONS") {
    handleOptions(res);
    return;
  }

  try {
    if (pathname === "/health" || pathname === "/api/health") {
      const databaseConnected = await pingDatabase();
      sendJson(res, 200, {
        ok: true,
        service: "aayush-enterprises-backend",
        databaseConfigured: isDatabaseConfigured(),
        databaseConnected,
      });
      return;
    }

    if (req.method === "GET" || req.method === "HEAD") {
      const served = await serveFrontend(res, pathname);
      if (served) {
        return;
      }
    }

    if (pathname === "/api/product-categories" && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const rows = await listProductCategories();
        sendJson(res, 200, rows);
      });
      return;
    }

    if (pathname === "/api/blog-categories" && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const rows = await listBlogCategories();
        sendJson(res, 200, rows);
      });
      return;
    }

    if (pathname === "/api/products" && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const rows = await listProducts();
        sendJson(res, 200, rows);
      });
      return;
    }

    const productSlugMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
    if (productSlugMatch && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const product = await getProductBySlug(decodeURIComponent(productSlugMatch[1]));
        if (!product) {
          sendError(res, 404, "Product not found");
          return;
        }

        sendJson(res, 200, product);
      });
      return;
    }

    if (pathname === "/api/services" && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const rows = await listServices();
        sendJson(res, 200, rows);
      });
      return;
    }

    const serviceSlugMatch = pathname.match(/^\/api\/services\/([^/]+)$/);
    if (serviceSlugMatch && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const service = await getServiceBySlug(decodeURIComponent(serviceSlugMatch[1]));
        if (!service) {
          sendError(res, 404, "Service not found");
          return;
        }

        sendJson(res, 200, service);
      });
      return;
    }

    if (pathname === "/api/blogs" && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const rows = await listBlogs();
        sendJson(res, 200, rows);
      });
      return;
    }

    const blogSlugMatch = pathname.match(/^\/api\/blogs\/([^/]+)$/);
    if (blogSlugMatch && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const blog = await getBlogBySlug(decodeURIComponent(blogSlugMatch[1]));
        if (!blog) {
          sendError(res, 404, "Blog not found");
          return;
        }

        sendJson(res, 200, blog);
      });
      return;
    }

    if (pathname === "/api/contact-messages" && req.method === "POST") {
      await withDatabaseGuard(res, async () => {
        const body = await readJsonBody(req);
        const id = await createContactMessage(body);
        sendJson(res, 201, { id, created: true });
      });
      return;
    }

    if (pathname === "/api/admin/contact-messages" && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const rows = await listContactMessages();
        sendJson(res, 200, rows);
      });
      return;
    }

    if (pathname === "/api/admin/dashboard" && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const summary = await dashboardSummary();
        sendJson(res, 200, summary);
      });
      return;
    }

    if (pathname === "/api/admin/products" && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const rows = await listProducts({ includeDrafts: true });
        sendJson(res, 200, rows);
      });
      return;
    }

    if (pathname === "/api/admin/products" && req.method === "POST") {
      await withDatabaseGuard(res, async () => {
        const body = await readJsonBody(req);
        const product = await createProduct(body);
        sendJson(res, 201, product);
      });
      return;
    }

    const adminProductMatch = pathname.match(/^\/api\/admin\/products\/(\d+)$/);
    if (adminProductMatch && (req.method === "GET" || req.method === "PUT" || req.method === "PATCH" || req.method === "DELETE")) {
      await withDatabaseGuard(res, async () => {
        const id = toInteger(adminProductMatch[1], 0);

        if (req.method === "GET") {
          const product = await getProductById(id, { includeDrafts: true });
          if (!product) {
            sendError(res, 404, "Product not found");
            return;
          }

          sendJson(res, 200, product);
          return;
        }

        if (req.method === "DELETE") {
          const deleted = await deleteProduct(id);
          if (!deleted) {
            sendError(res, 404, "Product not found");
            return;
          }

          sendJson(res, 200, { deleted: true });
          return;
        }

        const body = await readJsonBody(req);
        const product = await updateProduct(id, body);
        if (!product) {
          sendError(res, 404, "Product not found");
          return;
        }

        sendJson(res, 200, product);
      });
      return;
    }

    if (pathname === "/api/admin/services" && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const rows = await listServices({ includeDrafts: true });
        sendJson(res, 200, rows);
      });
      return;
    }

    if (pathname === "/api/admin/services" && req.method === "POST") {
      await withDatabaseGuard(res, async () => {
        const body = await readJsonBody(req);
        const service = await createService(body);
        sendJson(res, 201, service);
      });
      return;
    }

    const adminServiceMatch = pathname.match(/^\/api\/admin\/services\/(\d+)$/);
    if (adminServiceMatch && (req.method === "GET" || req.method === "PUT" || req.method === "PATCH" || req.method === "DELETE")) {
      await withDatabaseGuard(res, async () => {
        const id = toInteger(adminServiceMatch[1], 0);

        if (req.method === "GET") {
          const service = await getServiceById(id, { includeDrafts: true });
          if (!service) {
            sendError(res, 404, "Service not found");
            return;
          }

          sendJson(res, 200, service);
          return;
        }

        if (req.method === "DELETE") {
          const deleted = await deleteService(id);
          if (!deleted) {
            sendError(res, 404, "Service not found");
            return;
          }

          sendJson(res, 200, { deleted: true });
          return;
        }

        const body = await readJsonBody(req);
        const service = await updateService(id, body);
        if (!service) {
          sendError(res, 404, "Service not found");
          return;
        }

        sendJson(res, 200, service);
      });
      return;
    }

    if (pathname === "/api/admin/blogs" && req.method === "GET") {
      await withDatabaseGuard(res, async () => {
        const rows = await listBlogs({ includeDrafts: true });
        sendJson(res, 200, rows);
      });
      return;
    }

    if (pathname === "/api/admin/blogs" && req.method === "POST") {
      await withDatabaseGuard(res, async () => {
        const body = await readJsonBody(req);
        const blog = await createBlog(body);
        sendJson(res, 201, blog);
      });
      return;
    }

    const adminBlogMatch = pathname.match(/^\/api\/admin\/blogs\/(\d+)$/);
    if (adminBlogMatch && (req.method === "GET" || req.method === "PUT" || req.method === "PATCH" || req.method === "DELETE")) {
      await withDatabaseGuard(res, async () => {
        const id = toInteger(adminBlogMatch[1], 0);

        if (req.method === "GET") {
          const blog = await getBlogById(id, { includeDrafts: true });
          if (!blog) {
            sendError(res, 404, "Blog not found");
            return;
          }

          sendJson(res, 200, blog);
          return;
        }

        if (req.method === "DELETE") {
          const deleted = await deleteBlog(id);
          if (!deleted) {
            sendError(res, 404, "Blog not found");
            return;
          }

          sendJson(res, 200, { deleted: true });
          return;
        }

        const body = await readJsonBody(req);
        const blog = await updateBlog(id, body);
        if (!blog) {
          sendError(res, 404, "Blog not found");
          return;
        }

        sendJson(res, 200, blog);
      });
      return;
    }

    sendError(res, 404, "Route not found");
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid JSON body") {
      sendError(res, 400, error.message);
      return;
    }

    sendError(res, 500, error instanceof Error ? error.message : "Server error");
  }
});

server.listen(port, host, () => {
  console.log(`Backend listening on http://${host}:${port}`);
  if (!isDatabaseConfigured()) {
    console.log("Database not configured. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME or DATABASE_URL.");
  }
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
