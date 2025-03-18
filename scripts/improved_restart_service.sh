#!/bin/bash

# Description:
# This script restarts the Next.js application service using PM2.
# It includes pre-flight checks, port conflict resolution, and validation steps.
# Updated with improved error handling and user context consistency.

# Fail on any error
set -e

# Variables
SERVICE_NAME="quiz-topfinanzas-com"  # Name of the PM2 service
PORT=3002                            # Port used by the application
APP_DIR="/var/www/quiz-topfinanzas-com" # Application directory
LOG_DIR="/var/log/app-rebuilds"         # Directory for log files
LOG_FILE="${LOG_DIR}/restart_service.log" # Path to log file
APP_USER="juanjaramillo"            # User to run the service as

# Cleanup function to run on script exit
cleanup() {
  local exit_code=$?
  if [ $exit_code -ne 0 ]; then
    log_message "Script failed with exit code $exit_code"
    echo "Failed to restart service. Check logs at $LOG_FILE"
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
    log_message "Running as root. Will use runuser to execute PM2 commands as $APP_USER"
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

# Run command as application user if current user is root
run_as_app_user() {
  if [ "$EUID" -eq 0 ]; then
    runuser -l "$APP_USER" -c "$1"
  else
    eval "$1"
  fi
}

# Check if port is in use
check_port() {
  log_message "Checking if port $PORT is in use..."
  if lsof -i :"$PORT" > /dev/null 2>&1; then
    log_message "Port $PORT is already in use. Identifying process..."
    
    # Get PID using the port
    local pid=$(lsof -i :"$PORT" -t)
    
    if [ -n "$pid" ]; then
      log_message "Process with PID $pid is using port $PORT."
      
      # Get process details
      ps -p "$pid" -o user,pid,cmd | tail -n +2
      
      log_message "Attempting to kill process $pid..."
      if [ "$EUID" -eq 0 ]; then
        kill -15 "$pid" || kill -9 "$pid"
      else
        sudo kill -15 "$pid" || sudo kill -9 "$pid"
      fi
      
      # Wait for port to be released
      local counter=0
      while lsof -i :"$PORT" > /dev/null 2>&1; do
        if [ "$counter" -ge 10 ]; then
          log_message "Error: Failed to release port $PORT after 5 seconds"
          return 1
        fi
        counter=$((counter+1))
        log_message "Waiting for port $PORT to be released... ($counter/10)"
        sleep 0.5
      done
      log_message "Port $PORT has been released"
    fi
  else
    log_message "Port $PORT is available"
  fi
  return 0
}

# Check PM2 process
check_pm2_process() {
  log_message "Checking for existing PM2 process: $SERVICE_NAME"
  
  # Check as current user
  if run_as_app_user "pm2 describe $SERVICE_NAME" > /dev/null 2>&1; then
    log_message "PM2 process '$SERVICE_NAME' found as $APP_USER. Stopping and deleting..."
    run_as_app_user "pm2 stop $SERVICE_NAME"
    run_as_app_user "pm2 delete $SERVICE_NAME"
    return 0
  fi
  
  # Check as root (if current user is not root)
  if [ "$EUID" -ne 0 ]; then
    if sudo pm2 describe "$SERVICE_NAME" > /dev/null 2>&1; then
      log_message "PM2 process '$SERVICE_NAME' found as root. Stopping and deleting with sudo..."
      sudo pm2 stop "$SERVICE_NAME"
      sudo pm2 delete "$SERVICE_NAME"
    fi
  fi
  
  log_message "No existing PM2 process found or all existing processes have been stopped"
  return 0
}

# Verify service is running
verify_service() {
  log_message "Verifying service is running properly..."
  
  # Wait for service to start
  sleep 2
  
  # Check if process is running in PM2
  if ! run_as_app_user "pm2 describe $SERVICE_NAME" | grep -q "online"; then
    log_message "Error: Service is not running in PM2"
    return 1
  fi
  
  # Check if port is in use by our service
  if ! lsof -i :"$PORT" > /dev/null 2>&1; then
    log_message "Error: Port $PORT is not in use after service start"
    return 1
  fi
  
  log_message "Service verification complete. Service is running properly."
  return 0
}

# Main Script Execution
log_message "Starting service restart process for $SERVICE_NAME"

# Step 1: Check user and directory
check_user || exit 1

# Step 2: Change to application directory
if ! cd "$APP_DIR"; then
  log_message "Error: Failed to change directory to $APP_DIR"
  exit 1
fi
log_message "Changed to application directory: $APP_DIR"

# Step 3: Check and stop any existing PM2 processes
check_pm2_process

# Step 4: Check and resolve port conflicts
check_port || exit 1

# Step 5: Start the service with PM2
log_message "Starting service with PM2..."
if [ "$EUID" -eq 0 ]; then
  runuser -l "$APP_USER" -c "cd $APP_DIR && pm2 start npm --name \"$SERVICE_NAME\" -- start"
else
  pm2 start npm --name "$SERVICE_NAME" -- start
fi

# Step 6: Save PM2 configuration
log_message "Saving PM2 configuration..."
if [ "$EUID" -eq 0 ]; then
  runuser -l "$APP_USER" -c "pm2 save"
else
  pm2 save
fi

# Step 7: Verify service is running
verify_service || exit 1

# Step 8: Configure PM2 to start on system boot if not already configured
log_message "Ensuring PM2 starts on system boot..."
if [ "$EUID" -eq 0 ]; then
  # For root, configure PM2 startup for the app user
  env PATH=$PATH:/usr/bin pm2 startup systemd -u "$APP_USER" --hp "/home/$APP_USER"
  systemctl enable pm2-$APP_USER
else
  # For non-root, just ensure PM2 is saved
  pm2 save
fi

# Step 9: Flush PM2 logs to prevent log bloat
log_message "Flushing PM2 logs..."
if [ "$EUID" -eq 0 ]; then
  runuser -l "$APP_USER" -c "pm2 flush"
else
  pm2 flush
fi

log_message "Service restart completed successfully."
echo "Service '$SERVICE_NAME' has been successfully restarted and is running on port $PORT."
echo "Check log file ($LOG_FILE) for details."
