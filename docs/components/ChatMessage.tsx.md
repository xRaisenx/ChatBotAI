# components/ChatMessage.tsx Documentation

The `ChatMessage.tsx` file defines a React component responsible for rendering a single message within the chat interface. It handles displaying messages from both the user and the bot, including special cases like loading indicators, error messages, and embedded product cards.

## Purpose

This component is a presentational component that takes a `Message` object as input and renders it with appropriate styling and content based on the message's properties. It also handles the display and interaction with embedded product cards.

## Key Elements

-   **Imports:** Imports the `ProductCard` component, `DOMPurify` for sanitizing HTML, and `FaSpinner` for a loading icon (although a custom typing indicator is used).
-   `Message` Interface: Defines the structure of a chat message object, including properties for role, text, AI understanding, product card data, advice, loading state, and error state.
-   `ChatMessageProps` Interface: Defines the props expected by the `ChatMessage` component, including the `message` object and an `onAddToCart` function.
-   `ChatMessage` Component: The main functional component.
    -   `isUser`: A boolean derived from `message.role` to easily determine if the message is from the user.
    -   `parseAdvice`: A function to parse the `advice` text. It specifically looks for a legacy format where product card data might be embedded as a JSON string within `PRODUCT_CARD_START` and `PRODUCT_CARD_END` markers. It extracts this data and returns the cleaned advice text and the parsed product card data.
    -   `sanitizeOptions`: Configuration for `DOMPurify` to allow basic HTML tags for formatting.
    -   `cleanedAdvice`, `parsedProductCard`, `sanitizedAdvice`, `sanitizedText`: Variables to hold the processed and sanitized message content.
    -   **Loading Indicator:** If `message.isLoading` is true, it renders a typing indicator with bouncing dots.
    -   **Error Message:** If `message.isError` is true, it renders a styled error message box with an "Oops!" heading and the sanitized error text.
    -   **Standard Message Rendering:** If it's not a loading or error message, it renders the message based on the `isUser` flag:
        -   **Bot Message:** Displays AI understanding (if available), the product card (if available, using the `ProductCard` component and passing the `onAddToCart` handler), and the sanitized advice text.
        -   **User Message:** Displays the sanitized user text.
    -   `message-base`, `user-message`, `bot-message`: CSS classes for basic message styling.
    -   `ai-understanding-text`, `advice-text`: CSS classes for specific text elements.
    -   `dangerouslySetInnerHTML`: Used to render the sanitized HTML content of the advice and error text.

## Usage

The `ChatMessage` component is used within the `ChatInterface` component to render each individual message in the chat history. It receives a `Message` object and the `onAddToCart` function as props.
