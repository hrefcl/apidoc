// 创建产品 - 中文示例

const createProduct = async () => {
  try {
    const response = await fetch('https://api.example.com/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 你的API令牌'
      },
      body: JSON.stringify({
        name: '笔记本电脑',
        description: '高性能笔记本电脑，配备16GB内存和512GB固态硬盘',
        price: 6999.99,
        stock: 50
      })
    });

    const data = await response.json();
    console.log('产品创建成功:', data);
    return data;
  } catch (error) {
    console.error('创建产品时出错:', error);
    throw error;
  }
};

// 执行
createProduct();
