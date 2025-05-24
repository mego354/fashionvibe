# Frontend Architecture & Structure: React E-commerce Platform

This document details a recommended frontend architecture and project structure for the multi-store fashion e-commerce platform, specifically tailored for a **React.js (v18+)** application built with **Vite**, styled using **Tailwind CSS** and **Shadcn UI**, with state management handled by **Redux Toolkit**, API interactions via **Axios**, and support for **bilingual (English/Arabic)** functionality and **theming**.

## 1. Core Technologies & Setup

*   **Build Tool:** Vite (for fast development server and optimized builds)
*   **Framework:** React.js
*   **UI Components:** Shadcn UI (leveraging Radix UI and Tailwind CSS)
*   **Styling:** Tailwind CSS (utility-first CSS framework)
*   **Routing:** `react-router-dom` (v6+)
*   **State Management:** Redux Toolkit (`@reduxjs/toolkit`)
*   **API Client:** Axios
*   **Internationalization (i18n):** `i18next` with `react-i18next`
*   **Type Checking:** TypeScript (Recommended for scalability and maintainability)

**Initial Setup (Conceptual):**

```bash
# Using pnpm (recommended by Shadcn)
pnpm create vite my-ecommerce-app --template react-ts
cd my-ecommerce-app

# Install Tailwind CSS
pnpm install -D tailwindcss postcss autoprefixer
pnpm tailwindcss init -p
# (Configure tailwind.config.js, postcss.config.js, index.css)

# Install Shadcn UI
pnpm dlx shadcn-ui@latest init
# (Configure components.json, globals.css, lib/utils.ts)
# Add desired Shadcn components (e.g., Button, Card, Input)
pnpm dlx shadcn-ui@latest add button card input ...

# Install Routing, State Management, API Client, i18n
pnpm install react-router-dom @reduxjs/toolkit react-redux axios i18next react-i18next i18next-browser-languagedetector

# Install types if needed
pnpm install -D @types/react-router-dom ...
```

## 2. Project Structure (Recommended)

```plaintext
/public/
  /locales/
    /en/
      translation.json
    /ar/
      translation.json
/src/
  /app/
    store.ts          # Redux store configuration
    hooks.ts          # Typed Redux hooks (useAppDispatch, useAppSelector)
  /assets/
    /images/
    /fonts/
  /components/
    /layouts/         # Main layout structures (AppLayout, AuthLayout, StoreAdminLayout, etc.)
      AppLayout.tsx
      StoreAdminLayout.tsx
      ...
    /shared/          # Reusable UI components across features (e.g., LoadingSpinner, ErrorMessage)
      LoadingSpinner.tsx
    /ui/              # Shadcn UI components (automatically generated/managed)
      button.tsx
      card.tsx
      ...
  /config/
    axios.ts          # Axios instance configuration
    i18n.ts           # i18next configuration
    router.tsx        # Application routes definition
    constants.ts      # Application-wide constants (e.g., user roles)
  /features/
    /auth/
      AuthGuard.tsx     # Route protection component
      authSlice.ts      # Redux slice for authentication state
      authApi.ts        # API service functions for auth endpoints
      Login.tsx         # Login page component
      Register.tsx      # Registration page component
      ...
    /cart/
      cartSlice.ts
      cartApi.ts
      CartPage.tsx
      MiniCart.tsx
      ...
    /products/
      productSlice.ts
      productApi.ts
      ProductListPage.tsx
      ProductDetailPage.tsx
      ProductCard.tsx
      CategoryFilter.tsx
      ...
    /orders/
      orderSlice.ts
      orderApi.ts
      OrderHistoryPage.tsx
      OrderDetailPage.tsx
      CheckoutFlow.tsx
      ...
    /profile/
      profileSlice.ts
      profileApi.ts
      ProfilePage.tsx
      AddressManagement.tsx
      ...
    /store/
      storeSlice.ts     # General store info/settings
      storeApi.ts
      StoreProfilePage.tsx # Public view
      ...
    /store-admin/       # Pages and components for Store Owner/Manager/Staff
      /analytics/
        analyticsSlice.ts
        analyticsApi.ts
        DashboardPage.tsx
        ProductPerformanceReport.tsx
        ...
      /products/
        adminProductSlice.ts # Separate slice for admin view if needed
        adminProductApi.ts
        ProductManagementPage.tsx
        ProductEditForm.tsx
        VariantManager.tsx
        ImageUploader.tsx
        ...
      /orders/
        adminOrderSlice.ts
        adminOrderApi.ts
        OrderManagementPage.tsx
        AdminOrderDetailPage.tsx
        ...
      /staff/
        staffSlice.ts
        staffApi.ts
        StaffManagementPage.tsx
        ...
      /inventory/
        inventorySlice.ts
        inventoryApi.ts
        WarehouseManagementPage.tsx
        InventoryListPage.tsx
        StockTransferPage.tsx
        ...
      /settings/
        StoreSettingsPage.tsx
        DomainManagement.tsx
        LocationManagement.tsx
        SubscriptionPage.tsx
        ...
    /admin/             # Platform Admin specific features (if applicable)
      AdminDashboard.tsx
      UserManagementPage.tsx
      PlatformStoreManagementPage.tsx
      ...
  /hooks/               # Custom reusable hooks (e.g., useAuth, useDebounce)
    useAuth.ts
  /lib/
    utils.ts          # Shadcn utility functions (cn)
    helpers.ts        # General helper functions
  /pages/               # Top-level page components (often importing from features)
    HomePage.tsx
    NotFoundPage.tsx
    ...
  /styles/
    globals.css       # Global styles, Tailwind base/components/utilities
    themes.css        # Theme definitions if customizing beyond Shadcn defaults
  App.tsx             # Main application component (sets up Router, Redux Provider, Theme Provider)
  main.tsx            # Application entry point (renders App)
.env                  # Environment variables (VITE_API_BASE_URL)
tailwind.config.js
postcss.config.js
tsconfig.json
vite.config.ts
```

