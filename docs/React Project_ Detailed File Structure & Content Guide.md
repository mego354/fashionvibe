# React Project: Detailed File Structure & Content Guide

This document provides a detailed breakdown of the recommended file structure for the React e-commerce frontend, elaborating on the purpose and expected content of key directories and files. It builds upon the architecture outlined in `frontend_structure_react.md`.

**Tech Stack:** React.js, Vite, TypeScript, Shadcn UI, Tailwind CSS, Redux Toolkit, Axios, React Router DOM, i18next.

```plaintext
/
├── public/
│   └── locales/                # Internationalization (i18n) files
│       ├── en/
│       │   └── translation.json  # English translations
│       └── ar/
│           └── translation.json  # Arabic translations
├── src/
│   ├── app/                    # Core application setup (Redux)
│   │   ├── store.ts            # Redux store configuration
│   │   └── hooks.ts            # Typed Redux hooks
│   ├── assets/                 # Static assets
│   │   ├── images/
│   │   └── fonts/
│   ├── components/             # Reusable UI components
│   │   ├── layouts/            # Page layout structures
│   │   │   ├── AppLayout.tsx     # Main layout for public/customer pages
│   │   │   ├── StoreAdminLayout.tsx # Layout for store management section
│   │   │   ├── AuthLayout.tsx    # Layout for login/register pages (optional)
│   │   │   └── AdminLayout.tsx   # Layout for platform admin (optional)
│   │   ├── shared/             # Common components used across features
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── DataTable/        # Reusable data table component (using Shadcn Table)
│   │   │   ├── ThemeToggle.tsx   # Component to switch themes
│   │   │   └── LanguageSwitcher.tsx # Component to switch languages
│   │   └── ui/                 # Shadcn UI components (managed by CLI)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ...             # Other Shadcn components
│   ├── config/                 # Application configuration files
│   │   ├── axios.ts            # Axios instance setup & interceptors
│   │   ├── i18n.ts             # i18next configuration
│   │   ├── router.tsx          # React Router DOM route definitions
│   │   └── constants.ts        # Global constants (e.g., ROLES, API paths)
│   ├── features/               # Feature-specific modules (logic, state, UI)
│   │   ├── auth/               # Authentication feature
│   │   │   ├── AuthGuard.tsx   # Route protection component
│   │   │   ├── authSlice.ts    # Redux slice (user, token, status)
│   │   │   ├── authApi.ts      # Axios functions for auth endpoints
│   │   │   ├── Login.tsx       # Login page component/logic
│   │   │   └── Register.tsx    # Registration page component/logic
│   │   ├── cart/               # Shopping cart feature
│   │   │   ├── cartSlice.ts    # Redux slice (items, totals)
│   │   │   ├── cartApi.ts      # Axios functions for cart endpoints
│   │   │   ├── CartPage.tsx    # Main cart view component
│   │   │   └── MiniCart.tsx    # Cart summary component (e.g., in header)
│   │   ├── products/           # Product browsing feature
│   │   │   ├── productSlice.ts # Redux slice (product list, detail, filters)
│   │   │   ├── productApi.ts   # Axios functions for product endpoints
│   │   │   ├── ProductListPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── ProductCard.tsx # Reusable component for product display
│   │   │   └── CategoryFilter.tsx # Component for filtering products
│   │   ├── orders/             # Customer order feature
│   │   │   ├── orderSlice.ts   # Redux slice (order history, detail)
│   │   │   ├── orderApi.ts     # Axios functions for order endpoints
│   │   │   ├── OrderHistoryPage.tsx
│   │   │   ├── OrderDetailPage.tsx
│   │   │   └── CheckoutFlow.tsx # Component managing checkout steps
│   │   ├── profile/            # Customer profile management
│   │   │   ├── profileSlice.ts # Redux slice (profile data, addresses)
│   │   │   ├── profileApi.ts   # Axios functions for user/address endpoints
│   │   │   ├── ProfilePage.tsx # Main profile view/edit component
│   │   │   └── AddressManagement.tsx # Component for managing addresses
│   │   ├── store/              # Public store profile feature
│   │   │   ├── storeSlice.ts   # Slice for public store data
│   │   │   ├── storeApi.ts     # API functions for public store endpoints
│   │   │   └── StoreProfilePage.tsx # Public view of a store
│   │   └── store-admin/        # Store management features (nested)
│   │       ├── analytics/      # Store analytics
│   │       │   ├── analyticsSlice.ts
│   │       │   ├── analyticsApi.ts
│   │       │   ├── DashboardPage.tsx
│   │       │   └── ProductPerformanceReport.tsx
│   │       ├── products/       # Store product management
│   │       │   ├── adminProductSlice.ts
│   │       │   ├── adminProductApi.ts
│   │       │   ├── ProductManagementPage.tsx
│   │       │   └── ProductEditForm.tsx
│   │       ├── orders/         # Store order management
│   │       │   ├── adminOrderSlice.ts
│   │       │   ├── adminOrderApi.ts
│   │       │   ├── OrderManagementPage.tsx
│   │       │   └── AdminOrderDetailPage.tsx
│   │       ├── staff/          # Store staff management
│   │       │   ├── staffSlice.ts
│   │       │   ├── staffApi.ts
│   │       │   └── StaffManagementPage.tsx
│   │       ├── inventory/      # Store inventory management
│   │       │   ├── inventorySlice.ts
│   │       │   ├── inventoryApi.ts
│   │       │   ├── WarehouseManagementPage.tsx
│   │       │   ├── InventoryListPage.tsx
│   │       │   └── StockTransferPage.tsx
│   │       └── settings/       # Store settings management
│   │           ├── StoreSettingsPage.tsx
│   │           ├── DomainManagement.tsx
│   │           ├── LocationManagement.tsx
│   │           └── SubscriptionPage.tsx
│   ├── hooks/                  # Custom reusable React hooks
│   │   ├── useAuth.ts          # Hook providing easy access to auth state/actions
│   │   ├── useDebounce.ts      # Hook for debouncing input
│   │   └── useTheme.ts         # Hook for accessing/managing theme state
│   ├── lib/                    # Utility functions and libraries
│   │   ├── utils.ts            # Shadcn utility function (cn)
│   │   ├── helpers.ts          # General helper functions (formatting, validation)
│   │   └── analytics.ts        # Helper function for tracking analytics events
│   ├── pages/                  # Top-level page components (often simple wrappers)
│   │   ├── HomePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── styles/                 # Global styles and theme definitions
│   │   ├── globals.css         # Tailwind directives, global CSS resets/styles
│   │   └── themes.css          # Custom theme variables (if extending Shadcn)
│   ├── App.tsx                 # Root application component
│   └── main.tsx                # Application entry point
├── .env                        # Environment variables (local)
├── .env.production             # Environment variables (production)
├── .eslintrc.cjs               # ESLint configuration
├── .gitignore                  # Git ignore rules
├── index.html                  # Vite entry HTML file
├── package.json                # Project dependencies and scripts
├── postcss.config.js           # PostCSS configuration (for Tailwind)
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript configuration for Node environment (Vite config)
└── vite.config.ts              # Vite configuration
```

