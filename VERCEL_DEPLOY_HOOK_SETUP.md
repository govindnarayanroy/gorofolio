# Vercel Deploy Hook Setup Guide

## Current Issue

Portfolio publishing with Vercel is not working. The system needs to be configured to use Vercel Deploy Hooks for reliable portfolio deployment.

## What are Vercel Deploy Hooks?

Deploy hooks are webhook URLs that trigger deployments when called. They're simpler and more reliable than using the Vercel API directly.

## Setup Instructions

### 1. Create a Vercel Deploy Hook

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (or create a new one for portfolios)
3. Go to **Settings** → **Git** → **Deploy Hooks**
4. Click **Create Hook**
5. Configure the hook:
   - **Hook Name**: `Portfolio Deploy`
   - **Git Branch**: `main` (or your default branch)
   - **Description**: `Automated portfolio deployment hook`
6. Click **Create Hook**
7. Copy the generated webhook URL (it looks like: `https://api.vercel.com/v1/integrations/deploy/...`)

### 2. Add Environment Variables

Add these variables to your `.env.local` file:

```env
# Vercel Deploy Hook (Required)
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/your-hook-id/your-project-id

# Optional: Your project's base URL for generating portfolio URLs
VERCEL_PROJECT_URL=your-project.vercel.app
```

### 3. Project Structure for Portfolios

Your Vercel project should be set up to handle dynamic portfolio generation. Here's the recommended structure:

```
your-vercel-project/
├── api/
│   └── portfolio/
│       └── [id].js          # Dynamic portfolio generation
├── public/
│   └── portfolios/          # Static portfolio files
├── pages/
│   └── portfolio/
│       └── [id].js          # Portfolio display pages
└── package.json
```

### 4. Environment Variables Explanation

- **VERCEL_DEPLOY_HOOK**: The webhook URL from step 1
- **VERCEL_PROJECT_URL**: Your project's base URL (optional, used for generating portfolio URLs)

### 5. How It Works

1. User clicks "Publish Portfolio" in the dashboard
2. System calls `/api/portfolio/deploy` with profile data
3. API generates static HTML, CSS, and package.json files
4. API triggers the Vercel deploy hook with the portfolio data
5. Vercel automatically deploys the updated portfolio
6. User gets the live portfolio URL

### 6. Testing the Setup

1. Ensure your `.env.local` has the `VERCEL_DEPLOY_HOOK` variable
2. Restart your development server: `npm run dev`
3. Try publishing a portfolio from the dashboard
4. Check the terminal logs for deployment status

### 7. Expected Log Output

When working correctly, you should see:

```
🚀 Portfolio deploy API called
📋 Deploy request: { profileId: '123', customSlug: null, userId: 'user-id' }
🔑 Environment check: { hasVercelDeployHook: true, hookLength: 85 }
📤 Triggering Vercel deploy hook...
✅ Deploy hook triggered successfully: { triggered: true }
✅ Portfolio URL saved to database
```

### 8. Troubleshooting

**Issue**: "No Vercel deploy hook found"

- **Solution**: Add `VERCEL_DEPLOY_HOOK` to your `.env.local` file

**Issue**: "Deploy hook failed: 404"

- **Solution**: Verify the deploy hook URL is correct and the Vercel project exists

**Issue**: "Deploy hook failed: 401/403"

- **Solution**: Regenerate the deploy hook in Vercel dashboard

**Issue**: Portfolio URL not accessible

- **Solution**: Check that your Vercel project is configured to handle the portfolio routes

### 9. Production Considerations

For production deployment:

1. Add the environment variables to your Vercel project settings
2. Ensure your main application and portfolio generation are in the same Vercel project
3. Consider using custom domains for portfolio URLs
4. Set up proper error handling and user notifications

### 10. Alternative: Separate Portfolio Project

If you want portfolios on a separate domain:

1. Create a dedicated Vercel project for portfolios
2. Set up the deploy hook for that project
3. Configure the `VERCEL_PROJECT_URL` to point to the portfolio domain
4. Update the portfolio generation logic to match your project structure

## Next Steps

1. Follow steps 1-2 to get your deploy hook URL
2. Add it to your `.env.local` file
3. Restart your development server
4. Test portfolio publishing functionality
5. Verify the deployment works as expected

## Support

If you encounter issues:

1. Check the terminal logs for detailed error messages
2. Verify your Vercel project settings
3. Test the deploy hook URL manually with a tool like Postman
4. Ensure your `.env.local` file is properly formatted
