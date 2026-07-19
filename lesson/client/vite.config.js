// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The client runs on 5173 and the server on 3001, which are different origins.
// Rather than write the full address into every fetch, anything starting with
// /api is forwarded to the server, with the /api removed on the way.
//
//   client asks for   /api/get-all-animals
//   server receives   /get-all-animals
//
// This is why the component says /api and the endpoint does not.
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
