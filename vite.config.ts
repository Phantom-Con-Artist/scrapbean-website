import { defineConfig } from 'vite';

// The website is a plain static site. It has its own port so it can run beside the app's dev server (5173).
export default defineConfig({
  server: { host: '127.0.0.1', port: 5174, strictPort: true },
  preview: { host: '127.0.0.1', port: 5175, strictPort: true },
});
