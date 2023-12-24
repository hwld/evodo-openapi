import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import Unfonts from "unplugin-fonts/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unfonts({
      google: { families: [{ name: "Noto Sans JP", styles: "wght@500;700" }] },
    }),
  ],
  server: { port: 5173 },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
