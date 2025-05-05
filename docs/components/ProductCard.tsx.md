# components/ProductCard.tsx Documentation

The `ProductCard.tsx` file defines a reusable React component for displaying product information within the chat interface.

## Purpose

This component presents key details about a product, such as its title, description, price, image, and a link to its landing page. It also includes an "Add to Cart" button that can trigger an action in the parent component.

## Key Elements

-   **Imports:** Imports the `Image` component from `next/image` for optimized image loading.
-   `ProductCardProps` Interface: Defines the props expected by the `ProductCard` component, including product details (`title`, `description`, `price`, `image`, `landing_page`), optional `matches` text, an optional `onAddToCart` function, and an optional `productId`.
-   `ProductCard` Component: The main functional component that receives `ProductCardProps`.
    -   **JSX Structure:**
        -   A main `div` container with styling for border, padding, margin, and Flexbox layout to arrange content horizontally.
        -   Conditionally renders a Next.js `Image` component if an `image` URL is provided. It's configured for lazy loading, specific dimensions, object fitting, and responsive sizing.
        -   A flex item `div` (`flex-1`) to contain the product details and actions.
        -   `h3` for the product title with styling.
        -   `p` for the product description with styling.
        -   `p` for the product price with bold styling.
        -   A `div` for action buttons with Flexbox and spacing.
        -   An `<a>` tag for the "View Product" link. It opens the `landing_page` in a new tab and includes accessibility attributes (`target="_blank"`, `rel="noopener noreferrer"`).
        -   A `<button>` for "Add to Cart".
            -   It has styling for background color, text color, padding, rounded corners, and hover effect.
            -   The `onClick` handler calls the `onAddToCart` function (if provided) with the `productId` (if provided).
            -   The button is disabled if `productId` or `onAddToCart` are not provided.
        -   Conditionally renders a `p` tag for `matches` text (if provided) with styling.

## Usage

The `ProductCard` component is used within the `ChatMessage` component when a bot message includes product card data. It receives the product details as props and, if an `onAddToCart` function and `productId` are provided, enables the "Add to Cart" functionality.
