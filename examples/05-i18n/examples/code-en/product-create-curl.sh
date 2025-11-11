#!/bin/bash
# Create Product - English Example

curl -X POST https://api.example.com/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "name": "Laptop Computer",
    "description": "High performance laptop with 16GB RAM and 512GB SSD",
    "price": 999.99,
    "stock": 50
  }'
