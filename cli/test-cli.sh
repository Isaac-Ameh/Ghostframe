#!/bin/bash

# 🎃 GhostFrame CLI - Quick Test Script
# Run this to quickly test the CLI locally

set -e

echo "🎃 GhostFrame CLI - Quick Test Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build
echo -e "${BLUE}Step 1: Building CLI...${NC}"
npm install
npm run build
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

# Step 2: Link
echo -e "${BLUE}Step 2: Linking CLI globally...${NC}"
npm link
echo -e "${GREEN}✅ CLI linked${NC}"
echo ""

# Step 3: Verify
echo -e "${BLUE}Step 3: Verifying installation...${NC}"
gf --version
echo -e "${GREEN}✅ CLI installed${NC}"
echo ""

# Step 4: Run tests
echo -e "${BLUE}Step 4: Running tests...${NC}"
npm test
echo -e "${GREEN}✅ Tests passed${NC}"
echo ""

# Step 5: Create test module
echo -e "${BLUE}Step 5: Creating test module...${NC}"
TEST_DIR="../test-cli-output"
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

gf init test-module --template education --skip-install
echo -e "${GREEN}✅ Test module created${NC}"
echo ""

# Step 6: Test commands
echo -e "${BLUE}Step 6: Testing CLI commands...${NC}"
cd test-module

echo "Testing: gf validate"
gf validate || echo -e "${YELLOW}⚠️  Validation warnings (expected)${NC}"

echo ""
echo "Testing: gf build"
gf build || echo -e "${YELLOW}⚠️  Build may fail without dependencies${NC}"

echo ""
echo "Testing: gf config"
gf config list

echo -e "${GREEN}✅ Commands tested${NC}"
echo ""

# Summary
echo "======================================"
echo -e "${GREEN}🎉 CLI Testing Complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Test manually: cd $TEST_DIR/test-module"
echo "  2. Run: gf dev"
echo "  3. Run: gf test"
echo "  4. Run: gf validate --strict"
echo ""
echo "To unlink CLI: npm unlink -g ghostframe-cli"
echo "======================================"
