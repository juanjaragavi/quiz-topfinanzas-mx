#!/bin/bash

# Description:
# This script rebuilds a Next.js application by removing existing build artifacts,
# installing dependencies, and rebuilding the application.
# It includes error handling and logging for each operation.

# Variables
APP_DIR="/var/www/quiz-topfinanzas-com" # Application directory
LOG_DIR="/var/log/app-rebuilds"         # Directory for log files
LOG_FILE="${LOG_DIR}/rebuild_app.log"   # Absolute path to log file

# Functions

# Log messages to a file
log_message() {
    # Create log directory if it doesn't exist
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >>"$LOG_FILE"
}

# Check if a command executed successfully
check_error() {
    local exit_code=$?
    local error_message="$1"

    if [ $exit_code -ne 0 ]; then
        log_message "Error: $error_message (Exit code: $exit_code)"
        echo "Error: $error_message (Exit code: $exit_code)"
        exit $exit_code
    fi
}

# Main Script Execution
log_message "Starting application rebuild process."

# Step 1: Navigate to application directory
if ! cd "$APP_DIR"; then
    log_message "Error: Failed to change directory to $APP_DIR"
    echo "Error: Failed to change directory to $APP_DIR"
    exit 1
fi
log_message "Successfully changed to application directory: $APP_DIR"

# Step 2: Clean up existing build files
log_message "Removing existing node_modules and .next directories"
sudo rm -rf node_modules .next
check_error "Failed to remove existing build artifacts"

# Step 3: Install dependencies
log_message "Installing dependencies with bun"
sudo bun install
check_error "Failed to install dependencies"

# Step 4: Build the application
log_message "Building the application"
sudo bun run build
check_error "Failed to build the application"

log_message "Application rebuild completed successfully."
echo "Script executed successfully. Check the log file ($LOG_FILE) for details."
