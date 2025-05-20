/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node']
  },
  // Exclude specific directories from the build
  webpack: (config, { isServer }) => {
    // Add exclusion for %TEMP%/vercel-test directory
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/%TEMP%/**', '**/vercel-test/**', '**/node_modules/**']
    };
    
    // Explicitly exclude problematic files
    if (config.module && config.module.rules) {
      config.module.rules.push({
        test: /.*(%TEMP%|vercel-test).*/,
        loader: 'ignore-loader',
      });
    }
    
    return config;
  }
};

module.exports = nextConfig; 