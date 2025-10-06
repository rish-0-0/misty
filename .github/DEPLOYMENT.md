# GitHub Pages Deployment Guide

## Setup Instructions

### 1. Enable GitHub Pages (CRITICAL - Do This First!)

1. Go to: `https://github.com/rish-0-0/misty/settings/pages`
2. Under **"Build and deployment"**:
   - **Source**: Select `GitHub Actions` (NOT "Deploy from a branch")
3. Click **Save**

**Important Notes**:
- If you don't see the Pages option, ensure your repository is **public**
- Or you need GitHub Pro/Teams for private repository Pages

### 2. Configure Workflow Permissions

1. Go to: `https://github.com/rish-0-0/misty/settings/actions`
2. Scroll to **"Workflow permissions"**
3. Select ✅ `Read and write permissions`
4. Check ✅ `Allow GitHub Actions to create and approve pull requests`
5. Click **Save**

### 3. Deploy

After setup, deployment happens automatically when you:
- Push to the `main` branch
- Or manually trigger from the Actions tab

### 4. Access Your Site

Once deployed, your site will be available at:
```
https://rish-0-0.github.io/misty/
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

### Error: "Not Found" or "Failed to create deployment (status: 404)"

This means GitHub Pages is not enabled. Fix:

1. ✅ Go to `Settings` → `Pages`
2. ✅ Set Source to `GitHub Actions`
3. ✅ Click Save
4. ✅ Re-run the failed workflow

### Error: "Deployment failed" or "Permission denied"

This means workflow permissions are incorrect. Fix:

1. ✅ Go to `Settings` → `Actions` → `General`
2. ✅ Set "Workflow permissions" to `Read and write permissions`
3. ✅ Enable "Allow GitHub Actions to create and approve pull requests"
4. ✅ Re-run the workflow

### Other Common Issues

1. **Repository is private**: Make it public or upgrade to GitHub Pro
2. **Check the Actions tab**: Look for detailed error logs
3. **Verify Node.js version**: Workflow uses Node.js 22

## Local Testing

To test the production build locally:

```bash
npm run build
npm run preview
```

This will serve the built app at `http://localhost:4173` (Vite default preview port).
