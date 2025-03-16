#!/bin/bash

# Description:
# This script performs a complete deployment of the Next.js application by:
# 1. Rebuilding the application (removing build artifacts, installing dependencies, and building)
# 2. Restarting the PM2 service to apply the changes
# It consolidates both operations in a single deployment workflow.

# Variables
LOG_DIR="/var/log/app-rebuilds"                    # Directory for log files
LOG_FILE="${LOG_DIR}/deploy.log"                   # Absolute path to log file
SCRIPTS_DIR="$(dirname "$(readlink -f "$0")")"     # Directory containing this script
REBUILD_SCRIPT="${SCRIPTS_DIR}/rebuild_app.sh"     # Path to rebuild script
RESTART_SCRIPT="${SCRIPTS_DIR}/restart_service.sh" # Path to restart script

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
log_message "Starting full deployment process."

# Step 1: Check if required scripts exist
if [ ! -f "$REBUILD_SCRIPT" ]; then
    log_message "Error: Rebuild script not found at $REBUILD_SCRIPT"
    echo "Error: Rebuild script not found at $REBUILD_SCRIPT"
    exit 1
fi

if [ ! -f "$RESTART_SCRIPT" ]; then
    log_message "Error: Restart script not found at $RESTART_SCRIPT"
    echo "Error: Restart script not found at $RESTART_SCRIPT"
    exit 1
fi

# Step 2: Make scripts executable if they aren't already
chmod +x "$REBUILD_SCRIPT" "$RESTART_SCRIPT"
check_error "Failed to make scripts executable"

# Step 3: Run the rebuild script
log_message "Running rebuild script"
echo "Step 1/2: Rebuilding application..."
"$REBUILD_SCRIPT"
check_error "Application rebuild failed"

# Step 4: Run the restart script
log_message "Running restart script"
echo "Step 2/2: Restarting service..."
"$RESTART_SCRIPT"
check_error "Service restart failed"

log_message "Full deployment completed successfully."
echo "Deployment completed successfully. The application has been rebuilt and restarted."
echo "Check the log files for details:"
echo "- Main deployment log: $LOG_FILE"
echo "- Rebuild log: ${LOG_DIR}/rebuild_app.log"
echo "- Restart log: ${LOG_DIR}/restart_service.log"
