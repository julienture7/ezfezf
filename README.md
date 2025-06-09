This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

To run this project, you need to set up environment variables.
1. Copy the `.env.example` file to a new file named `.env` in the root of the project:
   ```bash
   cp .env.example .env
   ```
2. Fill in the required values in the `.env` file.

Here's a description of the variables:

-   `DATABASE_URL`: Specifies the connection string for the database. For development, it defaults to a local SQLite database file (`file:./prisma/dev.db`). For production, this should be updated to your production database connection string.
-   `NEXTAUTH_SECRET`: A secret key used by NextAuth.js to sign and encrypt tokens (e.g., JWTs for session management). This is crucial for security. You can generate a suitable secret using a command like `openssl rand -base64 32`.
-   `NEXTAUTH_URL`: The canonical base URL of your application. This is important for NextAuth.js to correctly handle redirects and callbacks, especially with OAuth providers. For local development, it's typically `http://localhost:3000`. For production, this must be set to your application's public deployment URL.

If you plan to use OAuth providers (e.g., Google, GitHub), you will need to add their respective Client ID and Client Secret variables to the `.env` file as well (examples are provided in `.env.example`).
