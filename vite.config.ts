import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env variables based on the current mode (development, production, etc)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 3001, // Changed from 8080 to 3001
      proxy: {
        "/api/kobo": {
          target: env.VITE_KOBO_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/kobo/, ""),
          configure: (proxy, _options) => {
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              proxyReq.setHeader("Authorization", `Token ${env.VITE_KOBO_API_TOKEN}`);
              proxyReq.setHeader("Accept", "application/json");
              console.log("Proxying:", req.method, req.url);
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
  };
});
