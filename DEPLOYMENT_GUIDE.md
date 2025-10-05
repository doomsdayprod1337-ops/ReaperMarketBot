# 🚀 Netlify Deployment Guide for Reaper Market

This guide will walk you through deploying your Vue.js Reaper Market application to Netlify.

## 📋 Prerequisites

- [Netlify account](https://netlify.com) (free tier available)
- [GitHub account](https://github.com) (for automatic deployments)
- Node.js 18+ installed locally
- Git installed and configured

## 🛠️ Setup Steps

### 1. **Prepare Your Repository**

First, make sure your code is in a Git repository:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Reaper Market Vue.js app with Netlify config"

# Create repository on GitHub and push
git remote add origin https://github.com/yourusername/reaper-market.git
git branch -M main
git push -u origin main
```

### 2. **Install Netlify CLI (Optional)**

For local testing and manual deployments:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Test your site locally
netlify dev
```

### 3. **Deploy to Netlify**

#### **Option A: GitHub Integration (Recommended)**

1. **Go to [Netlify](https://netlify.com) and sign in**
2. **Click "New site from Git"**
3. **Choose GitHub as your Git provider**
4. **Select your repository**
5. **Configure build settings:**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`
6. **Click "Deploy site"**

#### **Option B: Manual Deployment**

```bash
# Build your project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### **Option C: Drag & Drop**

1. Run `npm run build` locally
2. Drag the `dist` folder to [Netlify's deploy page](https://app.netlify.com/drop)

### 4. **Configure Environment Variables**

In your Netlify dashboard:

1. **Go to Site settings → Environment variables**
2. **Add the following variables:**

```
VITE_API_BASE_URL = /api
VITE_SUPABASE_URL = https://grtsdcwcfcdzjszrwkdb.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydHNkY3djZmNkempzenJ3a2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MDczNTAsImV4cCI6MjA0NjM4MzM1MH0.IrunBBHoXDBRZnYgKh3pn7oA8sRUyl9p9fX79yj14bM
WEBHOOK_SECRET = your_webhook_secret_here
NOWPAYMENTS_IPN_SECRET = your_nowpayments_ipn_secret_here
```

### 5. **Configure Domain (Optional)**

1. **Go to Site settings → Domain management**
2. **Click "Add custom domain"**
3. **Enter your domain name**
4. **Follow DNS configuration instructions**

## 🔧 Configuration Files Explained

### **netlify.toml**
- Main configuration file for Netlify
- Defines build settings, redirects, and headers
- Environment-specific configurations

### **_headers**
- HTTP headers for security and caching
- Cache static assets for 1 year
- Security headers for protection

### **_redirects**
- SPA routing configuration
- API function routing
- Fallback to index.html for client-side routing

### **netlify/functions/**
- Serverless functions for backend logic
- Payment webhook handlers
- API endpoints

## 🌐 Serverless Functions

Your deployment includes these serverless functions:

### **Payment Webhook** (`/api/payment-webhook`)
- Handles payment notifications
- Processes payment status updates
- Updates user balances and services

### **NowPayments IPN** (`/api/nowpayments-ipn`)
- Handles NowPayments instant payment notifications
- Validates payment signatures
- Processes crypto payments

### **Hello Function** (`/api/hello`)
- Example function for testing
- Demonstrates function structure

## 🚀 Deployment Commands

```bash
# Development with Netlify CLI
npm run netlify:dev

# Build and deploy to production
npm run netlify:build

# Deploy preview (for testing)
netlify deploy --dir=dist

# Deploy production
netlify deploy --prod --dir=dist
```

## 🔍 Testing Your Deployment

### **1. Test the Splash Screen**
- Visit your Netlify URL
- You should see the animated splash screen
- It should redirect to login after ~7.5 seconds

### **2. Test the Login Screen**
- Verify the beautiful login form loads
- Test form interactions and animations
- Check responsive design on mobile

### **3. Test Serverless Functions**
```bash
# Test hello function
curl https://your-site.netlify.app/api/hello

# Test payment webhook (POST request)
curl -X POST https://your-site.netlify.app/api/payment-webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 📊 Performance Optimization

### **Build Optimization**
- Assets are automatically compressed
- Images are optimized
- CSS and JS are minified
- Static assets are cached for 1 year

### **CDN Benefits**
- Global content delivery
- Automatic HTTPS
- DDoS protection
- 99.99% uptime SLA

## 🔒 Security Features

### **Headers Security**
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### **Function Security**
- CORS headers configured
- Input validation
- Error handling
- Signature verification (for webhooks)

## 🐛 Troubleshooting

### **Build Failures**
```bash
# Check build locally
npm run build

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

### **Function Errors**
- Check Netlify function logs
- Verify environment variables
- Test functions locally with `netlify dev`

### **Routing Issues**
- Verify `_redirects` file
- Check that all routes serve `index.html`
- Test client-side routing

### **Environment Variables**
- Ensure all required variables are set in Netlify
- Check variable names match exactly
- Redeploy after changing environment variables

## 📈 Monitoring & Analytics

### **Netlify Analytics**
- Built-in analytics dashboard
- Real-time visitor tracking
- Performance metrics
- Error monitoring

### **Function Monitoring**
- Function execution logs
- Performance metrics
- Error tracking
- Usage statistics

## 🔄 Continuous Deployment

With GitHub integration:
1. **Push to main branch** → Automatic deployment
2. **Pull requests** → Deploy previews
3. **Branch deployments** → Feature testing

## 💰 Pricing

### **Netlify Free Tier**
- 100GB bandwidth/month
- 300 build minutes/month
- 125,000 function invocations/month
- Form submissions: 100/month
- Custom domains: Unlimited

### **Pro Tier** ($19/month)
- 1TB bandwidth/month
- 1,000 build minutes/month
- 500,000 function invocations/month
- Form submissions: 1,000/month
- Advanced features and support

## 🎯 Next Steps

1. **Set up custom domain** (optional)
2. **Configure payment webhooks** with your payment provider
3. **Set up monitoring and alerts**
4. **Configure backup strategies**
5. **Set up staging environment**

## 📞 Support

- **Netlify Documentation**: https://docs.netlify.com
- **Netlify Community**: https://community.netlify.com
- **Vue.js Documentation**: https://vuejs.org/guide/

## 🎉 Success!

Your Reaper Market application is now live on Netlify with:
- ✅ Beautiful splash screen
- ✅ Enhanced login interface
- ✅ Serverless functions
- ✅ Automatic deployments
- ✅ Global CDN
- ✅ HTTPS security
- ✅ Performance optimization

Your site URL will be: `https://your-site-name.netlify.app`
