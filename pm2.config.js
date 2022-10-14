module.exports = {
  apps: [
    {
      name: "bdo-servers-status",
      script: "./bin/www",
      watch: true,
      env: {
        "PORT": 80,
        "NODE_ENV": "development"
      },
      env_production: {
        "PORT": 80,
        "NODE_ENV": "production",
      }
    }
  ]
}