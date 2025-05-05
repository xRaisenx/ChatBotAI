# app/test-sync/page.tsx Documentation

The `app/test-sync/page.tsx` file defines a React component for a test page specifically designed to trigger and display the result of the product sync API route (`/api/sync-products`).

## Purpose

This page provides a simple user interface with a button to manually initiate the product synchronization process. It's a convenient tool for developers to test the sync functionality and view the summary message returned by the API.

## Key Elements

-   `'use client';`: Marks the component as a Client Component, allowing the use of React Hooks and browser-specific APIs like `fetch`.
-   `import { useState } from 'react';`: Imports the `useState` hook for managing component state.
-   `import { ThemeProvider } from '../../providers/ThemeProvider';`: Imports the `ThemeProvider` component to ensure theme context is available on this test page.
-   **State Variables:**
    -   `response`: Stores the success message received from the API after a successful sync.
    -   `loading`: Boolean state to indicate if the sync process is in progress.
    -   `error`: Stores any error message that occurs during the sync request.
-   `handleSync`: An asynchronous function triggered when the "Trigger Sync" button is clicked.
    -   Sets loading state to true and clears previous response and error states.
    -   Uses the `fetch` API to send a GET request to `/api/sync-products`.
    -   Crucially, it appends the `secret` query parameter with the value from `process.env.CRON_SECRET`. This is required for authentication by the API route.
    -   Parses the JSON response from the API.
    -   Checks if the response status is not OK (`!res.ok`) and throws an error if the sync failed, including the error message from the API response if available.
    -   Sets the `response` state with the success message from the API response.
    -   Includes a `try...catch` block for error handling and a `finally` block to set loading state back to false.
-   **JSX Structure:**
    -   Wraps the content with `ThemeProvider`.
    -   Uses a `<main>` element with Tailwind classes for basic styling and layout.
    -   Displays a heading "Test Product Sync".
    -   Includes a `<button>` that triggers the `handleSync` function when clicked. The button's text and disabled state are controlled by the `loading` state.
    -   Conditionally displays error messages if the `error` state is not null.
    -   Conditionally displays the sync result message if the `response` state is not null, within a styled `div`.

## Usage

To use this test page, navigate to the `/test-sync` route in your Next.js application. Click the "Trigger Sync" button to initiate the product synchronization process and view the result message returned by the API. Note that this requires the `CRON_SECRET` environment variable to be set correctly for the API route to authenticate the request.
