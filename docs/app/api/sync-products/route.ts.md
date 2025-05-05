# app/api/sync-products/route.ts Documentation

The `app/api/sync-products/route.ts` file defines the API route handler for the `/api/sync-products` endpoint. This endpoint is responsible for fetching product data from Shopify and syncing it to the Upstash Vector database.

## Purpose

This API route is designed to keep the product data in the vector database up-to-date with the latest information from Shopify. This synced data is then used by the chat API for product search and recommendations. It's likely intended to be triggered periodically, perhaps by a cron job.

## Handled Requests

-   **GET**: Handles incoming requests to trigger the product sync process.

## Functionality

The `GET` function performs the following steps:

1.  **Authentication:** Checks for a `secret` query parameter in the request URL. If the provided secret does not match the `CRON_SECRET` environment variable, it returns an Unauthorized response (status 401). This is a basic security measure to prevent unauthorized access to the sync endpoint.
2.  **Initialization:** Initializes counters for processed products, fetched products, and errors, as well as an array to batch product data for vector upserting.
3.  **Fetch Products from Shopify:**
    -   Uses a `do...while` loop to fetch products from Shopify in batches using the `fetchShopifyProducts` function (from `@/lib/shopify`).
    -   It uses a `cursor` to paginate through the Shopify products.
    -   Updates the `totalFetched` counter.
4.  **Process Products:** Iterates through the fetched products:
    -   Includes basic validation to skip products missing essential data (id, handle, title).
    -   Cleans the product description by removing HTML tags.
    -   Constructs a `dataToIndex` string containing relevant product information for vector indexing.
    -   Extracts and formats product details, including the product ID, URL, price range, image URL, variant ID, vendor, product type, and tags.
    -   Creates a `ProductVectorMetadata` object with the extracted metadata.
    -   Pushes the product data (ID, data to index, and metadata) to the `vectorUpsertBatch` array.
    -   If the batch reaches a predefined size (`BATCH_SIZE_VECTOR`), it upserts the batch to the vector index using `vectorIndex.upsert`.
    -   Updates the `totalProcessed` counter.
    -   Includes error handling for individual product processing.
5.  **Upsert Remaining Batch:** After fetching all products, it upserts any remaining products in the `vectorUpsertBatch`.
6.  **Verification:** Performs a simple query on the vector index to confirm that products have been indexed.
7.  **Summary:** Logs a summary of the sync process, including the number of fetched, processed, and errored products.
8.  **Send Response:** Returns a JSON response with a success message and the sync summary.
9.  **Error Handling:** Includes a `try...catch` block to handle potential errors during the overall sync process and return an appropriate error response with a status code of 500.

## Data Structures

-   `ProductVectorMetadata`: Interface defining the structure of product data stored in the vector database.

## Dependencies

-   `@/lib/redis`: For interacting with the Upstash Vector index and Redis client.
-   `@/lib/shopify`: For fetching product data from Shopify.
-   `next/server`: For Next.js API route functionality.
