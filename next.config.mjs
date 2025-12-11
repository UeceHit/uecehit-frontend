/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone', // Necessário para Docker
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.uecehit.com.br/api/:path*',
      },
    ];
  },
};

export default nextConfig;
