# next.config.mjs Documentation

The `next.config.mjs` file is a configuration file for Next.js. It allows you to customize various aspects of your Next.js application's build and runtime behavior. This file uses the ES module syntax (`.mjs`).

**Note:** This project also contains a `next.config.ts` file. Typically, a Next.js project only has one configuration file. The presence of both might indicate that one is a remnant or that there's a specific reason for having both (though this is uncommon). The Next.js documentation recommends using either `.js`, `.mjs`, or `.ts`.

## Purpose

This file is used to configure settings such as:

-   Enabling React Strict Mode
-   Configuring image optimization
-   Setting up environment variables
-   Modifying webpack configuration
-   Adding custom headers, redirects, or rewrites

## Configuration Details

-   `reactStrictMode: true`: Enables React Strict Mode, which helps identify potential problems in your application during development.
-   `images.domains`: Configures the domains from which images can be loaded using the Next.js Image component. In this case, it allows loading images from `cdn.shopify.com`.

## Extending the Configuration

You can add more configuration options to the `nextConfig` object as needed. Refer to the official Next.js documentation for a full list of available options.
