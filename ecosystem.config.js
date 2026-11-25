// pm2 process definitions for the BharatBN VPS (runs under the dedicated "bbn" user).
module.exports = {
  apps: [
    {
      name: 'bbn-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start:prod',
      env: { NODE_ENV: 'production', PORT: 4000, HOST: '127.0.0.1' },
    },
    {
      name: 'bbn-frontend',
      cwd: './frontend',
      script: 'npx',
      args: 'next start -p 3000 -H 127.0.0.1',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'bbn-admin',
      cwd: './admin',
      script: 'npx',
      args: 'next start -p 3001 -H 127.0.0.1',
      env: { NODE_ENV: 'production' },
    },
  ],
};
