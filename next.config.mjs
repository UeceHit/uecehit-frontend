/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone', // Necessário para Docker
};

export default nextConfig;
