// @ts-check
import { defineConfig } from 'astro/config';
import rehypeCorrectionTape from './src/plugins/rehype-correction-tape.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://dcat.sanyyao.com',
  markdown: {
    rehypePlugins: [rehypeCorrectionTape],
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