## File Content Explanations

*   **`public/locales/**/*.json`**: Store key-value pairs for UI text translations (e.g., `"welcomeMessage": "Welcome!"`). Organized by language (`en`, `ar`) and potentially namespaces if needed.
*   **`src/app/store.ts`**: Configures the Redux store using `configureStore` from Redux Toolkit. Combines all feature reducers (slices) into the root reducer.
*   **`src/app/hooks.ts`**: Exports pre-typed versions of `useDispatch` and `useSelector` hooks (`useAppDispatch`, `useAppSelector`) for type safety with the Redux store.
*   **`src/assets/**`**: Contains static files like images, logos, and custom fonts.
*   **`src/components/layouts/*.tsx`**: Define the overall structure of different page types (e.g., header, footer, sidebar, main content area). Use `<Outlet />` from `react-router-dom` to render nested routes.
*   **`src/components/shared/*.tsx`**: House highly reusable, generic UI components that are not tied to a specific feature (e.g., loading indicators, error displays, theme toggles, language switchers, potentially a generic data table wrapper around Shadcn's table).
*   **`src/components/ui/*.tsx`**: Contains the UI primitive components provided and managed by the Shadcn UI CLI. You generally import from here but don't modify these files directly unless customizing Shadcn components.
*   **`src/config/axios.ts`**: Creates and configures the global Axios instance. Includes setting the `baseURL` from environment variables and setting up interceptors (e.g., to automatically add the `Authorization` header with the JWT token from Redux state, add `Accept-Language` header, and handle token refresh logic).
*   **`src/config/i18n.ts`**: Initializes and configures the `i18next` library, setting up language detection, backend loading for translation files (from `/public/locales`), fallback language, and integration with React (`react-i18next`).
*   **`src/config/router.tsx`**: Defines all application routes using `createBrowserRouter` from `react-router-dom`. Sets up nested routing, associates paths with page components, and integrates layout components and route guards (`AuthGuard`).
*   **`src/config/constants.ts`**: Defines application-wide constants, such as user role identifiers (`ROLES.CUSTOMER`, `ROLES.MANAGER`), base API paths, or other magic strings/numbers to avoid hardcoding them throughout the app.
*   **`src/features/**/`**: The core of the application logic, organized by feature/domain.
    *   **`*Slice.ts`**: Defines the Redux state structure, reducers, and asynchronous thunks (using `createSlice` and `createAsyncThunk`) for a specific feature. Manages the feature's data, loading states, and errors.
    *   **`*Api.ts`**: Contains functions that use the configured Axios instance (`apiClient`) to make specific API calls related to the feature. These functions are typically called by Redux thunks.
    *   **`*.tsx` (Pages/Components)**: React components specific to the feature. Page components (e.g., `ProductListPage.tsx`) assemble feature-specific components and connect to the Redux store (using `useAppSelector`, `useAppDispatch`) to fetch data and dispatch actions. Smaller components (e.g., `ProductCard.tsx`) handle specific UI parts.
    *   **`AuthGuard.tsx`**: A component used in `router.tsx` to protect routes. It checks the user's authentication status and role (from the `authSlice`) and either renders the child routes (`<Outlet />`) or redirects to the login page.
*   **`src/hooks/*.ts`**: Custom React hooks providing reusable logic or simplifying access to context/state (e.g., `useAuth` might provide `isAuthenticated`, `user`, `login`, `logout` derived from the Redux store).
*   **`src/lib/utils.ts`**: Contains the `cn` utility function from Shadcn for conditionally merging Tailwind classes.
*   **`src/lib/helpers.ts`**: General utility functions not specific to any feature or library (e.g., date formatting, currency formatting, simple validation helpers).
*   **`src/lib/analytics.ts`**: Utility functions (like `trackEvent`) to standardize and simplify sending analytics data to the backend (`POST /api/analytics/events/`).
*   **`src/pages/*.tsx`**: Often simple wrapper components that import and render the main component for a specific route from the corresponding `features` directory. Helps keep the `router.tsx` configuration cleaner.
*   **`src/styles/globals.css`**: Includes Tailwind's base, components, and utilities directives (`@tailwind`). Also the place for any truly global styles or CSS variable definitions (including Shadcn theme variables).
*   **`src/styles/themes.css`**: Optional file for defining custom themes or overriding default Shadcn/Tailwind theme variables if extensive customization is needed.
*   **`src/App.tsx`**: The main application component. Sets up providers (Redux `<Provider>`, potentially ThemeProvider, RouterProvider from `react-router-dom` if not handled in `main.tsx`), and renders the main router configuration.
*   **`src/main.tsx`**: The entry point of the React application. Renders the root `App` component into the DOM. Imports necessary configurations like `i18n` and global CSS.
*   **`.env*`**: Files for environment variables (e.g., `VITE_API_BASE_URL`). Vite loads these automatically.
*   **`index.html`**: The HTML template used by Vite. The `main.tsx` script is injected here.
*   **Configuration Files (`.eslintrc.cjs`, `postcss.config.js`, `tailwind.config.js`, `tsconfig.json`, `vite.config.ts`)**: Standard configuration files for their respective tools (Linting, PostCSS, Tailwind, TypeScript, Vite). Customize these according to project needs (e.g., adding Tailwind plugins, configuring Vite build options).

This detailed structure promotes separation of concerns, maintainability, and scalability for the React application.
