import adapter from "sveltekit-adapter-browser-extension";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // there's a warning with the adapter when building, see https://github.com/antony/sveltekit-adapter-browser-extension/issues/26
    adapter: adapter({
      pages: "build", // the output directory for the pages of your extension
      assets: undefined, // the asset output directory is derived from pages if not specified explicitly
      fallback: undefined, // set to true to output an SPA-like extension
      manifestVersion: 3, // the version of the automatically generated manifest (Version 3 is required by Chrome).
    }),
    appDir: "ext", // This is important - chrome extensions can't handle the default _app directory name.
  },
};

export default config;
