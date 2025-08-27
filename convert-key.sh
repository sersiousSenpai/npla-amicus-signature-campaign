#!/bin/bash

# Get the raw key from .env.local
RAW_KEY=$(grep RAW_KEY .env.local | cut -d "'" -f2- | sed "s/'$//")

# Write the raw key to a file
echo "$RAW_KEY" > key-pkcs1.pem

# Convert to PKCS#8
openssl pkcs8 -topk8 -inform PEM -outform PEM -in key-pkcs1.pem -out key-pkcs8.pem -nocrypt

# Format the new key for .env.local
echo "New key in PKCS#8 format:"
echo "GOOGLE_PRIVATE_KEY=\"$(cat key-pkcs8.pem | awk '{printf "%s\\n", $0}')\""

# Clean up
rm key-pkcs1.pem key-pkcs8.pem 