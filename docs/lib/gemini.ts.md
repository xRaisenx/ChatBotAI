# lib/gemini.ts Documentation

The `lib/gemini.ts` file contains functions for interacting with the Google Generative AI (Gemini) model.

## Purpose

This file encapsulates the logic for communicating with the Gemini API, specifically for processing user queries from the chat interface to obtain AI understanding, advice, and relevant search keywords for product recommendations.

## Key Elements

-   **Imports:** Imports necessary classes and types from the `@google/generative-ai` library.
-   **Gemini Initialization:**
    -   Creates a new instance of `GoogleGenerativeAI` using the `GEMINI_API_KEY` environment variable. It throws an error if the key is missing.
    -   Gets the `gemini-1.5-flash` generative model.
-   `ChatHistoryMessage` Interface: Defines the structure for messages in the chat history sent to Gemini.
-   `GeminiUnderstandingResponse` Interface: Defines the expected structure of the JSON response from the `callGeminiForUnderstanding` function.
-   `callGeminiForUnderstanding` Function: An asynchronous function that sends a user query and chat history to the Gemini model and processes the response.
    -   **Parameters:** Takes the user `query` (string) and `history` (array of `ChatHistoryMessage`) as input.
    -   **System Prompt:** Defines a detailed `systemPrompt` that instructs the Gemini model on its role (Bella, the AI assistant), the tasks to perform based on the user query and history (summarize understanding, provide advice, extract search keywords for product queries, determine if it's a product query), and the required JSON output format.
    -   **Message Preparation:** Formats the system prompt, chat history, and the current user query into a structure suitable for the Gemini API's `generateContent` method.
    -   **Generate Content:** Calls `model.generateContent` with the prepared messages and configuration options:
        -   `responseMimeType: 'application/json'`: Instructs Gemini to return the response in JSON format.
        -   `temperature`: Controls the randomness of the output (0.5 for a balanced response).
        -   `maxOutputTokens`: Limits the length of the generated response.
        -   `safetySettings`: Configures safety thresholds to block potentially harmful content.
    -   **Response Parsing and Validation:**
        -   Extracts the text content from the Gemini response.
        -   Parses the text as JSON.
        -   Validates the structure and types of the parsed JSON against the `GeminiUnderstandingResponse` interface.
    -   **Return Value:** Returns the validated JSON object as a `GeminiUnderstandingResponse` or `null` if an error occurs during the process (API call failure, invalid JSON, etc.).
    -   **Error Handling:** Includes a `try...catch` block to log errors and return `null`.

## Usage

The `callGeminiForUnderstanding` function is used by the chat API route (`app/api/chat/route.ts`) to process user queries and obtain AI-generated responses and search parameters.
