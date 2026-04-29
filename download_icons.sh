#!/bin/bash
cd app/assets/images

# Download whatsapp
curl -sL "https://api.iconify.design/logos/whatsapp-icon.svg" -o whatsapp.svg
# Download youtube
curl -sL "https://api.iconify.design/logos/youtube-icon.svg" -o youtube.svg
# Download star (outline)
curl -sL "https://api.iconify.design/tabler/star.svg" -o star-outline.svg
# Download help square
curl -sL "https://api.iconify.design/tabler/help.svg" -o help-square.svg
# Download 4 squares (apps)
curl -sL "https://api.iconify.design/tabler/layout-grid.svg" -o apps-grid.svg
# Download share icon
curl -sL "https://api.iconify.design/tabler/share.svg" -o share-app.svg
# Download download icon for Update
curl -sL "https://api.iconify.design/tabler/download.svg" -o update-app.svg
# Download chat bubble for bottom bar contact (if contact-us.svg is not suitable)
curl -sL "https://api.iconify.design/tabler/message-circle.svg" -o contact-chat.svg

# For the single color icons (tabler), replace "currentColor" with "#e48616" (approximate orange color from screenshot)
sed -i '' 's/currentColor/#e48616/g' star-outline.svg help-square.svg apps-grid.svg share-app.svg update-app.svg contact-chat.svg

echo "Icons downloaded successfully"
