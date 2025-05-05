# components/ThemeToggle.tsx Documentation

The `ThemeToggle.tsx` file defines a simple React component that allows users to toggle between light and dark themes.

## Purpose

This component provides a user interface element (a button) that, when clicked, switches the application's theme between light and dark mode. It utilizes a theme context provided elsewhere in the application.

## Key Elements

-   `import { useTheme } from '../providers/ThemeProvider';`: Imports the `useTheme` custom hook from the `ThemeProvider` file in the `providers/` directory. This hook is expected to provide the current theme state and a function to toggle the theme.
-   `ThemeToggle` Component: The main functional component.
    -   `const { theme, toggleTheme } = useTheme();`: Calls the `useTheme` hook to get the current `theme` value ('light' or 'dark') and the `toggleTheme` function.
    -   **JSX Structure:**
        -   A `<button>` element.
        -   `onClick={toggleTheme}`: When the button is clicked, it calls the `toggleTheme` function obtained from the theme context, which changes the application's theme.
        -   `className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"`: Applies Tailwind CSS classes for styling the button, including padding, rounded shape, and different background colors for light and dark modes.
        -   `aria-label`: Provides an accessible label for the button, indicating what theme it will switch to.
        -   `{theme === 'light' ? '🌙' : '☀️'}`: Conditionally renders an emoji based on the current theme: a moon for light mode (to switch to dark) and a sun for dark mode (to switch to light).

## Usage

The `ThemeToggle` component is typically placed in a visible part of the application's UI, such as a header or sidebar, to allow users to easily switch themes. It requires the `ThemeProvider` to be present higher up in the component tree to provide the necessary theme context.