## 3. Routing (`react-router-dom`)

Define routes in `/src/config/router.tsx`. Use nested routes and layout routes effectively.

```typescript
// src/config/router.tsx (Simplified Example)
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import StoreAdminLayout from '../components/layouts/StoreAdminLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../features/auth/Login';
import RegisterPage from '../features/auth/Register';
import ProductListPage from '../features/products/ProductListPage';
import ProductDetailPage from '../features/products/ProductDetailPage';
import CartPage from '../features/cart/CartPage';
import CheckoutFlow from '../features/orders/CheckoutFlow';
import OrderHistoryPage from '../features/orders/OrderHistoryPage';
import ProfilePage from '../features/profile/ProfilePage';
import StoreDashboardPage from '../features/store-admin/analytics/DashboardPage';
import ProductManagementPage from '../features/store-admin/products/ProductManagementPage';
// ... other imports
import AuthGuard from '../features/auth/AuthGuard';
import { ROLES } from './constants'; // Define role constants

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:productId', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      // Customer Protected Routes
      {
        element: <AuthGuard allowedRoles={[ROLES.CUSTOMER]} />,
        children: [
          { path: 'checkout', element: <CheckoutFlow /> },
          { path: 'orders', element: <OrderHistoryPage /> },
          // { path: 'orders/:orderId', element: <OrderDetailPage /> }, // Customer order detail
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      // ... other public routes (store directory, etc.)
    ],
  },
  // Store Management Routes (Owner/Manager/Staff)
  {
    path: '/manage',
    element: (
      <AuthGuard allowedRoles={[ROLES.OWNER, ROLES.MANAGER, ROLES.STAFF]}>
        <StoreAdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <StoreDashboardPage /> },
      { path: 'products', element: <ProductManagementPage /> },
      // { path: 'products/new', element: <ProductEditPage /> },
      // { path: 'products/:productId/edit', element: <ProductEditPage /> },
      // { path: 'orders', element: <OrderManagementPage /> },
      // { path: 'orders/:orderId', element: <AdminOrderDetailPage /> },
      // { path: 'staff', element: <StaffManagementPage /> },
      // { path: 'inventory', element: <InventoryListPage /> },
      // { path: 'settings', element: <StoreSettingsPage /> },
      // ... other management routes
    ],
  },
  // Platform Admin Routes (Superuser)
  // {
  //   path: '/admin',
  //   element: (
  //     <AuthGuard allowedRoles={[ROLES.ADMIN]}>
  //       <AdminLayout />
  //     </AuthGuard>
  //   ),
  //   children: [
  //     // ... admin routes
  //   ],
  // },
  { path: '*', element: <NotFoundPage /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;
```

