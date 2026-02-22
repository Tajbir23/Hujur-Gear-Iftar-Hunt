module.exports = {
    apps: [
        {
            name: "ramadan-radar",
            script: "node_modules/.bin/next",
            args: "start",
            instances: "max", // Use all CPU cores
            exec_mode: "cluster",
            max_memory_restart: "500M",
            watch: false,
            autorestart: true,
            max_restarts: 10,
            restart_delay: 5000,
            env: {
                NODE_ENV: "production",
                PORT: 3000,
            },
            env_production: {
                NODE_ENV: "production",
                PORT: 3000,
            },
            // Logging
            error_file: "./logs/error.log",
            out_file: "./logs/output.log",
            merge_logs: true,
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
            // Graceful shutdown
            kill_timeout: 5000,
            listen_timeout: 10000,
        },
    ],
};
