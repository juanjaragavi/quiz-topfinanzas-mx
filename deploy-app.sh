#!/bin/bash

# Description:
# Simple wrapper script to execute the deploy.sh script from the scripts folder.
# This makes it easier to run the deployment process from the project root.

SCRIPTS_DIR="$(dirname "$(readlink -f "$0")")/scripts"
DEPLOY_SCRIPT="${SCRIPTS_DIR}/deploy.sh"

# Check if deploy script exists
if [ ! -f "$DEPLOY_SCRIPT" ]; then
    echo "Error: Deploy script not found at $DEPLOY_SCRIPT"
    exit 1
fi

# Make script executable if it isn't already
chmod +x "$DEPLOY_SCRIPT"

# Execute the deploy script
echo "Starting deployment process..."
"$DEPLOY_SCRIPT"
