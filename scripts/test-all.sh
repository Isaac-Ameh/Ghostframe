#!/bin/bash

# GhostFrame Test Runner Script
# Runs all tests for both frontend and backend

echo "🎃 GhostFrame Test Suite Runner"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${2}${1}${NC}"
}

# Function to run tests and capture results
run_tests() {
    local component=$1
    local directory=$2
    local test_command=$3
    
    print_status "Running $component tests..." $YELLOW
    cd $directory
    
    if $test_command; then
        print_status "✅ $component tests passed!" $GREEN
        return 0
    else
        print_status "❌ $component tests failed!" $RED
        return 1
    fi
}

# Initialize counters
total_tests=0
passed_tests=0

# Backend Tests
echo ""
print_status "🔧 Backend Tests" $YELLOW
echo "=================="

cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..." $YELLOW
    npm install
fi

# Run backend tests
if run_tests "Backend Unit" "." "npm test"; then
    ((passed_tests++))
fi
((total_tests++))

if run_tests "Backend Integration" "." "npm run test -- --testPathPattern=integration"; then
    ((passed_tests++))
fi
((total_tests++))

if run_tests "Backend Performance" "." "npm run test -- --testPathPattern=performance"; then
    ((passed_tests++))
fi
((total_tests++))

# Frontend Tests
echo ""
print_status "🎨 Frontend Tests" $YELLOW
echo "=================="

cd ../frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..." $YELLOW
    npm install
fi

# Run frontend tests
if run_tests "Frontend Unit" "." "npm test -- --watchAll=false"; then
    ((passed_tests++))
fi
((total_tests++))

if run_tests "Frontend Integration" "." "npm test -- --testPathPattern=integration --watchAll=false"; then
    ((passed_tests++))
fi
((total_tests++))

# Type checking
echo ""
print_status "🔍 Type Checking" $YELLOW
echo "================="

cd ../backend
if run_tests "Backend TypeScript" "." "npm run type-check"; then
    ((passed_tests++))
fi
((total_tests++))

cd ../frontend
if run_tests "Frontend TypeScript" "." "npm run type-check"; then
    ((passed_tests++))
fi
((total_tests++))

# Linting
echo ""
print_status "🧹 Code Quality" $YELLOW
echo "================"

cd ../backend
if run_tests "Backend Linting" "." "npm run lint"; then
    ((passed_tests++))
fi
((total_tests++))

cd ../frontend
if run_tests "Frontend Linting" "." "npm run lint"; then
    ((passed_tests++))
fi
((total_tests++))

# Summary
echo ""
print_status "📊 Test Summary" $YELLOW
echo "================"
echo "Total test suites: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $((total_tests - passed_tests))"

if [ $passed_tests -eq $total_tests ]; then
    print_status "🎉 All tests passed! GhostFrame is ready for the hackathon!" $GREEN
    exit 0
else
    print_status "⚠️  Some tests failed. Please review the output above." $RED
    exit 1
fi