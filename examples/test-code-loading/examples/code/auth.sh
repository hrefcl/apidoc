#!/bin/bash
# cURL Example - Get Access Token

curl -X POST "https://api.example.com/auth/token" \
  -H "Content-Type: application/json" \
  -d '{
    "appId": "your-app-id",
    "appSecret": "your-app-secret"
  }'
