# app/api/generate-question/route.ts Documentation

The `app/api/generate-question/route.ts` file defines the API route handler for the `/api/generate-question` endpoint. This endpoint is responsible for using the Gemini AI model to generate a concise, premade question for a beauty chatbot.

## Purpose

This API route provides a way for the frontend to fetch a suggested question to display to the user, encouraging interaction with the chatbot on relevant topics like skincare, makeup, product recommendations, or order tracking.

## Handled Requests

-   **POST**: Handles incoming requests to generate a question.

## Functionality

The `POST` function performs the following steps:

1.  **Initialize Gemini:** Creates a new instance of the `GoogleGenerativeAI` client using the `GEMINI_API_KEY` environment variable and gets the `gemini-1.5-flash` model.
2.  **Define Prompt:** Sets a detailed prompt instructing the Gemini model to generate a single, concise question (15-30 words) relevant to a beauty chatbot, providing examples and specifying the desired JSON output format.
3.  **Generate Content:** Calls the `generateContent` method on the Gemini model with the defined prompt and configuration options (`temperature` and `maxOutputTokens`) to control the output.
4.  **Extract Question:** Extracts the generated text from the Gemini response and trims any leading/trailing whitespace.
5.  **Send Response:** Returns the generated question in a JSON object (`{"question": "..."}`) as a `NextResponse`.
6.  **Error Handling:** Includes a `try...catch` block to handle potential errors during the process and return an appropriate error response with a status code of 500.

## Dependencies

-   `@google/generative-ai`: The official Google Generative AI library.
-   `next/server`: For Next.js API route functionality.
