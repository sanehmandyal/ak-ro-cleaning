# Aqua Ak Enterprises – Premium RO Purifier & Water Tank Cleaning MERN Platform

Complete, production-ready MERN stack web platform for **Aqua Ak Enterprises**, based in **Jankipuram, Lucknow**. Includes 9 dedicated service pages, technical SEO, interactive before/after photo comparisons, digital TDS testing diagnostics, customer bookings workflow, and an integrated Admin Dashboard.

- **Frontend**: React, Vite, Tailwind CSS, Lucide React, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB Atlas / Mongoose, JWT Authentication
- **Admin Panel**: Complete content management, booking statuses, service catalog, gallery management, and SEO metadata at `/admin`

```
client/   React + Vite + Tailwind (deploy to Vercel)
server/   Express + Mongoose API (deploy to Render)
render.yaml  Render blueprint for the API
```

## Local setup

Prerequisites: Node 18+, a MongoDB Atlas cluster (free tier is fine), a Cloudinary account.

```bash
# API
cd server
cp .env.example .env        # fill in MONGODB_URI, JWT_SECRET, CLOUDINARY_*, ADMIN_*
npm install
npm run seed                # creates the admin user + default services/settings/FAQs
npm run dev                 # http://localhost:5000

# Web (new terminal)
cd client
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173  (admin: /admin)
```

The seed is safe to re-run; change `ADMIN_PASSWORD` after first login (Admin → Settings).
Seeded content is starter text only: edit phone, WhatsApp, email, address, hours and service prices in the admin panel before going live. No testimonials or gallery images are seeded, so add your real ones.

## Deployment

1. **MongoDB Atlas**: create a cluster, a database user, and allow network access (`0.0.0.0/0` for Render free tier). Copy the connection string.
2. **Cloudinary**: copy cloud name, API key and API secret from the console.
3. **Render (API)**: New → Blueprint → select this repo (uses `render.yaml`), or create a Web Service with root `server`, build `npm install`, start `npm start`. Set `MONGODB_URI`, `CLIENT_URL` (your Vercel URL, comma-separate multiple), `SITE_URL`, and the three `CLOUDINARY_*` values. Then run `npm run seed` once from the Render shell (set `ADMIN_EMAIL`/`ADMIN_PASSWORD` first).
4. **Vercel (web)**: import the repo, root directory `client`, framework Vite. Set `VITE_API_URL=https://<your-render-service>.onrender.com/api`. In `client/vercel.json` replace `YOUR-RENDER-SERVICE` with your Render hostname (it proxies `/sitemap.xml`).
5. Update `SITE_URL` on Render to the final domain and redeploy; add your domain to `CLIENT_URL`.

Data persistence: content lives in Atlas and images in Cloudinary (multer uses memory storage, nothing is written to the server disk), so restarts, redeploys and Render sleeping lose nothing. Render's free plan sleeps after inactivity, so the first request can take ~30–60 s.

## Scripts

| Where | Command | Purpose |
|---|---|---|
| server | `npm run dev` / `npm start` | run API |
| server | `npm run seed` | admin user + starter content |
| client | `npm run dev` | dev server |
| client | `npm run lint` | ESLint |
| client | `npm run build` | production build |

## API overview

Public: `GET /api/settings, /services, /services/:slug, /gallery, /testimonials, /faqs, /seo/:page, /sitemap.xml, /robots.txt`; `POST /api/bookings, /contact` (rate-limited, validated).
Auth: `POST /api/auth/login`, `GET /auth/me`, `PUT /auth/profile`, `PUT /auth/password`.
Admin (JWT + role check): `/api/admin/{stats,upload,services,bookings,contacts,gallery,testimonials,faqs,settings,seo}`.
Responses: `{ success, data, pagination? }` or `{ success:false, message, errors? }`.

## SEO notes

Per-page titles/meta/canonical/Open Graph and LocalBusiness + Service JSON-LD are generated from DB content; sitemap and robots are served dynamically. This prepares the site for local search; it does not guarantee rankings. Create a Google Business Profile and add its link under Admin → Website Content.
