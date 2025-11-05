# Azure Portfolio (Next.js + Azure App Service + GitHub Actions)

- `/src/app/page.tsx` → homepage UI
- `/src/components/*` → presentational components
- `/src/app/api/repos/route.ts` → server route calling GitHub
- `/src/lib/github.ts` → GitHub client (reads env vars)
- `/.github/workflows/deploy.yml` → CI/CD to Azure App Service

## Env vars (set locally in `.env.local` and in Azure App Settings)
- GITHUB_USERNAME
- GITHUB_TOKEN (optional but recommended)
- NEXT_PUBLIC_BASE_URL (http://localhost:3000 for dev, your site URL in prod)
- GITHUB_CLIENT_ID=Ov23liVCLUo4QINNmyvv
- GITHUB_CLIENT_SECRET=b037515e2147034aa32b12a488e7130e9233c42c
- NEXT_PUBLIC_BASE_URL=http://localhost:3000

Run locally:
```bash
npm run dev
