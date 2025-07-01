#!/usr/bin/env bash

set -e

# macOS-specific development script for Void Clone
# This script provides easy commands for macOS developers

ROOT=$(dirname "$(dirname "$(realpath "$0")")")
cd "$ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
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

# Function to show usage
show_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build          - Build the project and React components"
    echo "  run            - Run Void Clone (with clean build)"
    echo "  run-fast       - Run Void Clone (skip prelaunch)"
    echo "  run-dev        - Run in development mode with debug options"
    echo "  run-debug      - Run with debugger enabled"
    echo "  watch          - Start watchers and run in development mode"
    echo "  test           - Run tests"
    echo "  clean          - Clean build artifacts"
    echo "  server         - Start code server"
    echo "  web            - Start web version"
    echo "  help           - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build       # Build the project"
    echo "  $0 run-dev     # Start in development mode"
    echo "  $0 watch       # Start with file watching"
}

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script is designed for macOS only."
    exit 1
fi

# Main command handling
case "${1:-help}" in
    "build")
        print_info "Building Void Clone for macOS..."
        npm run build-mac
        print_success "Build completed!"
        ;;
    
    "run")
        print_info "Starting Void Clone..."
        npm run code-mac
        ;;
    
    "run-fast")
        print_info "Starting Void Clone (fast mode)..."
        npm run code-mac-fast
        ;;
    
    "run-dev")
        print_info "Starting Void Clone in development mode..."
        npm run code-mac-dev
        ;;
    
    "run-debug")
        print_info "Starting Void Clone with debugger..."
        print_warning "Debugger will be available on port 5874"
        npm run code-mac-debug
        ;;
    
    "watch")
        print_info "Starting watchers and development mode..."
        npm run start-mac-watch
        ;;
    
    "test")
        print_info "Running tests..."
        npm run test-mac
        ;;
    
    "clean")
        print_info "Cleaning build artifacts..."
        npm run clean
        print_success "Clean completed!"
        ;;
    
    "server")
        print_info "Starting code server..."
        print_info "Server will be available at http://localhost:8080"
        npm run code-server-mac
        ;;
    
    "web")
        print_info "Starting web version..."
        print_info "Web version will be available at http://localhost:8080"
        npm run code-web-mac
        ;;
    
    "help"|"--help"|"-h"|"")
        show_usage
        ;;
    
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
