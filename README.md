# Care.xyz

Care.xyz is a caregiving booking platform where users can browse services, view details, and make bookings for baby care, elderly care, or support for sick family members. The project uses Next.js App Router with a simple client-side auth context and server-side data fetching where appropriate.

## Setup & Installation

- Install dependencies:

```bash
npm install
```

- Run the development server:

```bash
npm run dev
```

- Build for production:

```bash
npm run build
```

- Start production server:

```bash
npm run start
```

### Configuration
- Client API requests use a same-origin base at `/api` defined in `src/app/library/api.js`.
- All `/api/*` requests are proxied server-side to your backend in `src/app/api/[...path]/route.js`. Update the `BACKEND` constant there to point to your desired server.
- Images from your backend domains are allowed in `next.config.mjs` via `images.remotePatterns`. Update if your asset hosts change.

## Route Summary

- `/` — Landing page (Banner, About, Services preview, HowItWorks, Testimonials, CTA, Contact)
- `/services` — Service listing (SSR fetch)
- `/service/[id]` — Service details (SSR fetch)
- `/booking/[id]` — Booking form (client; calculates total cost, posts booking)
- `/login` — Login page (client; updates auth context)
- `/register` — Registration page (client)
- `/my-bookings` — User bookings (SSR fetch; redirects to `/login` if unauthorized)
- `/api/*` — Server route that proxies requests to the remote backend (avoids browser CORS and forwards cookies)

## Implemented Features
- Auth context provider with `user`, `loading`, and `logout` exposed to the app
- Login flow that sets user from the response or falls back to `/api/me` if available
- SSR pages forward request cookies to the backend for authenticated data (`/services`, `/my-bookings`, `/service/[id]`)
- Booking flow with dynamic total cost based on duration and service price
- Server-side API proxy under `/api/*` that forwards headers, cookies, and body to the remote backend
- Next/Image configured to handle images from local and remote hosts
- Navbar reflects authentication state and shows appropriate actions

## Deploying to Vercel
- Push the repository to your Git provider and import the project in Vercel.
- Ensure the proxy route at `src/app/api/[...path]/route.js` points `BACKEND` to your production backend URL.
- Confirm your image domains in `next.config.mjs` (`images.remotePatterns`) include any remote asset hosts.
- Build and deploy; the server route will run on Vercel and forward `/api/*` requests to your backend, avoiding CORS issues.

## Tech
- Next.js (App Router)
- React
- Axios
- Tailwind CSS + DaisyUI
