# API Response Format Examples

## Endpoint
```
GET /api/admin/gita/policy/?type={policy_type}
```

## Supported Types
- `policy` - Privacy Policy content
- `terms` - Terms of Use content
- `instruction` - Instructions content

## Expected Response Format

### Success Response (200 OK)

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "type": "policy",
    "title": "Privacy Policy",
    "content": "<h1>Privacy Policy</h1><p>This Privacy Policy describes...</p><h2>Information We Collect</h2><ul><li>Email address</li><li>Name</li></ul>",
    "created_at": "2025-11-29T10:00:00Z",
    "updated_at": "2025-11-29T10:00:00Z"
  }
}
```

OR (Alternative field names)

```json
{
  "success": true,
  "data": {
    "description": "<h1>Terms of Use</h1><p>By using our service...</p>",
    "html_content": "<div>...</div>"
  }
}
```

### Component Usage

The component will try to access content in this order:
1. `data?.content`
2. `data?.description`
3. `data?.html_content`
4. Fallback: `'<p>Loading content...</p>'`

## HTML Content Guidelines

### Supported HTML Tags
- Headings: `<h1>`, `<h2>`, `<h3>`
- Paragraphs: `<p>`
- Lists: `<ul>`, `<ol>`, `<li>`
- Formatting: `<strong>`, `<em>`, `<b>`, `<i>`
- Links: `<a href="...">`
- Line breaks: `<br>`
- Divs/Spans: `<div>`, `<span>`

### Styling
The WebView automatically applies these styles:
- Font family: System default (-apple-system, Roboto, etc.)
- Base font size: 16px
- Line height: 1.6
- H1 color: Orange (matches app theme)
- H2-H3: Dark gray
- Text color: #333
- Paragraph spacing: 12px bottom margin
- List indentation: 20px

### Example HTML Content

```html
<h1>Privacy Policy</h1>

<p>This Privacy Policy describes our policies and procedures on the collection, use and disclosure of your information when you use the Service.</p>

<h2>Information We Collect</h2>

<h3>Personal Data</h3>
<p>While using our Service, we may ask you to provide us with certain personally identifiable information:</p>

<ul>
  <li>Email address</li>
  <li>First name and last name</li>
  <li>Phone number</li>
  <li>Usage Data</li>
</ul>

<h3>Usage Data</h3>
<p>Usage Data is collected automatically when using the Service. It may include information such as your device's IP address, browser type, and the pages you visit.</p>

<h2>How We Use Your Data</h2>

<p>The Company may use Personal Data for the following purposes:</p>

<ol>
  <li><strong>To provide and maintain our Service</strong> - including monitoring usage</li>
  <li><strong>To manage your Account</strong> - registration as a user of the Service</li>
  <li><strong>To contact you</strong> - via email or push notifications</li>
</ol>

<p>For more information, please contact us at: <a href="mailto:support@gitaseva.org">support@gitaseva.org</a></p>
```

## Error Handling

### Error Response (400/404/500)

```json
{
  "status": "error",
  "message": "Content not found",
  "error": "The requested policy type does not exist"
}
```

### Component Behavior on Error
- Shows empty WebView
- `error` state is set to `true` in Redux
- Can display error message if needed (currently silent)

## Testing the API

### Using curl
```bash
# Privacy Policy
curl -X GET "https://app.saralgita.in/api/admin/gita/policy/?type=policy"

# Terms of Use
curl -X GET "https://app.saralgita.in/api/admin/gita/policy/?type=terms"

# Instructions
curl -X GET "https://app.saralgita.in/api/admin/gita/policy/?type=instruction"
```

### Using Postman
1. Method: GET
2. URL: `https://app.saralgita.in/api/admin/gita/policy/`
3. Query Params: 
   - Key: `type`
   - Value: `policy` | `terms` | `instruction`

## Implementation Notes

### Content Field Priority
The component checks these fields in order:
```javascript
data?.content || data?.description || data?.html_content || '<p>Loading content...</p>'
```

### HTML Safety
- The WebView renders HTML safely
- No JavaScript execution by default
- XSS protection is handled by WebView

### Performance
- Content is cached in Redux state
- Only fetches once per component mount
- Loading indicator shows during API call

### Mobile Optimization
- Viewport meta tag prevents zooming issues
- Font sizes are mobile-friendly
- Touch scrolling is enabled
- No horizontal scroll

## Migration from Static Content

### Before (Static HTML in Component)
```javascript
<View>
  <Text>Static privacy policy text...</Text>
  <Text>More static content...</Text>
</View>
```

### After (Dynamic from API)
```javascript
<WebView
  source={{ html: apiHtmlContent }}
  // Automatically rendered, styled, and scrollable
/>
```

### Benefits
1. ✅ Update content without app release
2. ✅ Same content across web and mobile
3. ✅ Rich HTML formatting support
4. ✅ Easy content management
5. ✅ No app store approval needed for content changes
