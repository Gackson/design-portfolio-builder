// @ts-check
import { defineConfig } from 'astro/config';

// Static output — deploys to Vercel, Netlify, GitHub Pages, or any static host.
// For Vercel SSR features (image optimization, analytics), install @astrojs/vercel
// and set output: 'server' with the adapter. Static is the default and recommended
// for a content-driven portfolio.
export default defineConfig({
  site: 'https://your-portfolio.example.com',
  output: 'static',
});