*   `AuthGuard` component checks authentication status and user role (fetched from Redux state) before rendering child routes.
*   Layouts (`AppLayout`, `StoreAdminLayout`) provide consistent structure (header, footer, sidebar).

## 4. State Management (`@reduxjs/toolkit`)

Organize state into feature slices.

```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
// ... other reducers

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    // ... other features
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// src/app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// src/features/auth/authSlice.ts (Example Slice)
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, fetchCurrentUser, UserCredentials, User } from './authApi'; // Assuming authApi exports these

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'), // Example: Load token initially
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: UserCredentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      localStorage.setItem('authToken', response.access); // Example: Store token
      // Fetch user profile after successful login
      // This could also be done in the component after login succeeds
      return { token: response.access }; // Return token, user fetched separately or chained
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    if (!token) return rejectWithValue('No token found');
    try {
      const user = await fetchCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken'); // Example: Clear token
      state.status = 'idle';
    },
    setToken: (state, action: PayloadAction<string | null>) => {
       state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        // User data might be set by getCurrentUser thunk
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.token = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
         // Handle failure to fetch user, maybe logout
         state.user = null;
         state.token = null;
         localStorage.removeItem('authToken');
      });
      // ... handle other thunks (register, etc.)
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectAuthStatus = (state: RootState) => state.auth.status;
```

*   Use `createAsyncThunk` to handle asynchronous API calls.
*   Store tokens appropriately (e.g., access token in memory/Redux state, refresh token in HttpOnly cookie managed by backend if possible, or secure local storage as a fallback).
*   Fetch user data after login or on initial app load if a token exists.

## 5. API Layer (Axios)

Configure a reusable Axios instance.

```typescript
// src/config/axios.ts
import axios from 'axios';
import { store } from '../app/store'; // Import Redux store
import { setToken } from '../features/auth/authSlice'; // Import action to update token

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Auth Token and Language
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    const language = store.getState().i18n.language; // Assuming an i18n slice

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (language) {
      config.headers['Accept-Language'] = language;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Refresh (Simplified Example)
// Note: Proper token refresh logic can be complex and might involve queuing requests.
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized and if it's not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken'); // Example: Get refresh token

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${apiClient.defaults.baseURL}/users/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccessToken = data.access;
          store.dispatch(setToken(newAccessToken)); // Update token in Redux
          localStorage.setItem('authToken', newAccessToken); // Update stored token

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return apiClient(originalRequest); // Retry original request
        } catch (refreshError) {
          // Refresh token failed, logout user
          store.dispatch(logout()); // Dispatch logout action
          processQueue(refreshError, null);
          // Redirect to login or handle appropriately
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
         finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token, logout user
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default apiClient;

// src/features/auth/authApi.ts (Example API functions)
import apiClient from '../../config/axios';

export const loginUser = async (credentials: UserCredentials) => {
  const response = await apiClient.post('/users/token/', credentials);
  return response.data; // Should contain access & refresh tokens
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get('/users/me/');
  return response.data; // User object
};

// ... other API functions for registration, etc.
```

*   Define API functions within feature folders (e.g., `src/features/auth/authApi.ts`).
*   Use the configured `apiClient` for all requests.
*   Implement interceptors for adding auth tokens, handling language preferences, and potentially managing token refresh logic.

## 6. UI Components (Shadcn UI + Tailwind)

