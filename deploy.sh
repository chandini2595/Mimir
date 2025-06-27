#!/bin/bash

# Mimir Chat UI - Vercel Deployment Script
# This script helps deploy your application to Vercel

echo "🚀 Mimir Chat UI - Vercel Deployment"
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from example..."
    cp .env.example .env.local
    echo "✅ Please edit .env.local with your actual values before deploying"
    echo "📝 Required variables:"
    echo "   - BACKEND_URL"
    echo "   - OPENROUTER_API_KEY" 
    echo "   - GITHUB_TOKEN"
    exit 1
fi

# Build the project locally to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Post-deployment checklist:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Update BACKEND_URL with your actual backend URL"
echo "3. Test the deployed application"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
