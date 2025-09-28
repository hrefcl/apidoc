---
title: "Syntax Highlighting Themes"
category: "Customization"
order: 4
---

# 🌈 Syntax Highlighting Themes

APIDoc 4.0 includes 160+ professional syntax highlighting themes powered by highlight.js, providing beautiful code formatting for all supported programming languages.

## 🎨 Available Themes

### Light Themes
- **default** - Clean light theme
- **github** - GitHub-style highlighting
- **googlecode** - Google Code style
- **vs** - Visual Studio light
- **xcode** - Xcode light theme
- **atom-one-light** - Atom One Light
- **foundation** - Foundation framework
- **idea** - IntelliJ IDEA light

### Dark Themes
- **github-dark** - GitHub dark theme
- **vs2015** - Visual Studio 2015 dark
- **atom-one-dark** - Atom One Dark
- **monokai** - Monokai theme
- **tomorrow-night** - Tomorrow Night
- **darcula** - IntelliJ IDEA Darcula
- **nord** - Nord theme
- **dracula** - Dracula theme

### Popular Color Schemes
- **monokai-sublime** - Sublime Text Monokai
- **rainbow** - Rainbow theme
- **zenburn** - Zenburn color scheme
- **solarized-dark** - Solarized Dark
- **solarized-light** - Solarized Light
- **gruvbox-dark** - Gruvbox Dark
- **gruvbox-light** - Gruvbox Light

## ⚙️ Configuration

### Basic Theme Setup
```json
{
  "name": "My API",
  "version": "1.0.0",
  "template": {
    "highlightTheme": "github-dark"
  }
}
```

### Advanced Configuration
```json
{
  "template": {
    "highlightTheme": "atom-one-dark",
    "highlightLanguages": [
      "typescript",
      "javascript",
      "python",
      "java",
      "go",
      "rust",
      "php",
      "bash",
      "json",
      "yaml",
      "dockerfile",
      "nginx"
    ]
  }
}
```

## 🔧 Supported Languages

### Programming Languages
- **JavaScript** - ES6+, React, Vue, Angular
- **TypeScript** - Types, interfaces, generics
- **Python** - Python 2/3, Django, Flask
- **Java** - Java 8+, Spring, Android
- **C#** - .NET, ASP.NET, Unity
- **Go** - Goroutines, channels, modules
- **Rust** - Ownership, traits, macros
- **PHP** - PHP 7/8, Laravel, Symfony
- **Ruby** - Ruby on Rails, gems
- **Swift** - iOS, macOS development

### Web Technologies
- **HTML** - HTML5, semantic markup
- **CSS** - CSS3, Flexbox, Grid
- **SCSS/Sass** - Variables, mixins, nesting
- **Less** - Variables, mixins, functions
- **JSON** - Configuration, APIs
- **XML** - Markup, SOAP, RSS
- **YAML** - Configuration files
- **TOML** - Configuration format

### Shell & DevOps
- **Bash** - Shell scripts, commands
- **PowerShell** - Windows scripting
- **Dockerfile** - Container definitions
- **Nginx** - Web server configuration
- **Apache** - Web server configuration
- **Makefile** - Build automation

### Databases
- **SQL** - PostgreSQL, MySQL, SQLite
- **MongoDB** - NoSQL queries
- **Redis** - In-memory database
- **GraphQL** - Query language

## 🌟 Theme Examples

### GitHub Dark Theme
```json
{
  "template": {
    "highlightTheme": "github-dark"
  }
}
```

**Features:**
- ✅ Dark background with light text
- ✅ Excellent contrast ratios
- ✅ GitHub-familiar syntax colors
- ✅ Great for modern dark UIs

### Atom One Light Theme
```json
{
  "template": {
    "highlightTheme": "atom-one-light"
  }
}
```

**Features:**
- ✅ Clean light background
- ✅ Subtle but distinct colors
- ✅ Professional appearance
- ✅ Easy on the eyes

### Monokai Theme
```json
{
  "template": {
    "highlightTheme": "monokai"
  }
}
```

**Features:**
- ✅ Popular dark theme
- ✅ High contrast colors
- ✅ Distinctive syntax highlighting
- ✅ Widely recognized

## 🎨 Custom Theme Creation

### Creating Custom Themes
```css
/* custom-highlight.css */
.hljs {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Fira Code', 'Consolas', monospace;
}

/* Keywords */
.hljs-keyword,
.hljs-selector-tag,
.hljs-built_in {
  color: #4fd1c7;
  font-weight: 600;
}

/* Strings */
.hljs-string,
.hljs-attr {
  color: #9ae6b4;
}

/* Numbers */
.hljs-number,
.hljs-literal {
  color: #feb2b2;
}

/* Comments */
.hljs-comment,
.hljs-quote {
  color: #718096;
  font-style: italic;
}

/* Functions */
.hljs-function,
.hljs-title {
  color: #90cdf4;
  font-weight: 600;
}

/* Variables */
.hljs-variable,
.hljs-name {
  color: #fbb6ce;
}

/* Operators */
.hljs-operator {
  color: #f6e05e;
}
```

