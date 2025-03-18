#!/bin/bash

# Description:
# This script restarts the Next.js application service managed by PM2.
# It stops the existing service, deletes it, and starts a new instance.
# It also saves the PM2 configuration and ensures it starts on system boot.
# Includes error handling and logging for each operation.

# Variables
APP_DIR="/var/www/quiz-topfinanzas-com"   # Application directory
LOG_DIR="/var/log/app-rebuilds"           # Directory for log files
LOG_FILE="${LOG_DIR}/restart_service.log" # Absolute path to log file
SERVICE_NAME="quiz-topfinanzas-com"       # PM2 service name

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
log_message "Starting service restart process."

# Step 1: Navigate to application directory
if ! cd "$APP_DIR"; then
    log_message "Error: Failed to change directory to $APP_DIR"
    echo "Error: Failed to change directory to $APP_DIR"
    exit 1
fi
log_message "Successfully changed to application directory: $APP_DIR"

# Step 2: Stop the existing PM2 service
log_message "Stopping PM2 service: $SERVICE_NAME"
sudo pm2 stop "$SERVICE_NAME"
check_error "Failed to stop PM2 service"

# Step 3: Delete the PM2 service
log_message "Deleting PM2 service: $SERVICE_NAME"
sudo pm2 delete "$SERVICE_NAME"
check_error "Failed to delete PM2 service"

# Step 4: Wait for processes to clean up
log_message "Waiting for processes to clean up"
sleep 5

# Step 5: Start the PM2 service
log_message "Starting new PM2 service: $SERVICE_NAME"
sudo pm2 start npm --name "$SERVICE_NAME" -- start
check_error "Failed to start PM2 service"

# Step 6: Wait for service to initialize
log_message "Waiting for service to initialize"
sleep 2

# Step 7: Save the PM2 configuration
log_message "Saving PM2 configuration"
sudo pm2 save
check_error "Failed to save PM2 configuration"

# Step 8: Wait for save to complete
log_message "Waiting for save to complete"
sleep 2

# Step 9: Configure PM2 to start on system boot
log_message "Configuring PM2 to start on system boot"
sudo pm2 startup
check_error "Failed to configure PM2 startup"

log_message "Service restart completed successfully."
echo "Script executed successfully. Check the log file ($LOG_FILE) for details."
