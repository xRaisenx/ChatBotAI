# styles/globals.css Documentation

The `styles/globals.css` file contains global CSS styles for the application.

**Note:** This project also contains an `app/globals.css` file, which is imported in the root layout (`app/layout.tsx`). It appears that `app/globals.css` is the primary global stylesheet used by the application, and this file in the `styles/` directory might be a duplicate or an alternative that is not currently being used.

## Purpose

This file is intended to define global styles, import CSS frameworks, and set up CSS variables that apply across the entire application.

## Key Styles and Concepts

-   `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`: These directives import Tailwind CSS's base styles, component styles, and utility classes, making them available for use.
-   `:root`: Defines CSS variables at the root level for light mode.
    -   `--primary-bg`: Primary background color.
    -   `--primary-text`: Primary text color.
    -   `--cta`: Color for call-to-action elements.
    -   `--accent`: Accent color.
    -   `--highlight`: Highlight color.
-   `.dark`: A CSS class that, when applied to an ancestor element (like the `<html>` tag), defines CSS variables for dark mode, overriding the `:root` variables.
    -   `--primary-bg`: Primary background color in dark mode.
    -   `--primary-text`: Primary text color in dark mode.
    -   `--accent`: Accent color in dark mode.
-   `body`: Styles applied to the `<body>` element.
    -   `@apply bg-[var(--primary-bg)] text-[var(--primary-text)];`: Uses Tailwind's `@apply` directive to apply the background and text colors defined by the `--primary-bg` and `--primary-text` CSS variables.

## Usage

If this file were being used, its styles would be applied globally. However, given the presence and import of `app/globals.css` in the main layout, it's likely that the styles in `app/globals.css` are the ones currently affecting the application's appearance.
