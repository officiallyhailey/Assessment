import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The lesson app runs on 5174. The animals API runs on 3000.
// These lines forward the API calls, so the demos make real requests
// that show up in the Network tab exactly like a student's own project.
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,
        proxy: {
            "/get-all-animals": "http://localhost:3000",
            "/get-one-animal-by-id": "http://localhost:3000",
            "/add-one-animal": "http://localhost:3000",
            "/reset-animals": "http://localhost:3000",
        },
    },
});
