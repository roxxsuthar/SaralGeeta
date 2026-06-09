const fs = require('fs');
const path = require('path');

const manifests = [
  'ios/link-assets-manifest.json',
  'android/link-assets-manifest.json'
];

manifests.forEach(manifestPath => {
  const fullPath = path.join(__dirname, manifestPath);
  if (fs.existsSync(fullPath)) {
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const initialCount = data.data.length;
    
    // Filter out missing files
    data.data = data.data.filter(item => {
      const assetPath = path.join(__dirname, item.path);
      return fs.existsSync(assetPath);
    });

    if (data.data.length < initialCount) {
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
      console.log(`Cleaned up ${initialCount - data.data.length} missing entries from ${manifestPath}`);
    } else {
      console.log(`No missing entries found in ${manifestPath}`);
    }
  }
});
