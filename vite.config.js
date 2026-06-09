import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AI Detector Pro',
        short_name: 'AI Detect',
        description: 'Detect AI-generated Text, Image, Audio, and Video.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [{ src: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png', sizes: '192x192', type: 'image/png' }]
      }
    })
  ],
});
/*EOFcat << 'EOF' > index.html
<!DOCTYPE; html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>AI Detector Pro</title>
  </head>
  <body class="bg-secondary text-white min-h-screen flex flex-col">
    <div id="root" class="flex-grow"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
*/
