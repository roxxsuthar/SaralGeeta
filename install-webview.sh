#!/bin/bash

# Installation script for react-native-webview

echo "Installing react-native-webview..."

# Stop Metro bundler if running
pkill -f "react-native start" || true

# Install the package
yarn add react-native-webview

# iOS setup (if on Mac)
if [ -d "ios" ]; then
    echo "Setting up iOS..."
    cd ios && pod install && cd ..
fi

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Rebuild your app:"
echo "   - For Android: yarn android"
echo "   - For iOS: yarn ios"
echo ""
echo "2. If you encounter issues, try:"
echo "   - Clean build: cd android && ./gradlew clean && cd .."
echo "   - Reset cache: yarn start --reset-cache"
