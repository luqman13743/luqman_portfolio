# Luqman Portfolio — Vercel + Supabase

This version uses Supabase PostgreSQL and Supabase Storage instead of local SQLite/filesystem.

## 1. Create the Supabase database
Open your Supabase project → SQL Editor → paste and run **supabase-schema.sql**.

## 2. Get the keys
Project URL:
`https://YOUR_PROJECT.supabase.co`

In Supabase → Project Settings → API, copy the **service_role** key for server-side use.

## 3. Vercel Environment Variables
Add these variables to the Vercel project:

`SUPABASE_URL` = your Project URL

`SUPABASE_SERVICE_ROLE_KEY` = your Supabase service_role key

`SUPABASE_STORAGE_BUCKET` = `uploads`

`SESSION_SECRET` = a long random secret (at least 16 characters)

Do NOT use the service-role key as a `NEXT_PUBLIC_` variable and do not commit it to GitHub.

## 4. Deploy
Push the project to GitHub and import it into Vercel. The build no longer initializes better-sqlite3 or a local database.

## 5. Admin account
Use the existing Admin Setup page in the application to create the first admin account. The account is stored in the `admin_users` table.

## 6. Existing local SQLite data
The previous `dev.db` data is not automatically copied to Supabase. If you have important existing data, export/insert it into the corresponding Supabase tables before deleting the old local project.

## Notes
- Admin CRUD runs server-side through Supabase.
- Public portfolio data is read from Supabase.
- Uploaded documents/images use Supabase Storage bucket `uploads`, so files are not lost on Vercel redeploys.
