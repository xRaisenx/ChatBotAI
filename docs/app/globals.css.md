# app/globals.css Documentation

The `app/globals.css` file contains global CSS styles that are applied throughout the entire Next.js application.

## Purpose

This file is used to define base styles, CSS variables, and import external stylesheets that should be available globally. In Next.js App Router projects, this is the standard place to include global styles.

## Key Styles and Concepts

-   `@import "tailwindcss";`: Imports the Tailwind CSS framework, making its utility classes available for use in components.
-   `:root`: Defines CSS variables at the root level of the document.
    -   `--background`: Sets a CSS variable for the background color.
    -   `--foreground`: Sets a CSS variable for the foreground (text) color.
-   `@theme inline`: This appears to be a custom or framework-specific directive, potentially related to theming. It sets CSS variables for background, foreground, and fonts based on the `--background`, `--foreground`, `--font-geist-sans`, and `--font-geist-mono` variables. The exact behavior depends on where this `@theme` directive is processed.
-   `@media (prefers-color-scheme: dark)`: A media query that applies styles when the user's operating system is set to dark mode.
    -   Inside this media query, the `--background` and `--foreground` variables are redefined to provide a dark theme.
-   `body`: Styles applied to the `<body>` element.
    -   `background: var(--background);`: Sets the background color using the `--background` CSS variable, which will be either light or dark based on the system preference.
    -   `color: var(--foreground);`: Sets the text color using the `--foreground` CSS variable.
    -   `font-family`: Sets a fallback font family. Note that the `@theme inline` might be intended to set a different font, but this `body` style provides a fallback.

## Usage

Styles defined in this file are automatically included in the application's bundle and applied globally. You can add more global styles, import other CSS files, or define additional CSS variables here.