### Using Custom Themes
```json
{
  "template": {
    "customCSS": "./assets/custom-highlight.css",
    "highlightTheme": "none"
  }
}
```

## 🔍 Language-Specific Examples

### JavaScript/TypeScript
```javascript
/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup Users
 */
async function createUser(userData: UserData): Promise<User> {
  const user = await User.create({
    name: userData.name,
    email: userData.email,
    role: userData.role || 'user'
  });

  return user;
}
```

### Python
```python
"""
@api {get} /analytics/report Generate Report
@apiName GenerateReport
@apiGroup Analytics
"""
def generate_report(start_date: datetime, end_date: datetime) -> Dict[str, Any]:
    data = fetch_analytics_data(start_date, end_date)

    report = {
        'period': f"{start_date} to {end_date}",
        'total_users': len(data['users']),
        'revenue': sum(data['transactions'])
    }

    return report
```

### Go
```go
/**
 * @api {put} /products/{id} Update Product
 * @apiName UpdateProduct
 * @apiGroup Products
 */
func UpdateProduct(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    productID := vars["id"]

    var product Product
    if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    updatedProduct, err := productService.Update(productID, product)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(updatedProduct)
}
```

### Rust
```rust
/**
 * @api {delete} /cache/{key} Delete Cache Key
 * @apiName DeleteCacheKey
 * @apiGroup Cache
 */
pub async fn delete_cache_key(
    Path(key): Path<String>,
    State(cache): State<Arc<Cache>>,
) -> Result<StatusCode, AppError> {
    match cache.delete(&key).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            tracing::error!("Failed to delete cache key {}: {}", key, e);
            Err(AppError::CacheError(e))
        }
    }
}
```

## 🔧 Advanced Configuration

### Multiple Language Support
```json
{
  "template": {
    "highlightLanguages": [
      "typescript", "javascript", "python", "java", "go", "rust",
      "php", "ruby", "swift", "kotlin", "dart", "scala",
      "bash", "powershell", "dockerfile", "yaml", "json",
      "sql", "graphql", "nginx", "apache"
    ]
  }
}
```

### Performance Optimization
```json
{
  "template": {
    "highlightTheme": "github",
    "highlightOnDemand": true,
    "highlightMinified": true,
    "highlightLanguages": ["javascript", "typescript", "json"]
  }
}
```

### Custom Language Registration
```javascript
// Register custom language
hljs.registerLanguage('apidoc', function(hljs) {
  return {
    contains: [
      {
        className: 'meta',
        begin: '@api',
        end: '$'
      },
      {
        className: 'string',
        begin: '{',
        end: '}'
      }
    ]
  };
});
```

## 🎯 Theme Recommendations

### For Dark UIs
1. **github-dark** - Modern, familiar
2. **atom-one-dark** - Popular, well-balanced
3. **vs2015** - Professional, high contrast
4. **monokai** - Classic, distinctive
5. **nord** - Cool, easy on eyes

### For Light UIs
1. **github** - Clean, professional
2. **atom-one-light** - Subtle, elegant
3. **vs** - Familiar, clear
4. **xcode** - Apple-style, clean
5. **foundation** - Minimal, readable

### For Documentation
1. **default** - Safe, universal
2. **github** - Widely recognized
3. **googlecode** - Clean, minimal
4. **foundation** - Documentation-focused
5. **idea** - Professional, clear

## 📱 Responsive Considerations

### Mobile-Friendly Themes
```css
@media (max-width: 768px) {
  .hljs {
    font-size: 14px;
    padding: 0.75rem;
    overflow-x: auto;
  }

  .hljs-line {
    white-space: nowrap;
  }
}
```

### Dark Mode Auto-Switch
```javascript
// Auto-switch theme based on system preference
function setThemeBasedOnSystem() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = prefersDark ? 'github-dark' : 'github';

  document.querySelector('link[href*="highlight"]').href =
    `./css/highlight-${theme}.css`;
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', setThemeBasedOnSystem);
```

## 📋 Best Practices

### 1. Theme Selection
- ✅ Match your brand colors
- ✅ Consider readability
- ✅ Test with your content
- ✅ Check accessibility

### 2. Performance
- ✅ Load only needed languages
- ✅ Use minified versions
- ✅ Consider lazy loading
- ✅ Optimize for mobile

### 3. Consistency
- ✅ Use same theme throughout
- ✅ Match UI theme (dark/light)
- ✅ Consistent font families
- ✅ Proper contrast ratios

### 4. Accessibility
- ✅ WCAG 2.1 AA compliance
- ✅ Sufficient color contrast
- ✅ Screen reader friendly
- ✅ Keyboard navigation support

With 160+ themes available, APIDoc provides the flexibility to match any design aesthetic while maintaining excellent code readability and professional appearance.