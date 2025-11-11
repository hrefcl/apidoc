#!/usr/bin/env python3
# Create Product - English Example

import requests
import json

def create_product():
    """Create a new product in the system"""

    url = "https://api.example.com/products"

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_TOKEN"
    }

    payload = {
        "name": "Laptop Computer",
        "description": "High performance laptop with 16GB RAM and 512GB SSD",
        "price": 999.99,
        "stock": 50
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()

        data = response.json()
        print(f"Product created successfully: {json.dumps(data, indent=2)}")
        return data

    except requests.exceptions.RequestException as error:
        print(f"Error creating product: {error}")
        raise

if __name__ == "__main__":
    create_product()
