# providers/ThemeProvider.tsx Documentation

The `ThemeProvider.tsx` file defines a React Context Provider component that manages the application's theme state (light or dark) and provides a way for components to access and toggle the theme.

## Purpose

This provider makes the current theme and the function to change it available to any component within its subtree without prop drilling. It also handles persisting the user's theme preference in local storage and applying the theme class to the document's root element.

## Key Elements

-   `'use client';`: Marks the component as a Client Component, as it uses browser-specific APIs like `localStorage` and interacts with the DOM (`document.documentElement`).
-   **Imports:** Imports necessary React hooks (`createContext`, `useContext`, `useState`, `useEffect`).
-   `ThemeContext`: Creates a new React Context with a default value. The context will hold the current `theme` string and the `toggleTheme` function.
-   `ThemeProvider` Component: The main functional component that acts as the provider.
    -   `{ children }: { children: React.ReactNode }`: Receives `children` as props, representing the components wrapped by the provider.
    -   `const [theme, setTheme] = useState('light');`: Initializes a state variable `theme` with a default value of 'light'.
    -   **`useEffect` for Initial Theme:**
        -   Runs once on component mount (`[]` dependency array).
        -   Reads the saved theme preference from `localStorage`. If no theme is found, it defaults to 'light'.
        -   Sets the `theme` state to the saved theme.
        -   Toggles the 'dark' class on the `document.documentElement` (the `<html>` tag) based on the saved theme. This class is typically used by CSS frameworks like Tailwind CSS to apply dark mode styles.
    -   `toggleTheme` Function: A function to switch the theme.
        -   Determines the `newTheme` based on the current `theme`.
        -   Updates the `theme` state to the `newTheme`.
        -   Saves the `newTheme` to `localStorage` so the preference persists across sessions.
        -   Toggles the 'dark' class on `document.documentElement` to apply the new theme styles.
    -   **Context Provision:**
        -   Returns `ThemeContext.Provider`, making the `theme` state and `toggleTheme` function available to all descendant components via the `value` prop.
        -   Renders the `children` components within the provider.
-   `useTheme` Hook: A custom hook to easily consume the `ThemeContext`.
    -   Calls `useContext(ThemeContext)` to access the value provided by the nearest `ThemeContext.Provider` ancestor.
    -   This hook simplifies accessing the `theme` and `toggleTheme` in components without directly using `useContext`.

## Usage

Wrap the root of your application (or the part of the application that needs access to theme context) with the `ThemeProvider` component. Then, in any descendant component, use the `useTheme` hook to get the current theme and the function to toggle it.
