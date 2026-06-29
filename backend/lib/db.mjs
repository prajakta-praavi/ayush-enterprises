import mysql from "mysql2/promise";

let pool;

const toBool = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

const parseDatabaseUrl = (value) => {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 3306,
      user: decodeURIComponent(url.username || ""),
      password: decodeURIComponent(url.password || ""),
      database: url.pathname.replace(/^\/+/, ""),
    };
  } catch {
    return null;
  }
};

const getDatabaseConfig = () => {
  const urlConfig = parseDatabaseUrl(process.env.DATABASE_URL || process.env.MYSQL_URL || "");
  if (urlConfig) {
    return {
      ...urlConfig,
      ssl: toBool(process.env.DB_SSL),
    };
  }

  const host = process.env.DB_HOST || process.env.MYSQL_HOST || "";
  const user = process.env.DB_USER || process.env.MYSQL_USER || "";
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || "";
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || "";
  const port = Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306);

  if (!host || !user || !database) {
    return null;
  }

  return {
    host,
    port,
    user,
    password,
    database,
    ssl: toBool(process.env.DB_SSL),
  };
};

export const isDatabaseConfigured = () => Boolean(getDatabaseConfig());

export const pingDatabase = async () => {
  const client = getPool();
  if (!client) {
    return false;
  }

  try {
    await client.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
};

export const getPool = () => {
  const config = getDatabaseConfig();
  if (!config) {
    return null;
  }

  if (!pool) {
    const options = {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      decimalNumbers: true,
      namedPlaceholders: true,
      charset: "utf8mb4",
      timezone: "Z",
    };

    if (config.ssl) {
      options.ssl = { rejectUnauthorized: false };
    }

    pool = mysql.createPool(options);
  }

  return pool;
};

export const query = async (sql, params = []) => {
  const client = getPool();
  if (!client) {
    throw new Error("Database configuration is missing.");
  }

  return client.execute(sql, params);
};

export const transaction = async (callback) => {
  const client = getPool();
  if (!client) {
    throw new Error("Database configuration is missing.");
  }

  const connection = await client.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
