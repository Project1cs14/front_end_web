// Next.js configuration file (next.config.mjs) using ES Modules syntax
//to configure the root directory for Next.js when running in development mode, ensuring it uses the correct project folder. This is especially useful when working with monorepos or custom project structures.
/** @type {import('next').NextConfig} */
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  turbopack: {
    // Ensure Next.js uses this project folder as the root when running dev.
    root: __dirname,
  },
};

export default nextConfig;
