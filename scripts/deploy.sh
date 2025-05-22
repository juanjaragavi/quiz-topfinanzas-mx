#!/bin/bash

# Enhanced deployment script for TopFinanzas Next.js application
# Optimized to handle content updates from LLM-based Agents via n8n workflows
# Supports both content-only updates and code changes

# Configuration
SERVICE_NAME="quiz-topfinanzas-mx"
LOG_FILE="/var/log/topfinanzas-rebuilds.log"
PROJECT_DIR="/var/www/html/quiz-topfinanzas-mx"
STRINGS_DIR="${PROJECT_DIR}/lib/strings.ts"
CONSTANTS_DIR="${PROJECT_DIR}/lib/constants.ts"
BACKUP_BASE_DIR="${PROJECT_DIR}/backups"
STRINGS_BACKUP_DIR="${BACKUP_BASE_DIR}/strings/$(date +%Y%m%d_%H%M%S)"
UPDATE_TYPE="${1:-full}" # Default to full update if not specified
DEPLOY_ID="$(date +%Y%m%d%H%M%S)"
STATUS_FILE="/tmp/deploy_status_${DEPLOY_ID}.json"

# Function for logging with timestamps
log_message() {
    local level="$1"
    local message="$2"
    echo "$(date +'%Y-%m-%d %H:%M:%S') [${level}] [${DEPLOY_ID}]: ${message}" | tee -a $LOG_FILE
}

# Function to report status back (useful for n8n workflow integration)
report_status() {
    local status="$1"
    local message="$2"
    local details="${3:-{}}"

    # Create JSON status output
    echo "{\"status\":\"${status}\",\"message\":\"${message}\",\"deploy_id\":\"${DEPLOY_ID}\",\"timestamp\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",\"details\":${details}}" >$STATUS_FILE

    # Also log the status message
    log_message "${status}" "${message}"

    # If status is error, exit with failure code
    if [ "$status" = "ERROR" ]; then
        exit 1
    fi
}

# Create backups of string files before making changes
backup_strings() {
    # Backup string constants files
    log_message "INFO" "Creating strings backup in ${STRINGS_BACKUP_DIR}"
    mkdir -p "${STRINGS_BACKUP_DIR}"

    # Backup constants.ts file
    if [ -f "$CONSTANTS_DIR" ]; then
        cp "$CONSTANTS_DIR" "${STRINGS_BACKUP_DIR}/constants.ts"
        log_message "INFO" "Constants file backup completed successfully"
    else
        log_message "WARNING" "Constants file not found, skipping backup"
    fi

    # Backup strings.ts file
    if [ -f "$STRINGS_DIR" ]; then
        cp "$STRINGS_DIR" "${STRINGS_BACKUP_DIR}/strings.ts"
        log_message "INFO" "Strings file backup completed successfully"
    else
        log_message "WARNING" "Strings file not found, skipping backup"
    fi
}

# Function is removed - no validation required as per request

# Main deployment process
log_message "INFO" "Starting deployment process (Type: ${UPDATE_TYPE})"

# Navigate to project directory
cd $PROJECT_DIR || {
    report_status "ERROR" "Could not navigate to project directory"
}

# Backup string files
backup_strings

# Process based on update type
if [ "$UPDATE_TYPE" = "content-only" ]; then
    log_message "INFO" "Processing content-only update"

    # For content-only updates, we only need to rebuild, not pull code
    log_message "INFO" "Skipping git pull for content-only update"
else
    log_message "INFO" "Processing full update (code + content)"

    # Pull latest changes from git
    log_message "INFO" "Pulling latest code changes"
    sudo git fetch --all
    sudo git merge origin/main

    if [ $? -ne 0 ]; then
        report_status "ERROR" "Git pull failed" "{\"git_error\":true}"
    fi

    # Install dependencies if package.json changed
    if git diff --name-only HEAD@{1} | grep -q "package.json"; then
        log_message "INFO" "package.json changed, installing dependencies"
        sudo bun install

        if [ $? -ne 0 ]; then
            report_status "ERROR" "Dependency installation failed"
        fi
    fi

    # For full updates, clean the cache more thoroughly
    log_message "INFO" "Cleaning build cache"
    sudo rm -rf .next
    sudo npm cache clean --force
fi

# Build the Next.js application
log_message "INFO" "Building Next.js application"
sudo bun run build

if [ $? -eq 0 ]; then
    log_message "SUCCESS" "Build completed successfully"

    # Update application - restart PM2 service
    log_message "INFO" "Restarting application service"
    sudo pm2 restart $SERVICE_NAME

    # Wait for service to restart
    sleep 3

    # Check if service is running properly
    sudo pm2 show $SERVICE_NAME | grep -q "online"

    if [ $? -eq 0 ]; then
        # Save PM2 configuration
        sudo pm2 save

        # Report success
        report_status "SUCCESS" "Deployment completed successfully" "{\"update_type\":\"${UPDATE_TYPE}\"}"

        # For monitoring, log memory usage after deployment
        log_message "INFO" "Current memory usage: $(free -m | grep Mem | awk '{print $3}')MB / $(free -m | grep Mem | awk '{print $2}')MB"
        exit 0
    else
        report_status "ERROR" "Service restart failed" "{\"pm2_error\":true,\"restored_backup\":false}"
    fi
else
    report_status "ERROR" "Build failed" "{\"build_error\":true,\"restored_backup\":false}"
fi
