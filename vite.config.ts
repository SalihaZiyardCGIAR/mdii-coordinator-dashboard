import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 3001,
      proxy: {
        "/api/kobo": {
          target: "https://kf.kobotoolbox.org/api/v2",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/kobo/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq, req) => {
              proxyReq.setHeader(
                "Authorization",
                `Token ${env.VITE_KOBO_API_TOKEN}`
              );
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
