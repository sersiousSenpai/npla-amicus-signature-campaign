#!/bin/bash

echo "🧹 Cleaning up development environment..."

# Kill any existing Next.js processes
echo "🔪 Killing existing dev processes..."
pkill -f "npm run dev" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# Clear Next.js cache
echo "🗑️  Clearing Next.js cache..."
rm -rf .next 2>/dev/null

# Clear node cache
echo "🗑️  Clearing node cache..."
rm -rf node_modules/.cache 2>/dev/null

# Start fresh dev server
echo "🚀 Starting fresh development server..."
npm run dev
