import react from "@vitejs/plugin-react-swc";
import { TailwindCSSVitePlugin } from "tailwindcss-vite-plugin";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TailwindCSSVitePlugin()],
});
