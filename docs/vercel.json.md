# vercel.json Documentation

The `vercel.json` file contains the configuration for deploying the project to the Vercel platform. It defines how the project should be built and served by Vercel.

## Purpose

This file is used by Vercel to understand the project structure, specify the build process, define routes, and manage environment variables for deployment.

## Key Sections

### `version`
Specifies the version of the Vercel configuration format being used.

### `builds`
An array defining how different parts of the project should be built.

-   `src: "app/**"`: Specifies that all files within the `app` directory should be considered as source files for this build configuration.
-   `use: "@vercel/next"`: Indicates that the `@vercel/next` builder should be used to build the Next.js application.

### `routes`
An array defining how incoming requests should be routed.

-   `src: "/(.*)"`: Matches all incoming paths.
-   `dest: "/"`: Routes all matched paths to the root of the application. This is a common configuration for single-page applications or Next.js applications using the App Router.

### `env`
An object defining environment variables that should be available during the build and runtime on Vercel. The values prefixed with `@` indicate that these are linked to environment variables configured in the Vercel project settings.

-   `VECTOR_URL_BM25`: Environment variable for the URL of a vector database (likely for BM25 indexing).
-   `VECTOR_TOKEN_BM25`: Environment variable for the token to access the vector database.
-   `KV_CHA_KV_REST_API_URL`: Environment variable for the URL of a key-value store (likely for chat history).
-   `KV_CHA_KV_REST_API_TOKEN`: Environment variable for the token to access the key-value store.
-   `SHOPIFY_STORE_NAME`: Environment variable for the Shopify store name.
-   `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: Environment variable for the Shopify Storefront API access token.
-   `GEMINI_API_KEY`: Environment variable for the Gemini API key.
-   `CRON_SECRET`: Environment variable for a secret used with cron jobs (if configured).
-   `NEXT_PUBLIC_WELCOME_MESSAGE`: Public environment variable for a welcome message.
-   `MAX_CHAT_HISTORY`: Environment variable for the maximum chat history to retain.
-   `PRODUCT_LIMIT_PER_RESPONSE`: Environment variable for the limit of products to include per response.

## Modifying the Configuration

You can modify this file to:

-   Define different build configurations for specific paths.
-   Set up custom redirects, rewrites, or headers.
-   Add or remove environment variables.

Refer to the official Vercel documentation for more advanced configuration options.
