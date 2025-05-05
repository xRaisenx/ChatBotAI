.
├── .gitignore - Specifies intentionally untracked files that Git should ignore.
├── CHANGELOG.md - Documents changes made in each version of the project.
├── eslint.config.mjs - Configuration file for ESLint, a linter for JavaScript/TypeScript code.
├── next.config.mjs - Next.js configuration file (using MJS format).
├── next.config.ts - Next.js configuration file (using TypeScript format).
├── package-lock.json - Records the exact versions of dependencies used in the project.
├── package.json - Contains metadata about the project, including dependencies and scripts.
├── postcss.config.mjs - Configuration file for PostCSS, a tool for transforming CSS with JavaScript.
├── README.md - Provides a general overview of the project.
├── test-redis.js - Likely a script for testing Redis functionality.
├── tsconfig.json - Configuration file for TypeScript.
├── vercel.json - Configuration file for deploying to Vercel.
├── app/ - Directory for the App Router in Next.js.
│   ├── favicon.ico - Website icon displayed in browser tabs.
│   ├── globals.css - Global CSS styles for the application.
│   ├── layout.tsx - Root layout for the application (App Router).
│   ├── page.tsx - Root page component (App Router).
│   ├── api/ - Directory for API routes.
│   │   ├── chat/ - API route for chat functionality.
│   │   │   └── route.ts - API route handler for chat.
│   │   ├── generate-question/ - API route for generating questions.
│   │   │   └── route.ts - API route handler for generating questions.
│   │   └── sync-products/ - API route for syncing products.
│   │       └── route.ts - API route handler for syncing products.
│   ├── test-chat/ - Page for testing chat functionality.
│   │   └── page.tsx - Page component for testing chat.
│   └── test-sync/ - Page for testing sync functionality.
│       └── page.tsx - Page component for testing sync.
├── components/ - Directory for reusable React components.
│   ├── ChatInterface.tsx - Component for the chat user interface.
│   ├── ChatMessage.tsx - Component for displaying individual chat messages.
│   ├── ProductCard.tsx - Component for displaying product information.
│   └── ThemeToggle.tsx - Component for toggling between themes (e.g., light/dark mode).
├── lib/ - Directory for utility functions and libraries.
│   ├── gemini.ts - Library for interacting with the Gemini API.
│   ├── redis.ts - Library for interacting with Redis.
│   └── shopify.ts - Library for interacting with the Shopify API.
├── providers/ - Directory for React context providers.
│   └── ThemeProvider.tsx - Provides theme context to the application.
├── public/ - Directory for static assets served directly.
│   ├── file.svg - SVG icon for files.
│   ├── globe.svg - SVG icon for a globe.
│   ├── next.svg - SVG logo for Next.js.
│   ├── vercel.svg - SVG logo for Vercel.
│   └── window.svg - SVG icon for a window.
└── styles/ - Directory for additional styles (though globals.css is in app/).
    └── globals.css - Global CSS styles (duplicate of app/globals.css?).
