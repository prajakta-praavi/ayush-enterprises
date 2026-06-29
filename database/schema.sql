-- Aayush Enterprises website database schema
-- MySQL 8+ / MariaDB compatible
-- This schema is for this website only. Keep the other website on a separate database.

SET NAMES utf8mb4;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'editor') NOT NULL DEFAULT 'super_admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  description VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_categories_slug (slug),
  UNIQUE KEY uq_product_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  description VARCHAR(255) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blog_categories_slug (slug),
  UNIQUE KEY uq_blog_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media_assets (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  kind ENUM('image', 'document', 'video') NOT NULL DEFAULT 'image',
  original_name VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  file_size_bytes BIGINT UNSIGNED NOT NULL DEFAULT 0,
  storage_path VARCHAR(500) NOT NULL,
  public_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255) NULL,
  created_by_admin_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_media_assets_created_by_admin_id (created_by_admin_id),
  CONSTRAINT fk_media_assets_created_by_admin
    FOREIGN KEY (created_by_admin_id) REFERENCES admin_users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  media_id BIGINT UNSIGNED NULL,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  short_description VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  published_at DATETIME NULL,
  created_by_admin_id BIGINT UNSIGNED NULL,
  updated_by_admin_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_category_id (category_id),
  KEY idx_products_media_id (media_id),
  KEY idx_products_created_by_admin_id (created_by_admin_id),
  KEY idx_products_updated_by_admin_id (updated_by_admin_id),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES product_categories (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_products_media
    FOREIGN KEY (media_id) REFERENCES media_assets (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_products_created_by_admin
    FOREIGN KEY (created_by_admin_id) REFERENCES admin_users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_products_updated_by_admin
    FOREIGN KEY (updated_by_admin_id) REFERENCES admin_users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_spec_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(120) NOT NULL,
  value VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_product_spec_items_product_id (product_id),
  CONSTRAINT fk_product_spec_items_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  media_id BIGINT UNSIGNED NULL,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  short_description VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  sort_order INT NOT NULL DEFAULT 0,
  created_by_admin_id BIGINT UNSIGNED NULL,
  updated_by_admin_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_services_slug (slug),
  KEY idx_services_media_id (media_id),
  KEY idx_services_created_by_admin_id (created_by_admin_id),
  KEY idx_services_updated_by_admin_id (updated_by_admin_id),
  CONSTRAINT fk_services_media
    FOREIGN KEY (media_id) REFERENCES media_assets (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_services_created_by_admin
    FOREIGN KEY (created_by_admin_id) REFERENCES admin_users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_services_updated_by_admin
    FOREIGN KEY (updated_by_admin_id) REFERENCES admin_users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS service_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  service_id BIGINT UNSIGNED NOT NULL,
  item_text VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_service_items_service_id (service_id),
  CONSTRAINT fk_service_items_service
    FOREIGN KEY (service_id) REFERENCES services (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NULL,
  media_id BIGINT UNSIGNED NULL,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(260) NOT NULL,
  excerpt VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  status ENUM('draft', 'review', 'published', 'archived') NOT NULL DEFAULT 'draft',
  author_name VARCHAR(120) NOT NULL,
  read_time_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 4,
  published_at DATETIME NULL,
  created_by_admin_id BIGINT UNSIGNED NULL,
  updated_by_admin_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blog_posts_slug (slug),
  KEY idx_blog_posts_category_id (category_id),
  KEY idx_blog_posts_media_id (media_id),
  KEY idx_blog_posts_created_by_admin_id (created_by_admin_id),
  KEY idx_blog_posts_updated_by_admin_id (updated_by_admin_id),
  CONSTRAINT fk_blog_posts_category
    FOREIGN KEY (category_id) REFERENCES blog_categories (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_blog_posts_media
    FOREIGN KEY (media_id) REFERENCES media_assets (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_blog_posts_created_by_admin
    FOREIGN KEY (created_by_admin_id) REFERENCES admin_users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_blog_posts_updated_by_admin
    FOREIGN KEY (updated_by_admin_id) REFERENCES admin_users (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  subject VARCHAR(180) NULL,
  message TEXT NOT NULL,
  source_page VARCHAR(100) NOT NULL DEFAULT 'contact',
  status ENUM('new', 'read', 'replied', 'closed') NOT NULL DEFAULT 'new',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_messages_status (status),
  KEY idx_contact_messages_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
