# Hostinger Setup

This project is ready to be deployed as a single Node.js app on Hostinger.

## What runs where

- `npm run build` builds the React frontend into `dist/`
- `node backend/server.mjs` starts the Node server
- The Node server serves:
  - the built frontend
  - the `/api/*` backend routes

## Hostinger steps

1. Create a MySQL database in Hostinger.
2. Import `database/schema.sql` into that database.
3. Add this repo as a Node.js web app in hPanel.
4. Choose the framework type as `Other` if Hostinger does not auto-detect it.
5. Set the build command to `npm run build`.
6. Set the start command to `npm start`.
7. Set the environment variables:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - optional `DB_SSL=true`
8. Redeploy the app.

## Expected app settings

- Output directory: `dist`
- Entry file: `backend/server.mjs`

## Verification

After deployment, check:

- `GET /api/health`
- It should report:
  - `databaseConfigured: true`
  - `databaseConnected: true`

If Hostinger changes an environment variable, redeploy the app so the new values take effect.
