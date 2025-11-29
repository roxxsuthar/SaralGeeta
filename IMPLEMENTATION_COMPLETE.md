# Privacy Policy & Terms of Use - API Implementation Complete

## ✅ What's Been Implemented

### 1. API Configuration
- Added `POLICY: '/admin/gita/policy/'` to `app/constants/apis.js`
- API endpoint accepts `?type=` parameter for different content types

### 2. Redux Structure (Both Components)

#### PrivacyPolicy Container
- **Constants**: GET_POLICY, GET_POLICY_SUCCESS, GET_POLICY_FAIL
- **Actions**: `getPolicy(policyType)`, `getPolicySuccess(payload)`, `getPolicyFail()`
- **Reducer**: Manages `loading`, `data`, `error` states
- **Saga**: Fetches data from API with policy type parameter
- **Component**: Updated to use WebView for HTML rendering with API integration

#### TermsOfUse Container
- **Constants**: GET_TERMS, GET_TERMS_SUCCESS, GET_TERMS_FAIL
- **Actions**: `getTerms(policyType)`, `getTermsSuccess(payload)`, `getTermsFail()`
- **Reducer**: Manages `loading`, `data`, `error` states
- **Saga**: Fetches data from API with policy type parameter
- **Component**: Updated to use WebView for HTML rendering with API integration

### 3. Component Features

Both components now include:
- ✅ API call on component mount using `useEffect`
- ✅ Loading state with ActivityIndicator
- ✅ WebView to render HTML content from API
- ✅ Responsive HTML styling within WebView
- ✅ Redux state management
- ✅ Error handling
- ✅ Clean, maintainable code structure

### 4. WebView HTML Template

Custom HTML template with:
- Responsive viewport settings
- Custom CSS styling matching app theme
- Orange color for headings (matches app design)
- Proper text formatting (justified, line-height, etc.)
- Mobile-optimized font sizes
- Support for h1, h2, h3, p, ul, ol, li tags

## 📋 API Usage

### Privacy Policy
```javascript
handleGetPolicy('policy')  // Calls: /admin/gita/policy/?type=policy
```

### Terms of Use
```javascript
handleGetTerms('terms')    // Calls: /admin/gita/policy/?type=terms
```

### Instructions (Future)
```javascript
handleGetPolicy('instruction')  // Calls: /admin/gita/policy/?type=instruction
```

## 🚀 Next Steps Required

### 1. Install react-native-webview
Run this command in a separate terminal (not the Metro bundler):
```bash
cd /Users/bhagirathsuthar/Documents/projects/SaralGeeta
yarn add react-native-webview
```

### 2. iOS Setup (if using iOS)
```bash
cd ios && pod install && cd ..
```

### 3. Rebuild the App
After installing the package:
```bash
# For Android
yarn android

# For iOS
yarn ios
```

## 📁 Files Modified

### Privacy Policy
- ✅ `app/containers/PrivacyPolicy/constants.js` - Added action constants
- ✅ `app/containers/PrivacyPolicy/actions.js` - Added action creators
- ✅ `app/containers/PrivacyPolicy/reducer.js` - Added state management
- ✅ `app/containers/PrivacyPolicy/saga.js` - Added API call logic
- ✅ `app/containers/PrivacyPolicy/index.js` - Updated component with WebView
- ✅ `app/containers/PrivacyPolicy/styles.js` - Added webview & loading styles
- 📝 `app/containers/PrivacyPolicy/index_old.js` - Backup of old file

### Terms of Use
- ✅ `app/containers/TermsOfUse/constants.js` - Added action constants
- ✅ `app/containers/TermsOfUse/actions.js` - Added action creators
- ✅ `app/containers/TermsOfUse/reducer.js` - Added state management
- ✅ `app/containers/TermsOfUse/saga.js` - Added API call logic
- ✅ `app/containers/TermsOfUse/index.js` - Updated component with WebView
- ✅ `app/containers/TermsOfUse/styles.js` - Added webview & loading styles
- 📝 `app/containers/TermsOfUse/index_old.js` - Backup of old file

### API Configuration
- ✅ `app/constants/apis.js` - Added POLICY endpoint

## 🎨 Component Structure

```javascript
function PrivacyPolicy({ privacyPolicy, handleGetPolicy }) {
  // Fetch data on mount
  useEffect(() => {
    handleGetPolicy('policy');
  }, [handleGetPolicy]);

  const { loading, data } = privacyPolicy;

  // Render loading or WebView
  return loading ? <LoadingView /> : <WebView html={data.content} />;
}
```

## 🔧 API Response Expected Format

The API should return data in this format:
```json
{
  "data": {
    "content": "<h1>Privacy Policy</h1><p>Your HTML content here...</p>",
    "description": "Alternative field if content is not available"
  }
}
```

The component will try to use `data.content` first, then fallback to `data.description`.

## ⚡ Benefits of This Implementation

1. **Dynamic Content**: Content is fetched from API, can be updated without app updates
2. **Single API**: One endpoint serves multiple content types using flags
3. **HTML Rendering**: WebView renders rich HTML content with styling
4. **Loading States**: Users see loading indicator while content loads
5. **Error Handling**: Graceful error handling in saga
6. **Consistent Pattern**: Same structure used across both components
7. **Reusable**: Easy to create Instructions component using same pattern
8. **Maintainable**: Clean separation of concerns (actions, reducers, sagas)

## 📝 Creating Instructions Component

If you need to create an Instructions component, simply:
1. Copy the PrivacyPolicy or TermsOfUse folder structure
2. Rename all references
3. Change the API call to use `'instruction'` flag
4. Add the route to navigation

The entire infrastructure is ready to support it!
