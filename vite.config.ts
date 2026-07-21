import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: '0.0.0.0', // Listens on all local IP addresses (LAN and public)
        port: 3000, // Optional: specify a custom port
    },
});
