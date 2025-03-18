#!/bin/bash

# Description:
# This script is a wrapper for the main deployment script.
# It ensures the deployment process is executed with appropriate permissions.

# Constants
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Display start message
echo "Starting deployment of the Next.js application..."
echo "This may take a few minutes. Please be patient."

# Execute the improved deployment script with sudo to ensure proper permissions
sudo "$SCRIPT_DIR/scripts/improved_deploy.sh"

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "Deployment completed successfully!"
else
    echo "Deployment failed. Check the logs for details."
    exit 1
fi

exit 0
