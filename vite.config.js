import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
// import vitePluginString from "vite-plugin-string";
import glsl from "vite-plugin-glsl";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vite-svelte-threejs-starter/',
  plugins: [svelte(), glsl() /*, vitePluginString() */],
  optimizeDeps: {
    exclude: ["svelte-navigator"],
  },
});
