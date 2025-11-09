// JavaScript Example - Get Access Token
const axios = require('axios');

async function getAccessToken() {
  try {
    const response = await axios.post('https://api.example.com/auth/token', {
      appId: 'your-app-id',
      appSecret: 'your-app-secret'
    });

    console.log('Access Token:', response.data.data.accessToken);
    return response.data;
  } catch (error) {
    console.error('Authentication failed:', error.message);
    throw error;
  }
}

getAccessToken();
