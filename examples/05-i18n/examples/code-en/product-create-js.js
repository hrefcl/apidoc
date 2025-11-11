// Create Product - English Example

const createProduct = async () => {
  try {
    const response = await fetch('https://api.example.com/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      },
      body: JSON.stringify({
        name: 'Laptop Computer',
        description: 'High performance laptop with 16GB RAM and 512GB SSD',
        price: 999.99,
        stock: 50
      })
    });

    const data = await response.json();
    console.log('Product created:', data);
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Execute
createProduct();
