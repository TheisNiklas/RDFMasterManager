import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  resolve: {
    alias: {
      zlib: "browserify-zlib",
      stream: "stream-browserify",
      assert: "assert-browserify",
      util: "util/",
      process: "process/",
    },
  },
});
