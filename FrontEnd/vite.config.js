import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
const ip = 9;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(`../localhost+${ip}-key.pem`),
      cert: fs.readFileSync(`../localhost+${ip}.pem`),
    },
  },
  resolve: {
    alias: {
      "@": new URL("src", import.meta.url).pathname,
    },
  },
});
