import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 2424, // Change this to your desired port
  },
  plugins: [react()],
  base: "./",
});
