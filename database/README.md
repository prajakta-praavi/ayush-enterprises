# Database Plan

This website should use its own MySQL database and keep its data separate from the client's other website.

## Tables

- `admin_users`
- `product_categories`
- `products`
- `product_spec_items`
- `services`
- `service_items`
- `blog_categories`
- `blog_posts`
- `media_assets`
- `contact_messages`

## How the tables map to the site

- `product_categories` and `products` power the Products page and the admin product editor.
- `product_spec_items` stores the specs shown on product detail pages.
- `services` and `service_items` power the Services page and the admin service editor.
- `blog_categories` and `blog_posts` will power the future blog section.
- `admin_users` will be used for admin login later.
- `media_assets` stores upload metadata for images and files.
- `contact_messages` stores form submissions from the contact and enquiry forms.

## Notes

- Use `utf8mb4` for full character support.
- Keep slugs unique and stable.
- Store passwords only as hashes.
- Keep uploaded files outside the database and save only metadata in `media_assets`.

## Next step

After the schema is finalized, the next step is to build the Node.js API that reads and writes these tables.

## Hostinger setup

When you are ready to connect the live Hostinger database:

1. Create a MySQL database and user in Hostinger.
2. Import `schema.sql` into that database.
3. Set these environment variables in the Node app:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
4. If your host requires it, set `DB_SSL=true`.
5. Verify the backend health endpoint:
   - `GET /api/health`
   - It should report `databaseConfigured: true` and `databaseConnected: true`.

For local development, place the same values in a root `.env` file. The backend now loads that file automatically.
