import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
const ip = 10;
// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    https: {
      key: fs.readFileSync(`../localhost+${ip}-key.pem`),
      cert: fs.readFileSync(`../localhost+${ip}.pem`),
    },
    ws: {
      port: 5173,
      https: true,
      host: "0.0.0.0",
    },
  },
  resolve: {
    alias: {
      "@": new URL("src", import.meta.url).pathname,
    },
  },
});
