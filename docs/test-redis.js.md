# test-redis.js Documentation

The `test-redis.js` file is a simple Node.js script designed to test the connection to a Redis instance using the `redis` library.

## Purpose

This script is used to verify that the application can successfully connect to the configured Redis database. This is particularly useful for debugging connection issues or confirming that the `AICHATBOTZ_KV_URL` environment variable is correctly set.

## How it Works

1.  **Load Environment Variables:** It loads environment variables from the `.env.local` file using `dotenv`.
2.  **Get Redis URL:** It retrieves the Redis connection URL from the `AICHATBOTZ_KV_URL` environment variable.
3.  **Create Redis Client:** It creates a new Redis client instance using the obtained URL.
4.  **Error Handling:** It sets up an error handler to log any Redis client errors.
5.  **Connect, Ping, and Quit:** It attempts to connect to the Redis server, sends a PING command to verify the connection, and then quits the connection.
6.  **Logging:** It logs messages to the console indicating the status of the connection, ping, and disconnection.
7.  **Exit Process:** It exits the Node.js process with a status code of 0 on success and 1 on failure.

## How to Run

1.  Ensure you have Node.js installed.
2.  Make sure you have a `.env.local` file in the project root with the `AICHATBOTZ_KV_URL` environment variable set to your Redis connection URL.
3.  Open your terminal in the project root directory.
4.  Run the script using Node.js:

    ```bash
    node test-redis.js
    ```

The output in the console will indicate whether the connection was successful or if there were any errors.
