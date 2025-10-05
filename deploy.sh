#!/bin/bash

# Reaper Market Netlify Deployment Script
# This script automates the deployment process to Netlify

echo "🚀 Starting Reaper Market deployment to Netlify..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    print_error "Netlify CLI is not installed. Installing now..."
    npm install -g netlify-cli
    if [ $? -ne 0 ]; then
        print_error "Failed to install Netlify CLI. Please install it manually: npm install -g netlify-cli"
        exit 1
    fi
fi

print_status "Netlify CLI is available"

# Check if user is logged in to Netlify
if ! netlify status &> /dev/null; then
    print_warning "Not logged in to Netlify. Please login first:"
    netlify login
    if [ $? -ne 0 ]; then
        print_error "Failed to login to Netlify"
        exit 1
    fi
fi

print_status "Logged in to Netlify"

# Install dependencies
print_status "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

# Build the project
print_status "Building project..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_success "Build completed successfully"

# Deploy to Netlify
print_status "Deploying to Netlify..."

# Check if this is a new site or existing site
if [ -f ".netlify/state.json" ]; then
    print_status "Deploying to existing site..."
    netlify deploy --prod --dir=dist
else
    print_status "Creating new site and deploying..."
    netlify deploy --prod --dir=dist --open
fi

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully! 🎉"
    print_status "Your site is now live on Netlify!"
    
    # Get the site URL
    SITE_URL=$(netlify status | grep "Website URL" | awk '{print $3}')
    if [ ! -z "$SITE_URL" ]; then
        print_success "Site URL: $SITE_URL"
        print_status "You can also run 'netlify open' to open your site"
    fi
else
    print_error "Deployment failed"
    exit 1
fi

print_status "Deployment script completed!"

