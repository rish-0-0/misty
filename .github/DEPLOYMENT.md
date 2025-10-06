# GitHub Pages Deployment Guide

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/misty`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select:
   - Source: **GitHub Actions**
5. Save the settings

### 2. Deploy

The deployment will happen automatically when you:
- Push to the `main` branch
- Or manually trigger the workflow from the Actions tab

### 3. Access Your Site

Once deployed, your site will be available at:
```
https://YOUR_USERNAME.github.io/misty/
```

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) does the following:

1. Checks out the repository
2. Sets up Node.js 22
3. Installs dependencies with `npm ci`
4. Builds the Preact app with `npm run build`
5. Uploads the `dist/` folder as a Pages artifact
6. Deploys to GitHub Pages

## Manual Deployment

You can also manually trigger a deployment:

1. Go to the **Actions** tab in your repository
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select the `main` branch
5. Click **Run workflow** button

## Configuration

The Vite config has been updated with:
```typescript
base: '/misty/'
```

This ensures all asset paths work correctly when deployed to `github.io/misty/`.

## Troubleshooting

If the deployment fails:

1. Check the **Actions** tab for error logs
2. Ensure you've enabled GitHub Pages in Settings
3. Verify the source is set to "GitHub Actions"
4. Check that the repository has Pages permissions enabled

## Local Testing

To test the production build locally:

```bash
npm run build
npm run preview
```

This will serve the built app at `http://localhost:4173` (Vite default preview port).
