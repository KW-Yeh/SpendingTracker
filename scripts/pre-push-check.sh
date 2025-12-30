#!/bin/bash

# Pre-push check script
# Run this before pushing to ensure everything works

set -e  # Exit on error

echo "🚀 Pre-push checks starting..."
echo ""

# Navigate to my-app directory
cd "$(dirname "$0")/../my-app"

# 1. Type check
echo "📝 Step 1/3: Type checking..."
npm run type-check
echo "✅ Type check passed!"
echo ""

# 2. Build
echo "🏗️  Step 2/3: Building..."
npm run build
echo "✅ Build passed!"
echo ""

# 3. Lint
echo "🔍 Step 3/3: Linting..."
npm run lint
echo "✅ Lint passed!"
echo ""

echo "🎉 All checks passed! Safe to push."
echo ""
echo "To push: git push origin main"
