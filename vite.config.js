import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Ensure that the background script and content script have access to the `chrome` API
        globals: {
          chrome: "chrome",
        },
      },
    },
  },
});
