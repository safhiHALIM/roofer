# Roofer Univers

Full-stack ecommerce starter with email-verification-first auth, NestJS + Prisma (MySQL), and Next.js (App Router).

## Stack
- Backend: NestJS 10, Prisma, JWT, bcrypt, Nodemailer
- Frontend: Next.js 14, React 18, Tailwind CSS, Zustand, React Hook Form + Zod
- Database: MySQL
- Infra: Docker-compose scaffold, Nginx reverse-proxy config, HTTPS via Let\'s Encrypt (configure certs on VPS)

## Quick Start
1. Copy env templates:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
2. Update secrets (`JWT_SECRET`, SMTP creds, DATABASE_URL) and URLs.
3. Install deps & generate Prisma client:
   - Backend: `cd backend && npm install && npx prisma generate`
   - Frontend: `cd frontend && npm install`
4. Run locally:
   - Backend: `npm run start:dev` (port 4000)
   - Frontend: `npm run dev` (port 3000)
5. Database migrations: `cd backend && npx prisma migrate dev --name init`

## Docker (optional)
`cd docker && docker compose up -d` (builds db, backend, frontend). Nginx config provided in `docker/nginx.conf`.

## Key Endpoints
- Auth: `/auth/register`, `/auth/verify-email`, `/auth/login`, `/auth/logout`, `/auth/me`
- Products: `/products`, `/products/:slug`, admin CRUD under `/admin/products`
- Cart: `/cart`, `/cart/add`, `/cart/update`, `/cart/remove`
- Favorites: `/favorites/toggle`, `/favorites`
- Orders: `/orders` (user), `/admin/orders`, `/admin/orders/:id/status`

## Guards & Rules
- JWT auth + EmailVerified guard required for cart, favorites, orders
- Admin guard for admin routes
- No payment gateways; checkout emails admin + client only.

## Admin Panel (frontend)
- URL: `http://localhost:3000/admin`
- Admin login page: `http://localhost:3000/admin/login` (checks role = ADMIN)
- Access: requires login as a user with `role = ADMIN` (JWT and `user_role` cookie set on login).
- Middleware protection: `/admin/**` paths redirect to `/account` if not admin.
- Features:
  - Products: create, list (including inactive), toggle active, delete.
  - Categories: create, list, delete.
  - Orders: list all, update status.
