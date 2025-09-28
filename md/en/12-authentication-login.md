---
title: "Authentication Login Interface"
category: "Security"
order: 12.2
---

# 🔐 Authentication Login Interface

Complete guide for customizing and implementing APIDoc's authentication login interface, including UI customization, branding, and user experience optimization.

## 🎨 Default Login Interface

### Standard Login Form
The default authentication interface provides a clean, professional login experience:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation - Login</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            width: 100%;
            max-width: 400px;
            backdrop-filter: blur(10px);
        }

        .logo {
            text-align: center;
            margin-bottom: 2rem;
        }

        .logo img {
            max-height: 60px;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #374151;
        }

        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.2s;
        }

        input[type="text"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .login-button {
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .login-button:hover {
            transform: translateY(-1px);
        }

        .error-message {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 0.75rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            font-size: 0.875rem;
        }

        .remember-me {
            display: flex;
            align-items: center;
            margin: 1rem 0;
        }

        .remember-me input {
            margin-right: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <img src="./assets/logo.png" alt="Company Logo">
            <h2>API Documentation</h2>
            <p>Please sign in to access the documentation</p>
        </div>

        <form method="POST" action="/auth/login">
            <div class="form-group">
                <label for="username">Username or Email</label>
                <input type="text" id="username" name="username" required>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>

            <div class="remember-me">
                <input type="checkbox" id="rememberMe" name="rememberMe">
                <label for="rememberMe">Remember me for 30 days</label>
            </div>

            <button type="submit" class="login-button">Sign In</button>
        </form>

        <div class="footer">
            <p><a href="/auth/forgot-password">Forgot your password?</a></p>
            <p><a href="mailto:support@company.com">Need help? Contact support</a></p>
        </div>
    </div>
</body>
</html>
```

## 🎨 Custom Branding

### Company Branding Configuration
```json
{
  "authentication": {
    "loginPage": {
      "title": "Acme Corp API Portal",
      "subtitle": "Developer Documentation Access",
      "logo": "./assets/acme-logo.png",
      "favicon": "./assets/favicon.ico",
      "primaryColor": "#007bff",
      "secondaryColor": "#6c757d",
      "backgroundColor": "#f8f9fa",
      "backgroundImage": "./assets/login-bg.jpg",
      "customCSS": "./assets/login-custom.css",
      "footer": {
        "text": "© 2024 Acme Corp. All rights reserved.",
        "links": [
          {
            "text": "Privacy Policy",
            "url": "https://acme.com/privacy"
          },
          {
            "text": "Terms of Service",
            "url": "https://acme.com/terms"
          }
        ]
      }
    }
  }
}
```

### Advanced Custom CSS
```css
/* assets/login-custom.css */

/* Custom color scheme */
:root {
  --primary-color: #007bff;
  --primary-dark: #0056b3;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
}

/* Modern glassmorphism effect */
.login-container {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

/* Animated gradient background */
body {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Enhanced form elements */
.form-group {
  position: relative;
}

.form-group input {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.form-group input:focus {
  background: rgba(255, 255, 255, 1);
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

/* Floating labels */
.floating-label {
  position: relative;
}

.floating-label input {
  padding-top: 1.5rem;
}

.floating-label label {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: #6b7280;
  transition: all 0.2s ease;
  pointer-events: none;
}

.floating-label input:focus + label,
.floating-label input:not(:placeholder-shown) + label {
  top: 0.25rem;
  font-size: 0.75rem;
  color: var(--primary-color);
}

/* Custom button styles */
.login-button {
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  transition: all 0.3s ease;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.login-button:hover::before {
  left: 100%;
}

/* Error message animation */
.error-message {
  animation: slideInFromTop 0.3s ease-out;
}

@keyframes slideInFromTop {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading state */
.login-button.loading {
  pointer-events: none;
  opacity: 0.7;
}

.login-button.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-container {
    background: rgba(30, 30, 30, 0.9);
    color: white;
  }

  .form-group input {
    background: rgba(60, 60, 60, 0.8);
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
  }

  .form-group label {
    color: #d1d5db;
  }
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .login-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  .logo h2 {
    font-size: 1.5rem;
  }

  .form-group input,
  .login-button {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
```

## 🔧 Interactive Features

### JavaScript Enhancements
```javascript
// assets/login-enhancements.js

class LoginInterface {
  constructor() {
    this.form = document.querySelector('form');
    this.submitButton = document.querySelector('.login-button');
    this.usernameField = document.getElementById('username');
    this.passwordField = document.getElementById('password');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFloatingLabels();
    this.setupPasswordStrength();
    this.setupRememberMe();
    this.setupKeyboardShortcuts();
  }

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.usernameField.addEventListener('input', () => this.validateUsername());
    this.passwordField.addEventListener('input', () => this.validatePassword());
  }

  setupFloatingLabels() {
    const floatingLabels = document.querySelectorAll('.floating-label');

    floatingLabels.forEach(container => {
      const input = container.querySelector('input');
      const label = container.querySelector('label');

      input.addEventListener('focus', () => {
        label.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        if (!input.value) {
          label.classList.remove('focused');
        }
      });
    });
  }

  setupPasswordStrength() {
    const strengthMeter = document.createElement('div');
    strengthMeter.className = 'password-strength';
    strengthMeter.innerHTML = `
      <div class="strength-bar">
        <div class="strength-fill"></div>
      </div>
      <div class="strength-text">Password strength</div>
    `;

    this.passwordField.parentNode.appendChild(strengthMeter);

    this.passwordField.addEventListener('input', (e) => {
      const strength = this.calculatePasswordStrength(e.target.value);
      this.updatePasswordStrength(strengthMeter, strength);
    });
  }

  calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;

    return {
      score,
      checks,
      percentage: (score / 5) * 100,
      level: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong'
    };
  }

  updatePasswordStrength(meter, strength) {
    const fill = meter.querySelector('.strength-fill');
    const text = meter.querySelector('.strength-text');

    fill.style.width = `${strength.percentage}%`;
    fill.className = `strength-fill ${strength.level}`;
    text.textContent = `Password strength: ${strength.level}`;

    meter.style.display = strength.score > 0 ? 'block' : 'none';
  }

  setupRememberMe() {
    const rememberCheckbox = document.getElementById('rememberMe');
    const saved = localStorage.getItem('remember-username');

    if (saved && rememberCheckbox) {
      this.usernameField.value = saved;
      rememberCheckbox.checked = true;
    }

    if (rememberCheckbox) {
      rememberCheckbox.addEventListener('change', (e) => {
        if (e.target.checked && this.usernameField.value) {
          localStorage.setItem('remember-username', this.usernameField.value);
        } else {
          localStorage.removeItem('remember-username');
        }
      });
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Enter to submit
      if (e.key === 'Enter' && (e.target === this.usernameField || e.target === this.passwordField)) {
        this.form.dispatchEvent(new Event('submit'));
      }

      // Escape to clear
      if (e.key === 'Escape') {
        this.clearForm();
      }
    });
  }

  validateUsername() {
    const username = this.usernameField.value.trim();
    const isValid = username.length >= 3;

    this.toggleFieldValidation(this.usernameField, isValid);
    return isValid;
  }

  validatePassword() {
    const password = this.passwordField.value;
    const isValid = password.length >= 6;

    this.toggleFieldValidation(this.passwordField, isValid);
    return isValid;
  }

  toggleFieldValidation(field, isValid) {
    field.classList.toggle('valid', isValid);
    field.classList.toggle('invalid', !isValid);
  }

  async handleSubmit(e) {
    e.preventDefault();

    const isValidUsername = this.validateUsername();
    const isValidPassword = this.validatePassword();

    if (!isValidUsername || !isValidPassword) {
      this.showError('Please correct the highlighted fields');
      return;
    }

    this.setLoading(true);

    try {
      const response = await this.submitLogin();
      if (response.success) {
        this.showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = response.redirect || '/';
        }, 1000);
      } else {
        this.showError(response.message || 'Login failed');
      }
    } catch (error) {
      this.showError('Connection error. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }

  async submitLogin() {
    const formData = new FormData(this.form);
    const response = await fetch('/auth/login', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    return await response.json();
  }

  setLoading(loading) {
    this.submitButton.classList.toggle('loading', loading);
    this.submitButton.disabled = loading;

    if (loading) {
      this.submitButton.dataset.originalText = this.submitButton.textContent;
      this.submitButton.textContent = 'Signing in...';
    } else {
      this.submitButton.textContent = this.submitButton.dataset.originalText || 'Sign In';
    }
  }

  showError(message) {
    this.showMessage(message, 'error');
  }

  showSuccess(message) {
    this.showMessage(message, 'success');
  }

  showMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}-message`;
    messageDiv.textContent = message;

    this.form.insertBefore(messageDiv, this.form.firstChild);

    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }

  clearForm() {
    this.usernameField.value = '';
    this.passwordField.value = '';
    this.usernameField.focus();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LoginInterface();
});
```

## 🌐 Multi-language Support

### Language Configuration
```json
{
  "authentication": {
    "loginPage": {
      "languages": {
        "en": {
          "title": "API Documentation",
          "subtitle": "Please sign in to access the documentation",
          "username": "Username or Email",
          "password": "Password",
          "rememberMe": "Remember me for 30 days",
          "signIn": "Sign In",
          "forgotPassword": "Forgot your password?",
          "needHelp": "Need help? Contact support"
        },
        "es": {
          "title": "Documentación API",
          "subtitle": "Por favor inicie sesión para acceder a la documentación",
          "username": "Usuario o Email",
          "password": "Contraseña",
          "rememberMe": "Recordarme por 30 días",
          "signIn": "Iniciar Sesión",
          "forgotPassword": "¿Olvidó su contraseña?",
          "needHelp": "¿Necesita ayuda? Contacte soporte"
        },
        "fr": {
          "title": "Documentation API",
          "subtitle": "Veuillez vous connecter pour accéder à la documentation",
          "username": "Nom d'utilisateur ou Email",
          "password": "Mot de passe",
          "rememberMe": "Se souvenir de moi pendant 30 jours",
          "signIn": "Se connecter",
          "forgotPassword": "Mot de passe oublié?",
          "needHelp": "Besoin d'aide? Contactez le support"
        }
      },
      "defaultLanguage": "en",
      "languageSelector": true
    }
  }
}
```

## 📱 Mobile Optimization

### Responsive Design
```css
/* Mobile-first responsive design */
.login-container {
  width: 100%;
  max-width: 400px;
  margin: 0 1rem;
}

@media (max-width: 768px) {
  body {
    padding: 1rem;
  }

  .login-container {
    padding: 1.5rem;
  }

  .logo img {
    max-height: 40px;
  }

  .form-group input,
  .login-button {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 1rem;
  }

  .remember-me {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    margin: 0.5rem;
    padding: 1rem;
  }

  .logo h2 {
    font-size: 1.25rem;
  }

  .logo p {
    font-size: 0.875rem;
  }
}

/* Touch-friendly inputs */
@media (hover: none) and (pointer: coarse) {
  .form-group input,
  .login-button {
    min-height: 44px; /* iOS touch target minimum */
  }

  .remember-me input[type="checkbox"] {
    width: 20px;
    height: 20px;
  }
}
```

## 🔒 Security Features

### CSRF Protection
```html
<!-- CSRF token in form -->
<form method="POST" action="/auth/login">
  <input type="hidden" name="_token" value="{{ csrf_token }}">
  <!-- Other form fields -->
</form>
```

### Rate Limiting Display
```javascript
// Display rate limiting information
class RateLimitHandler {
  constructor() {
    this.checkRateLimit();
  }

  async checkRateLimit() {
    try {
      const response = await fetch('/auth/rate-limit-status');
      const data = await response.json();

      if (data.remaining < 3) {
        this.showRateLimitWarning(data);
      }
    } catch (error) {
      console.warn('Could not check rate limit status');
    }
  }

  showRateLimitWarning(data) {
    const warning = document.createElement('div');
    warning.className = 'rate-limit-warning';
    warning.innerHTML = `
      <p>⚠️ ${data.remaining} login attempts remaining</p>
      <p>Please wait ${Math.ceil(data.resetTime / 60)} minutes if you exceed the limit</p>
    `;

    const form = document.querySelector('form');
    form.insertBefore(warning, form.firstChild);
  }
}
```

## 📋 Best Practices

### 1. User Experience
- ✅ Fast loading times (< 2 seconds)
- ✅ Clear error messages
- ✅ Accessible design (WCAG 2.1 AA)
- ✅ Mobile-first responsive design

### 2. Security
- ✅ HTTPS-only in production
- ✅ CSRF protection enabled
- ✅ Rate limiting with clear feedback
- ✅ Secure password requirements

### 3. Branding
- ✅ Consistent with company branding
- ✅ Professional appearance
- ✅ Clear value proposition
- ✅ Contact information available

### 4. Performance
- ✅ Optimized images and assets
- ✅ Minimal JavaScript
- ✅ Efficient CSS
- ✅ Fast server response times

The authentication login interface provides a secure, professional, and user-friendly entry point to your API documentation while maintaining strong security standards.