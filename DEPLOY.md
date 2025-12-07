# GitHub Pages Deployment Guide

## Setup

1. **Add the GitHub Pages repository as a remote:**
   ```bash
   git remote add github https://github.com/iremnurc/iremnurc.github.io.git
   ```

2. **Build the CSS:**
   ```bash
   npm run build:css
   ```

3. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for GitHub Pages deployment"
   git push github main
   ```

## Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will automatically:
- Build the CSS when you push to `main`
- Deploy to GitHub Pages

## Enable GitHub Pages

1. Go to your repository: https://github.com/iremnurc/iremnurc.github.io
2. Go to **Settings** → **Pages**
3. Under **Source**, select:
   - **Source**: `GitHub Actions`
4. The site will be available at: `https://iremnurc.github.io`

## Important Notes

- The frontend will work directly with the Zone01 API (no CORS issues in production)
- The Go backend is only needed for local development
- Make sure `css/output.css` is committed (it's needed for GitHub Pages)

## Manual Deployment (Alternative)

If you prefer to deploy manually without GitHub Actions:

1. Build the CSS: `npm run build:css`
2. Commit the built CSS
3. Push to the `main` branch
4. In repository Settings → Pages, select **Source**: `Deploy from a branch` → `main` → `/ (root)`

