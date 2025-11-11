#!/bin/bash
# 创建产品 - 中文示例

curl -X POST https://api.example.com/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 你的API令牌" \
  -d '{
    "name": "笔记本电脑",
    "description": "高性能笔记本电脑，配备16GB内存和512GB固态硬盘",
    "price": 6999.99,
    "stock": 50
  }'
