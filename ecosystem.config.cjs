/**
 * PM2 ecosystem config for Ubuntu Server deployment
 * Usage: pm2 start ecosystem.config.cjs
 *
 * Prerequisites: npm run build
 */
module.exports = {
  apps: [
    {
      name: 'gallery',
      script: 'node',
      args: 'server.js',
      cwd: './.next/standalone',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
