module.exports = {
  apps: [
    {
      name: 'discord-bot', // Replace with your application's name
      script: 'dist/index.js', // Path to your main application script
      instances: 1, // Number of instances to be started
      autorestart: true, // Enable auto-restart in case of failures
      watch: false, // Disable file watching
      //   max_memory_restart: '1G', // Restart if memory usage exceeds 1GB
      env: {
        NODE_ENV: 'production', // Set NODE_ENV to production
      },
      error_file: 'logs/err.log', // Log file for errors
      out_file: 'logs/out.log', // Log file for output
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // Log date format
    },
  ],
}
