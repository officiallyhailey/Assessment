import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site runs on 5174, the check-in API on 3010.
//
// Everything the demos fetch starts with /api, and this rewrites that prefix
// away before forwarding to the server. It is the same arrangement the class
// project uses, so requests in the Network tab look the way a student's own
// do. The server itself knows nothing about /api.
//
// The ports avoid 3001 and 5173 on purpose: the class project uses those, and
// both projects will be open at once on a teaching day.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:3010",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
