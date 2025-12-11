// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 3001,
    proxy: {
      [process.env.VITE_KOBO_PROXY_PATH || "/api/kobo"]: {
        target: process.env.VITE_KOBO_API_BASE || "https://kf.kobotoolbox.org/api/v2",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/kobo/, ""),
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            const token = process.env.VITE_KOBO_API_TOKEN;
            if (token) {
              proxyReq.setHeader("Authorization", `Token ${token}`);
            }
            proxyReq.setHeader("Accept", "application/json");
            console.log("Proxying KoBo request:", req.method, req.url);
          });
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});