# app/api/chat/route.ts Documentation

The `app/api/chat/route.ts` file defines the API route handler for the `/api/chat` endpoint. This endpoint is responsible for processing user chat queries, interacting with the Gemini AI model for understanding and advice, and searching a vector database for relevant products.

## Purpose

This API route acts as the backend for the chat interface. It receives user messages, processes them, and returns a response that may include AI-generated text and relevant product information.

## Handled Requests

-   **POST**: Handles incoming chat messages from the frontend.

## Functionality

The `POST` function performs the following steps:

1.  **Receives Request:** Reads the incoming request body, expecting a JSON object with `query` (the user's message) and optional `history` (previous chat messages).
2.  **Input Validation:** Checks if the `query` is a valid non-empty string.
3.  **Prepare History:** Formats the chat history into a structure suitable for the Gemini API.
4.  **Call Gemini AI:** Calls the `callGeminiForUnderstanding` function (from `@/lib/gemini`) with the user's query and chat history. This function is expected to return AI understanding, advice, and search keywords.
5.  **Vector Search Logic:**
    -   Defines a helper function `performVectorQuery` to query the Upstash Vector index.
    -   Attempts to search the vector database using the `search_keywords` provided by Gemini (Stage 1).
    -   If the first stage fails or the result's similarity score is below a defined threshold (`SIMILARITY_THRESHOLD`), it attempts to search using the direct user query (Stage 2).
    -   Selects the best match based on the similarity score, ensuring it meets the threshold.
6.  **Process Search Result:** If a product match is found above the similarity threshold, it formats the product metadata into a `ProductCardResponse` object.
7.  **Construct Final Response:** Creates a `ChatApiResponse` object containing:
    -   `ai_understanding`: The AI's understanding of the user's query.
    -   `product_card`: The formatted product data (if a relevant product was found).
    -   `advice`: AI-generated advice, potentially including a note about the product search result.
8.  **Send Response:** Returns the `ChatApiResponse` as a JSON response.
9.  **Error Handling:** Includes a `try...catch` block to handle potential errors during the process and return an appropriate error response.

## Data Structures

-   `ProductVectorMetadata`: Interface defining the expected structure of product data stored in the vector database.
-   `ProductCardResponse`: Interface defining the structure of the product data sent back to the frontend for display.
-   `ChatApiResponse`: Interface defining the overall structure of the API response.

## Dependencies

-   `@/lib/gemini`: For interacting with the Gemini AI model.
-   `@/lib/redis`: For interacting with the Upstash Vector index.
-   `@google/generative-ai`: The official Google Generative AI library.
-   `@upstash/vector`: Client for Upstash Vector.
-   `next/server`: For Next.js API route functionality.
