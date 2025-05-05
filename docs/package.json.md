# package.json Documentation

The `package.json` file is the heart of any Node.js project. It contains metadata about the project, including its name, version, dependencies, and scripts.

## Purpose

This file is used by package managers like npm or yarn to manage the project's dependencies and to provide a standardized way to run common tasks like building, starting, and linting the project.

## Key Sections

### `name`
The name of the project.

### `version`
The current version of the project.

### `private`
If set to `true`, this prevents the package from being accidentally published to the npm registry.

### `scripts`
Defines a set of runnable scripts. These can be executed using `npm run [script-name]`.

-   `dev`: Starts the development server with Turbopack for faster builds.
-   `build`: Builds the Next.js application for production.
-   `start`: Starts the production Next.js server.
-   `lint`: Runs the linter to check code for style and errors.

### `dependencies`
Lists the production dependencies of the project. These are packages required for the application to run in production.

-   `@google/generative-ai`: Library for interacting with the Google Generative AI API.
-   `@shopify/shopify-api`: Library for interacting with the Shopify Admin API.
-   `@shopify/storefront-api-client`: Client for the Shopify Storefront API.
-   `@upstash/redis`: Client for Upstash Redis.
-   `@upstash/vector`: Client for Upstash Vector database.
-   `ai`: Library for building AI-powered applications.
-   `dotenv`: Loads environment variables from a `.env` file.
-   `isomorphic-dompurify`: Library for sanitizing HTML to prevent XSS attacks.
-   `next`: The Next.js framework.
-   `react`: The React library for building user interfaces.
-   `react-dom`: React package for working with the DOM.
-   `react-icons`: Popular icon library for React.
-   `redis`: Node.js client for Redis.
-   `tailwindcss`: A utility-first CSS framework.
-   `uuid`: Library for generating unique identifiers.

### `devDependencies`
Lists the development dependencies of the project. These are packages only required for development and building, not for the application to run in production.

-   `@eslint/eslintrc`: ESLint configuration utilities.
-   `@tailwindcss/postcss`: PostCSS plugin for Tailwind CSS.
-   `@types/node`: TypeScript type definitions for Node.js.
-   `@types/node-fetch`: TypeScript type definitions for node-fetch.
-   `@types/react`: TypeScript type definitions for React.
-   `@types/react-dom`: TypeScript type definitions for React DOM.
-   `eslint`: A linter for identifying and reporting on patterns found in ECMAScript/JavaScript code.
-   `eslint-config-next`: ESLint configuration for Next.js projects.
-   `tailwindcss`: Tailwind CSS framework (listed again in devDependencies, likely for build process).
-   `typescript`: The TypeScript language.
