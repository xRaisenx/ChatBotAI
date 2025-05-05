# components/ChatInterface.tsx Documentation

The `ChatInterface.tsx` file defines the main React component for the chat user interface. It manages the chat state, handles user input, communicates with the chat API, and displays messages.

## Purpose

This component provides the interactive chat experience for the user. It's responsible for rendering the chat history, the input field, send button, and other controls like theme toggle and chat clearing.

## Key Elements

-   `'use client';`: Marks the component as a Client Component.
-   **Imports:** Imports necessary React hooks (`useState`, `useRef`, `useEffect`, `useCallback`), icons (`FaPaperPlane`, `FaTrashAlt`), and other components/utilities (`ThemeToggle`, `ChatMessage`, `addToCart`, `uuidv4`).
-   `suggestedQuestions`: An array of predefined questions displayed to the user to encourage interaction.
-   `welcomeMessageText`: The initial welcome message displayed in the chat, configurable via the `NEXT_PUBLIC_WELCOME_MESSAGE` environment variable.
-   **State Variables:**
    -   `messages`: An array of `Message` objects representing the chat history.
    -   `input`: Stores the current value of the input field.
    -   `isLoading`: Boolean state indicating if an API request is in progress.
    -   `cartId`: Stores the ID of the user's shopping cart, used for adding products.
-   **Refs:**
    -   `chatAreaRef`: Ref for the chat message area, used for auto-scrolling.
    -   `inputRef`: Ref for the input field, used for focusing.
-   `createWelcomeMessage`: A memoized function to create the initial welcome message.
-   **`useEffect` Hooks:**
    -   The first `useEffect` runs once on component mount to set the initial welcome message and focus the input field.
    -   The second `useEffect` runs whenever the `messages` state changes to automatically scroll the chat area to the bottom.
-   `handleInputChange`: Updates the `input` state as the user types.
-   `handleAddToCart`: A memoized asynchronous function to add a product to the Shopify cart. It uses the `addToCart` function from `@/lib/shopify`, updates the `cartId` state, and provides user feedback via alerts and console logs.
-   `sendMessage`: A memoized asynchronous function to send a user message to the chat API.
    -   Adds the user's message and a loading indicator to the `messages` state.
    -   Clears the input field and sets `isLoading` to true.
    -   Prepares the chat history to send to the API (last 6 non-loading/error messages).
    -   Fetches a response from the `/api/chat` endpoint.
    -   Handles API errors and throws an error if the response is not OK.
    -   Parses the JSON response from the API.
    -   Updates the `messages` state by removing the loading indicator and adding the received bot message.
    -   Includes error handling for the API call and updates the messages with an error message if needed.
    -   Resets `isLoading` to false and focuses the input field in the `finally` block.
-   `handleSendClick`: Calls `sendMessage` with the current input value when the send button is clicked.
-   `handleKeyPress`: Calls `sendMessage` when the Enter key is pressed in the input field (if not loading).
-   `handleExampleClick`: Sets the input field value to a suggested question and then sends the message.
-   `handleClearChat`: A memoized function to clear the chat history, reset input, clear cart ID, and focus the input field.
-   **JSX Structure:**
    -   Main container `div` with class `chat-container`.
    -   Chat header.
    -   Chat area (`div` with `ref={chatAreaRef}`) where messages are displayed, mapping over the `messages` array and rendering `ChatMessage` components.
    -   Conditionally renders suggested questions if the chat history is empty and not loading.
    -   Input area (`div` with class `input-area`) containing:
        -   Input field (`input` with `ref={inputRef}`) for typing messages.
        -   Send button (`button` with `id="send-btn"`) with a paper plane icon.
        -   Clear chat button (`button` with a trash can icon).
        -   `ThemeToggle` component.

## Dependencies

-   `react`, `react-icons`, `uuid`
-   `./ThemeToggle`, `./ChatMessage`: Local components.
-   `../lib/shopify`: For the `addToCart` function.
