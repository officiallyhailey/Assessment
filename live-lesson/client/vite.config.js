// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This page runs on 5173 and the server on 3001. Different ports means different origins, and a browser will not fetch across them by default.
//
// So anything starting with /api gets forwarded to the server, with the /api taken off on the way:
//
//   the page asks for   /api/get-all-animals
//   the server sees     /get-all-animals
//
// That is why a fetch says /api and the endpoint does not. In Postman you talk to the server directly, so you use the plain path.
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react()],
});
