#!/usr/bin/env python3
# 创建产品 - 中文示例

import requests
import json

def create_product():
    """在系统中创建新产品"""

    url = "https://api.example.com/products"

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer 你的API令牌"
    }

    payload = {
        "name": "笔记本电脑",
        "description": "高性能笔记本电脑，配备16GB内存和512GB固态硬盘",
        "price": 6999.99,
        "stock": 50
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()

        data = response.json()
        print(f"产品创建成功: {json.dumps(data, indent=2, ensure_ascii=False)}")
        return data

    except requests.exceptions.RequestException as error:
        print(f"创建产品时出错: {error}")
        raise

if __name__ == "__main__":
    create_product()
