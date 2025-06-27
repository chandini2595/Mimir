# Vercel Deployment Guide

This guide will help you deploy your Mimir Chat UI application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Backend API**: Your backend should be deployed and accessible
4. **API Keys**: You'll need OpenRouter API key and GitHub token

## Quick Deployment

### Option 1: Deploy Button (Recommended)
Click the deploy button in the README to automatically deploy to Vercel.

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npm run deploy
```

### Option 3: GitHub Integration
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

## Environment Variables

Set these in your Vercel dashboard (Project Settings → Environment Variables):

### Required Variables
```env
BACKEND_URL=https://your-backend-api.vercel.app
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.vercel.app
NEXT_PUBLIC_LOCAL_DEV=false
OPENROUTER_API_KEY=your_openrouter_api_key_here
GITHUB_TOKEN=your_github_token_here
```

### How to Get API Keys

#### OpenRouter API Key
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up/login
3. Go to API Keys section
4. Create a new API key
5. Copy the key

#### GitHub Token
1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (Full control of private repositories)
4. Generate and copy the token

## Deployment Steps

### 1. Prepare Your Environment
```bash
# Clone your repository
git clone https://github.com/your-username/mimir-chat-ui.git
cd mimir-chat-ui

# Install dependencies
npm install

# Set up environment variables
npm run env:setup
# Edit .env.local with your values
```

### 2. Test Locally
```bash
# Run development server
npm run dev

# Build and test production build
npm run build
npm start
```

### 3. Deploy to Vercel
```bash
# Deploy using the script
npm run deploy

# Or deploy directly
npm run deploy:vercel
```

### 4. Configure Environment Variables
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all required variables listed above

### 5. Redeploy
After adding environment variables, trigger a new deployment:
```bash
vercel --prod
```

## Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] Authentication works (sign up/sign in)
- [ ] File upload functionality works
- [ ] PDF preview works
- [ ] Chat functionality works
- [ ] All API endpoints respond correctly

## Troubleshooting

### Common Issues

#### Build Errors
- Check that all dependencies are installed
- Ensure TypeScript types are correct
- Run `npm run type-check` to verify

#### API Errors
- Verify BACKEND_URL is correct
- Check that backend is deployed and accessible
- Ensure environment variables are set correctly

#### File Upload Issues
- Verify GITHUB_TOKEN has correct permissions
- Check that the GitHub repository exists
- Ensure file size limits are appropriate

#### Authentication Issues
- Verify backend authentication endpoints
- Check CORS configuration
- Ensure JWT tokens are handled correctly

### Getting Help
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables are set
4. Test API endpoints directly

## Performance Optimization

The application is configured with:
- Static optimization for better performance
- Image optimization for GitHub raw files
- API route optimization
- Proper caching headers

## Security Considerations

- Environment variables are properly secured
- CORS is configured for API routes
- File uploads are validated
- Authentication tokens are handled securely

## Monitoring

After deployment, monitor:
- Application performance in Vercel dashboard
- Error rates and logs
- API response times
- User authentication flows
