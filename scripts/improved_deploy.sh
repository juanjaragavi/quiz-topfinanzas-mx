#!/bin/bash

# Description:
# This script handles the complete deployment process for the Next.js application.
# It coordinates the rebuild process and service restart with proper error handling.

# Fail on any error
set -e

# Variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="/var/www/quiz-topfinanzas-com" # Application directory
LOG_DIR="/var/log/app-rebuilds"         # Directory for log files
LOG_FILE="${LOG_DIR}/deploy.log"        # Absolute path to log file
APP_USER="juanjaramillo"                # User to run the service as

# Cleanup function to run on script exit
cleanup() {
  local exit_code=$?
  if [ $exit_code -ne 0 ]; then
    log_message "Script failed with exit code $exit_code"
    echo "Deployment failed. Check logs at $LOG_FILE"
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

# Main Script Execution
log_message "Starting deployment process."

# Step 1: Check user and permissions
check_user || exit 1

# Step 2: Rebuild the application
log_message "Starting application rebuild process..."
if [ "$EUID" -eq 0 ]; then
  "$SCRIPT_DIR/improved_rebuild_app.sh"
else
  sudo "$SCRIPT_DIR/improved_rebuild_app.sh"
fi

if [ $? -ne 0 ]; then
  log_message "Error: Application rebuild failed"
  exit 1
fi
log_message "Application rebuild completed successfully."

# Step 3: Restart the service
log_message "Starting service restart process..."
if [ "$EUID" -eq 0 ]; then
  "$SCRIPT_DIR/improved_restart_service.sh"
else
  sudo "$SCRIPT_DIR/improved_restart_service.sh"
fi

if [ $? -ne 0 ]; then
  log_message "Error: Service restart failed"
  exit 1
fi
log_message "Service restart completed successfully."

log_message "Deployment completed successfully."
echo "Deployment executed successfully. Application rebuilt and service restarted."
