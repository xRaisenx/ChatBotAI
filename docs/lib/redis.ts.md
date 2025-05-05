# lib/redis.ts Documentation

The `lib/redis.ts` file is responsible for initializing and exporting clients for interacting with Upstash Vector and a standard Redis instance.

## Purpose

This file provides centralized access to the database clients used by the application. Upstash Vector is used for storing and searching product embeddings (for product recommendations), while the standard Redis client is likely used for other key-value storage needs, such as storing chat history or session data.

## Key Elements

-   **Imports:** Imports the `Index` class from `@upstash/vector` and the `createClient` function from `redis`.
-   `UPSTASH_VECTOR_INDEX_NAME`: Exports a constant string defining the name of the Upstash Vector index used for products.
-   **Upstash Vector Initialization:**
    -   Checks if the `VECTOR_URL_BM25` and `VECTOR_TOKEN_BM25` environment variables are set. It throws an error if they are missing, as these are required to connect to the vector index.
    -   Creates and exports a new `Index` instance named `vectorIndex` using the provided URL and token. This client is used for vector operations like upserting and querying.
-   **Standard Redis Initialization:**
    -   Creates and exports a standard Redis client instance named `redisClient` using the `AICHATBOTZ_KV_URL` environment variable. This client is used for standard key-value Redis operations.
    -   Sets up an error listener to log any errors from the Redis client.
    -   Attempts to connect the Redis client and logs any connection errors.

## Usage

The `vectorIndex` and `redisClient` instances exported from this file can be imported and used in other parts of the application (e.g., API routes, utility functions) to interact with the respective databases.
