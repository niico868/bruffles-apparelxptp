import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react()],
  // Put the stylesheet inside each page so phones can paint without waiting for a second file.
  build: { inlineStylesheets: "always" },
  vite: { plugins: [tailwindcss()] },
});
