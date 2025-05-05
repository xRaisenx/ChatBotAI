# lib/shopify.ts Documentation

The `lib/shopify.ts` file contains functions for interacting with the Shopify Storefront API.

## Purpose

This file provides a centralized place for making requests to the Shopify Storefront API to fetch product data and manage the shopping cart. This allows the application to retrieve product information and enable users to add items to their cart directly from the chat interface.

## Key Elements

-   **Imports:** Imports necessary components and types from the `@shopify/storefront-api-client` library.
-   **Interfaces:** Defines several TypeScript interfaces for type safety, representing the expected structure of data received from the Shopify Storefront API (e.g., `ShopifyImageNode`, `ShopifyPrice`, `ShopifyProductNode`, `ShopifyPageInfo`, `ShopifyProductsConnection`, `ShopifyProductsGraphQLResponse`, `ShopifyCartCreateResponse`, `ShopifyCartAddLinesResponse`).
-   `SHOPIFY_API_VERSION`: Defines the Shopify Storefront API version to use.
-   `client`: A variable to hold the initialized Shopify Storefront API client instance.
-   `getShopifyClient` Function: Initializes and returns the Shopify Storefront API client.
    -   It checks if the client has already been initialized and returns the existing instance if it has.
    -   Retrieves the `SHOPIFY_STORE_NAME` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` environment variables. It throws an error if they are missing.
    -   Creates a new `StorefrontApiClient` instance using the retrieved credentials and API version.
    -   Logs a message indicating the client initialization.
-   `FetchResult` Interface: Defines the structure of the result returned by the `fetchShopifyProducts` function.
-   `fetchShopifyProducts` Function: An asynchronous function to fetch products from the Shopify Storefront API with pagination.
    -   **Parameters:** Takes an optional `cursor` for pagination, a `limit` for the number of products per page, and an optional `queryFilter` string for filtering products.
    -   **GraphQL Query:** Defines a GraphQL query to fetch product data, including details like ID, handle, title, description, vendor, type, tags, URL, images, price range, and the first variant ID.
    -   **Variables:** Defines the variables to be passed to the GraphQL query.
    -   **Request:** Makes the GraphQL request using the `storefrontClient.request` method.
    -   **Error Handling:** Checks for GraphQL errors in the response and throws an error if any are present. It also validates the structure of the successful response.
    -   **Return Value:** Returns an object containing an array of `ShopifyProductNode` objects and the `pageInfo` for pagination.
    -   Includes a `try...catch` block to handle errors during the fetch process.
-   `addToCart` Function: An asynchronous function to add a product variant to the Shopify cart.
    -   **Parameters:** Takes an optional `cartId` (string or null), the `variantId` (string) of the product variant to add, and the `quantity` (number).
    -   **Cart Creation:** If no `cartId` is provided, it executes a `cartCreate` GraphQL mutation to create a new cart. It handles potential user errors during cart creation.
    -   **Add Lines to Cart:** If a `cartId` is available (either provided or newly created), it executes a `cartLinesAdd` GraphQL mutation to add the specified product variant and quantity to the cart. It handles potential user errors during this process.
    -   **Return Value:** Returns an object containing the updated `cartId`, an optional `checkoutUrl`, and an array of any `userErrors` that occurred.
    -   Includes `try...catch` blocks to handle errors during both cart creation and adding lines.

## Usage

The `fetchShopifyProducts` function is used by the product sync API route (`app/api/sync-products/route.ts`) to retrieve product data from Shopify. The `addToCart` function is used by the `ChatInterface` component to add products to the user's shopping cart.
