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
