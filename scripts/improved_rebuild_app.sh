#!/bin/bash

# Description:
# This script rebuilds a Next.js application by removing existing build artifacts,
# installing dependencies, and rebuilding the application.
# It includes error handling, user context standardization, and logging.

# Fail on any error
set -e

# Variables
APP_DIR="/var/www/quiz-topfinanzas-com" # Application directory
LOG_DIR="/var/log/app-rebuilds"         # Directory for log files
LOG_FILE="${LOG_DIR}/rebuild_app.log"   # Absolute path to log file
APP_USER="juanjaramillo"                # User to run the service as

# Cleanup function to run on script exit
cleanup() {
  local exit_code=$?
  if [ $exit_code -ne 0 ]; then
    log_message "Script failed with exit code $exit_code"
    echo "Failed to rebuild application. Check logs at $LOG_FILE"
  fi
}

# Set trap for cleanup on exit
trap cleanup EXIT

# Functions
# Log messages to a file
log_message() {
  # Create log directory if it doesn't exist
  mkdir -p "$(dirname "$LOG_FILE")"
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
  echo "$1"
}

# Check if the current user is root
check_user() {
  if [ "$EUID" -eq 0 ]; then
    log_message "Running as root. Commands will be run on behalf of $APP_USER where possible."
    return 0
  else
    current_user=$(whoami)
    if [ "$current_user" != "$APP_USER" ]; then
      log_message "Error: Script must be run as root or $APP_USER"
      return 1
    fi
    log_message "Running as $APP_USER"
    return 0
  fi
}

# Run command as root if needed (for operations requiring elevated privileges)
run_as_root() {
  if [ "$EUID" -eq 0 ]; then
    eval "$1"
  else
    sudo $1
  fi
}

# Main Script Execution
log_message "Starting application rebuild process."

# Step 1: Check user and permissions
check_user || exit 1

# Step 2: Navigate to application directory
if ! cd "$APP_DIR"; then
  log_message "Error: Failed to change directory to $APP_DIR"
  exit 1
fi
log_message "Successfully changed to application directory: $APP_DIR"

# Step 3: Clean up existing build files
log_message "Removing existing node_modules and .next directories"
run_as_root "rm -rf node_modules .next"
if [ $? -ne 0 ]; then
  log_message "Error: Failed to remove existing build artifacts"
  exit 1
fi

# Step 4: Set proper ownership of application directory
log_message "Setting proper ownership of application directory"
if [ "$EUID" -eq 0 ]; then
  chown -R "$APP_USER:$APP_USER" "$APP_DIR"
  if [ $? -ne 0 ]; then
    log_message "Error: Failed to set ownership of $APP_DIR to $APP_USER"
    exit 1
  fi
fi

# Step 5: Install dependencies
log_message "Installing dependencies with bun"
if [ "$EUID" -eq 0 ]; then
  su - "$APP_USER" -c "cd $APP_DIR && bun install"
else
  bun install
fi
if [ $? -ne 0 ]; then
  log_message "Error: Failed to install dependencies"
  exit 1
fi

# Step 6: Add font package
log_message "Adding @next/font package"
if [ "$EUID" -eq 0 ]; then
  su - "$APP_USER" -c "cd $APP_DIR && bun add @next/font"
else
  bun add @next/font
fi
if [ $? -ne 0 ]; then
  log_message "Error: Failed to add @next/font package"
  exit 1
fi

# Step 7: Build the application
log_message "Building the application"
if [ "$EUID" -eq 0 ]; then
  su - "$APP_USER" -c "cd $APP_DIR && bun run build"
else
  bun run build
fi
if [ $? -ne 0 ]; then
  log_message "Error: Failed to build the application"
  exit 1
fi

# Step 8: Ensure correct permissions on build artifacts
log_message "Setting proper permissions on build artifacts"
if [ "$EUID" -eq 0 ]; then
  chown -R "$APP_USER:$APP_USER" "$APP_DIR/.next" "$APP_DIR/node_modules"
  if [ $? -ne 0 ]; then
    log_message "Warning: Failed to set ownership of build artifacts to $APP_USER"
  fi
fi

log_message "Application rebuild completed successfully."
echo "Script executed successfully. Check the log file ($LOG_FILE) for details."
