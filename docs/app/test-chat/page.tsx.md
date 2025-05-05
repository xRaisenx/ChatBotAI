# app/test-chat/page.tsx Documentation

The `app/test-chat/page.tsx` file defines a React component for a test page specifically designed to interact with the `/api/chat` endpoint.

## Purpose

This page provides a simple user interface to send queries to the chat API and display the raw response. It's a valuable tool for developers to quickly test the API's functionality and observe its output during development and debugging.

## Key Elements

-   `'use client';`: Marks the component as a Client Component, allowing the use of React Hooks and browser-specific APIs like `fetch`.
-   `import { useState } from 'react';`: Imports the `useState` hook for managing component state.
-   `import { ThemeProvider } from '../../providers/ThemeProvider';`: Imports the `ThemeProvider` component to ensure theme context is available on this test page.
-   **State Variables:**
    -   `query`: Stores the user's input in the text field.
    -   `response`: Stores the raw response received from the API.
    -   `loading`: Boolean state to indicate if an API request is in progress.
    -   `error`: Stores any error message that occurs during the API call.
-   `handleSubmit`: An asynchronous function triggered when the form is submitted.
    -   Prevents the default form submission behavior.
    -   Sets loading state to true and clears previous response and error states.
    -   Uses the `fetch` API to send a POST request to `/api/chat` with the user's query in the request body.
    -   Reads the streamed response from the API using `res.body?.getReader()`.
    -   Decodes the streamed data and accumulates it in the `result` variable.
    -   Sets the `response` state with the received data.
    -   Includes a `try...catch` block for error handling and a `finally` block to set loading state back to false.
-   **JSX Structure:**
    -   Wraps the content with `ThemeProvider`.
    -   Uses a `<main>` element with Tailwind classes for basic styling and layout.
    -   Displays a heading "Test Chat API".
    -   Includes a `<form>` with:
        -   An `<input>` field for the user to type their query, bound to the `query` state.
        -   A `<button>` to submit the form, with its text and disabled state controlled by the `loading` state.
    -   Conditionally displays error messages if the `error` state is not null.
    -   Conditionally displays the API response if the `response` state is not null, within a styled `div`.

## Usage

To use this test page, navigate to the `/test-chat` route in your Next.js application. You can type a message into the input field and click "Send" to test the `/api/chat` endpoint and view its raw output.
