# app/layout.tsx Documentation

The `app/layout.tsx` file defines the root layout for the Next.js application using the App Router. This component wraps all pages and provides a consistent structure, including the `<html>` and `<body>` tags.

## Purpose

The root layout is essential for setting up the basic HTML structure, including metadata, linking stylesheets, and wrapping the application with providers (like theme providers). It ensures that elements like the `<html>` and `<body>` tags are only rendered once.

## Key Elements

-   `import './globals.css';`: Imports the global CSS file, making the styles available to all components within this layout and its children.
-   `import { ThemeProvider } from '../providers/ThemeProvider';`: Imports the `ThemeProvider` component, likely from the `providers/` directory.
-   `export const metadata = { ... };`: Exports a `metadata` object, which is used by Next.js to generate the `<head>` tags for the application, including the title and description.
-   `export default function RootLayout({ children }: { children: React.ReactNode }) { ... }`: Defines the default exported React component for the root layout.
    -   `{ children }: { children: React.ReactNode }`: This is a standard pattern for layout components in React, where `children` represents the content of the nested routes or pages.
    -   `<html lang="en" className="light">`: The root `<html>` tag. The `lang` attribute is set to "en", and a `className` of "light" is applied, potentially for initial theme styling.
    -   `<body>`: The `<body>` tag.
    -   `<ThemeProvider>{children}</ThemeProvider>`: Wraps the `children` (the rest of the application) with the `ThemeProvider`. This makes the theme context available to all components within the application.

## Usage

This file defines the top-level structure of your application. You can add elements like headers, footers, navigation, or other providers here to have them present on all pages.
