# Authentication

Learn how to authenticate your API requests.

## API Keys

All API requests require an API key for authentication. Include your key in the `Authorization` header:

```
Authorization: Bearer YOUR_API_KEY
```

## Getting an API Key

1. Log in to your dashboard
2. Navigate to Settings > API Keys
3. Click "Generate New Key"
4. Copy and store your key securely

## Security Best Practices

- Never share your API keys
- Rotate keys regularly
- Use environment variables for keys
- Implement rate limiting

## Example Request

```javascript
fetch('https://api.example.com/v1/users', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
```