*   **Structure:** Organize components into `/pages`, `/components/layouts`, `/components/shared`, and feature-specific components within `/features/*`.
*   **Shadcn UI:** Use components imported from `/src/components/ui` (e.g., `import { Button } from '@/components/ui/button';`). Leverage Shadcn's composition patterns.
*   **Tailwind CSS:** Apply utility classes directly for styling. Keep custom CSS minimal.
*   **Responsiveness:** Utilize Tailwind's responsive modifiers (e.g., `md:`, `lg:`) for mobile-friendly design.
*   **Theming:**
    *   Shadcn UI comes with built-in theme support via CSS variables.
    *   Implement a theme switcher component (e.g., in the `AppLayout`) that modifies the `<html>` tag's class (e.g., `class="dark"`) or applies theme-specific classes.
    *   Leverage Shadcn's theme customization documentation to adjust colors or create custom themes if the 29+ built-in options are insufficient.
    *   Store the selected theme preference (e.g., in local storage and potentially a Redux slice) to persist user choice.

```typescript
// Example Theme Provider setup in App.tsx
import { ThemeProvider } from './components/theme-provider'; // Assuming a provider component

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </ThemeProvider>
  );
}
```

## 7. Internationalization (i18n)

Use `i18next` and `react-i18next`.

```typescript
// src/config/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend'; // To load translations from /public/locales

i18n
  .use(HttpApi) // Load translations using http -> /public/locales
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass the i18n instance to react-i18next
  .init({
    supportedLngs: ['en', 'ar'],
    fallbackLng: 'en',
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'], // Cache detected language
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
    react: {
      useSuspense: true, // Recommended for async loading
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;

// src/main.tsx - Import i18n config
import './config/i18n';
// ... rest of main.tsx

// Usage in components
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Optionally update backend preference if needed
    // Optionally update Axios 'Accept-Language' header via interceptor state
  };

  return (
    <div>
      <h1>{t('welcomeMessage')}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
    </div>
  );
}
```

*   Store translation strings in JSON files (`/public/locales/en/translation.json`, `/public/locales/ar/translation.json`).
*   Use the `useTranslation` hook to access the `t` function for translating strings.
*   Implement a language switcher UI element.
*   Ensure the `Accept-Language` header is sent with API requests (handled by Axios interceptor).

## 8. Analytics Integration

Leverage the analytics endpoints defined in the schema.

*   **Event Tracking (`POST /api/analytics/events/`):**
    *   Identify key user interactions to track (e.g., product view, add to cart, order completion, filter usage, feature usage in admin panels).
    *   Create a utility function or hook (`useAnalytics`) to simplify sending events.
    *   Call this function from relevant components or Redux thunks.
    *   Payload should include `event_type` and relevant context (e.g., `product_id`, `category_id`, `user_id` if available).

    ```typescript
    // Example: src/lib/analytics.ts
    import apiClient from '../config/axios';

    interface AnalyticsPayload {
      event_type: string;
      payload?: Record<string, any>;
      // user_id might be added backend based on token
    }

    export const trackEvent = async (data: AnalyticsPayload) => {
      try {
        await apiClient.post('/analytics/events/', data);
      } catch (error) {
        console.error('Failed to track analytics event:', error);
        // Handle error silently or log appropriately
      }
    };

    // Usage in a component
    useEffect(() => {
      trackEvent({ event_type: 'product_view', payload: { productId } });
    }, [productId]);
    ```

*   **Displaying Analytics Data:**
    *   Fetch data using the `/api/analytics/*` endpoints (e.g., `GET /analytics/daily/dashboard/`, `GET /analytics/products/`, `GET /analytics/products/top_products/`).
    *   Use dedicated Redux slices (`analyticsSlice`) and API functions (`analyticsApi.ts`) within the `/features/store-admin/analytics` folder.
    *   Display this data using charts (e.g., using `recharts` or `chart.js` adapted for React) and tables within the Store Owner/Manager/Admin dashboards.
    *   Ensure appropriate permissions are checked before fetching/displaying sensitive analytics.

## 9. Build & Deployment

*   Use Vite's build command: `pnpm build`.
*   This generates an optimized static build in the `/dist` folder.
*   Deploy the contents of the `/dist` folder to any static hosting provider (Netlify, Vercel, AWS S3/CloudFront, etc.).
*   Ensure environment variables (like `VITE_API_BASE_URL`) are correctly configured in the deployment environment.

This structure provides a solid foundation for building a scalable, maintainable, and feature-rich React frontend based on the specified stack and requirements.
