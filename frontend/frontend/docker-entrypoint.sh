#!/bin/sh

# Replace environment variables in the JavaScript files
# This allows runtime configuration of the frontend app

# Find the main JavaScript file
JS_FILE=$(find /usr/share/nginx/html/assets -name "*.js" -type f -exec grep -l "REACT_APP_API_URL" {} \; | head -n 1)

if [ -n "$JS_FILE" ]; then
  echo "Configuring environment variables in $JS_FILE"
  
  # Replace environment variables
  sed -i "s|REACT_APP_API_URL|${REACT_APP_API_URL:-http://localhost:8000/api}|g" $JS_FILE
  sed -i "s|REACT_APP_PAYMOB_API_KEY|${REACT_APP_PAYMOB_API_KEY:-}|g" $JS_FILE
  sed -i "s|REACT_APP_PAYMOB_INTEGRATION_ID|${REACT_APP_PAYMOB_INTEGRATION_ID:-}|g" $JS_FILE
  
  echo "Environment variables configured"
else
  echo "Warning: Could not find main JavaScript file for environment variable replacement"
fi

# Execute the CMD from the Dockerfile
exec "$@"
