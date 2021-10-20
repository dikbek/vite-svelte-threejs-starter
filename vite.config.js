import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import vitePluginString from "vite-plugin-string";
import glsl from "vite-plugin-glsl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), glsl.default(), vitePluginString.default()],
  optimizeDeps: {
    exclude: ["svelte-navigator"],
  },
});
