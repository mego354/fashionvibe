# Frontend Pages & Data Flow (Based on schema.yaml)

This document outlines the anticipated frontend pages and describes the flow of data within the user interface, based on the provided `schema (3).yaml` and the derived data models and roles. It assumes a modern Single Page Application (SPA) architecture.

## Assumed Frontend Architecture

*   **Framework:** React, Vue, Angular, or similar component-based framework.
*   **Routing:** Client-side routing manages navigation without full page reloads.
*   **API Interaction:** Asynchronous calls to the backend API (documented in `api_documentation.md`) using libraries like `fetch` or `axios`.
*   **State Management:** A combination of local component state and a global state management solution (e.g., Redux, Vuex, Zustand, Context API) is employed.

## Global State and Core Data Flows

Several key pieces of information are likely managed globally due to their widespread use across the application:

1.  **Authentication State:**
    *   **Data:** Authentication status (logged in/out), current user object (`User` schema from `/api/users/me/`), JWT tokens (access, refresh).
    *   **Source of Truth:** Global State, hydrated from secure storage (e.g., HttpOnly cookies for refresh token, memory/session storage for access token) and updated via API calls (`/api/users/token/`, `/api/users/token/refresh/`, `/api/users/register/`, `/api/users/me/`).
    *   **Flow:** Login/Register actions update global state with user info and tokens. The access token is attached to authenticated API requests. UI elements (navbars, menus) subscribe to this state to adapt based on login status and user role (`is_staff`, `is_superuser`, potentially specific permissions/groups).

2.  **Shopping Cart State:**
    *   **Data:** Current cart contents (`Cart` schema, likely including items with product/variant details, totals).
    *   **Source of Truth:** Global State, synchronized with the backend via API calls (`GET /api/orders/cart/my_cart/`, `POST /api/orders/cart/add_item/`, etc.).
    *   **Flow:** Adding/updating/removing items triggers API calls. The response updates the global cart state. Components like the mini-cart and the main cart page subscribe to this state.

3.  **Store Management Context (for Owner/Manager/Staff):**
    *   **Data:** The ID and potentially basic details of the store currently being managed.
    *   **Source of Truth:** Global State or a dedicated context provider, likely set after login or when navigating to the store management section (e.g., fetching the relevant store via `GET /api/stores/{id}/` based on the user's association).
    *   **Flow:** When a user with store management privileges logs in or accesses their store section, the relevant store context is established. API calls within this section (e.g., managing products, orders, staff) will implicitly or explicitly use this store context (often via path parameters like `{store_pk}` or backend logic based on the authenticated user).

## Frontend Pages

This section details the required pages, grouped by typical access patterns.

### Public / Guest Pages

These pages are accessible without authentication.

1.  **Homepage:**
    *   **Purpose:** Main landing page, showcasing featured products, categories, promotions, or stores.
    *   **Data Displayed:** Featured products (potentially from `GET /api/products/?is_featured=true`), categories (`GET /api/products/categories/`), promotional banners.
    *   **Data Fetched:** Products, categories.
    *   **Source:** API.

2.  **Product Listing Page (PLP):**
    *   **Purpose:** Display a grid or list of products based on category, search query, or filters.
    *   **Data Displayed:** Paginated list of products (`Product` summary: name, image, price, store name, rating), filter options (categories, price range, attributes), sorting options.
    *   **Data Fetched:** Products (`GET /api/products/` with query params for filtering, sorting, pagination), Categories (`GET /api/products/categories/` for filter options).
    *   **Source:** API.
    *   **Data Flow:** User interactions (selecting filters, sorting, pagination) trigger new API calls to `/api/products/` with updated query parameters, refreshing the displayed product list.

3.  **Product Detail Page (PDP):**
    *   **Purpose:** Show detailed information about a single product.
    *   **Data Displayed:** Full product details (`Product` schema: name, description, images, price, variants), variant selection options (size, color), stock status (derived from variant stock), store information, reviews (`ProductReview` schema).
    *   **Data Fetched:** Specific product details (`GET /api/products/{id}/`), including variants (`GET /api/products/{id}/variants/` or included in product detail), reviews (`GET /api/products/{product_pk}/reviews/`).
    *   **Source:** API.
    *   **Data Flow:** User selects variants, triggering UI updates (price, stock status, potentially image). "Add to Cart" button triggers `POST /api/orders/cart/add_item/` (requires login).

4.  **Category Listing Page:**
    *   **Purpose:** Display available product categories, potentially hierarchically.
    *   **Data Displayed:** List or tree of categories (`Category` schema: name, image).
    *   **Data Fetched:** Categories (`GET /api/products/categories/`, potentially `GET /api/products/categories/root/`).
    *   **Source:** API.

5.  **Store Directory/Listing Page:**
    *   **Purpose:** List available stores on the platform.
    *   **Data Displayed:** Paginated list of stores (`Store` summary: name, logo, description snippet).
    *   **Data Fetched:** Stores (`GET /api/stores/`).
    *   **Source:** API.

6.  **Store Profile Page:**
    *   **Purpose:** Display details about a specific store and its products.
    *   **Data Displayed:** Store details (`Store` schema: name, logo, cover photo, description), list of products offered by the store.
    *   **Data Fetched:** Store details (`GET /api/stores/{id}/`), store's products (`GET /api/products/?store={id}`).
    *   **Source:** API.

7.  **Login Page:**
    *   **Purpose:** Allow users to authenticate.
    *   **Data Posted:** Email and password.
    *   **API Interaction:** `POST /api/users/token/`.
    *   **Data Flow:** On success, stores tokens and user info in global state, redirects to appropriate dashboard or previous page.

8.  **Registration Page:**
    *   **Purpose:** Allow new users to create an account.
    *   **Data Posted:** Email, password, first name, last name (based on `UserRegistration` schema).
    *   **API Interaction:** `POST /api/users/register/`.
    *   **Data Flow:** On success, potentially logs the user in (stores tokens/user info) and redirects.

### Customer Pages (Require Authentication)

These pages are accessible after a customer logs in.

1.  **Customer Dashboard/Account Overview:**
    *   **Purpose:** Central hub for customer account management.
    *   **Data Displayed:** Welcome message, summary of recent orders, links to profile settings, addresses, order history.
    *   **Data Fetched:** User profile (`GET /api/users/me/`), recent orders (`GET /api/orders/?limit=5`).
    *   **Source:** API, Global Auth State.

2.  **Profile Settings Page:**
    *   **Purpose:** Allow customers to view and update their personal information.
    *   **Data Displayed:** User's first name, last name, email.
    *   **Data Fetched:** Current user data (`GET /api/users/me/`).
    *   **Data Posted:** Updated profile fields (`PATCH /api/users/{id}/` - using the ID from `/users/me/`), potentially password change (`POST /api/users/change_password/`).
    *   **Source:** API, Global Auth State.
    *   **Data Flow:** Fetches current data, user edits form, submits changes via API, updates global auth state on success.

3.  **Address Management Page:**
    *   **Purpose:** Allow customers to add, view, edit, delete, and set default shipping/billing addresses.
    *   **Data Displayed:** List of saved addresses (`Address` schema).
    *   **Data Fetched:** User addresses (`GET /api/users/addresses/`).
    *   **Data Posted:** New address (`POST /api/users/addresses/`), updated address (`PUT/PATCH /api/users/addresses/{id}/`), delete action (`DELETE /api/users/addresses/{id}/`), set default action (`POST /api/users/addresses/{id}/set_default/`).
    *   **Source:** API.
    *   **Data Flow:** Fetches addresses, displays list. Forms trigger API calls to modify addresses, list refreshes on success.

4.  **Order History Page:**
    *   **Purpose:** Display a list of all past and current orders placed by the customer.
    *   **Data Displayed:** Paginated list of orders (`Order` summary: ID, date, total amount, status).
    *   **Data Fetched:** Orders (`GET /api/orders/` with pagination/filtering).
    *   **Source:** API.

5.  **Order Detail Page:**
    *   **Purpose:** Show detailed information about a specific order.
    *   **Data Displayed:** Full order details (`Order` schema: items, status history, shipping/billing addresses, totals, assigned staff if applicable), product details for items (`OrderItem` schema).
    *   **Data Fetched:** Specific order (`GET /api/orders/{id}/`), potentially including items (`GET /api/orders/{order_pk}/items/` if not nested).
    *   **Source:** API.
    *   **Data Flow:** May include link to submit reviews for delivered items.

6.  **Shopping Cart Page:**
    *   **Purpose:** Allow customers to review and modify items before checkout.
    *   **Data Displayed:** Cart items (product name, variant, image, price, quantity, line total), subtotal, estimated shipping/taxes, total.
    *   **Data Fetched:** Cart state (`GET /api/orders/cart/my_cart/`).
    *   **Data Posted:** Quantity updates (`POST /api/orders/cart/update_item/`), item removal (`POST /api/orders/cart/remove_item/`), clear cart (`POST /api/orders/cart/clear/`).
    *   **Source:** Global Cart State, synchronized with API.
    *   **Data Flow:** User actions trigger API calls, global state updates, UI reflects changes. "Proceed to Checkout" button navigates to the checkout flow.

7.  **Checkout Page(s):**
    *   **Purpose:** Guide the customer through shipping, billing, and payment steps.
    *   **Data Displayed:** Forms for shipping/billing addresses (can select saved or add new), shipping method options, order summary, payment options.
    *   **Data Fetched:** Saved addresses (`GET /api/users/addresses/`), potentially shipping options based on address/cart.
    *   **Data Posted:** Selected addresses, shipping method, payment details (tokenized via payment gateway integration), leading to order creation (`POST /api/orders/`).
    *   **Source:** API, Global Cart State, Payment Gateway SDK.
    *   **Data Flow:** Multi-step process. Address selection/entry updates order preview. Payment initiation (`POST /api/payments/initiate/` might occur here or via gateway SDK) generates payment intent. Final submission triggers `POST /api/orders/` with payment confirmation details.

8.  **Review Submission Form/Page:**
    *   **Purpose:** Allow customers to write reviews for purchased products.
    *   **Data Displayed:** Product being reviewed, rating input (stars), comment box.
    *   **Data Fetched:** Product details (`GET /api/products/{id}/`).
    *   **Data Posted:** Rating and comment (`POST /api/products/{product_pk}/reviews/`).
    *   **Source:** API.

### Store Management Pages (Require Store Owner/Manager/Staff Authentication)

This section likely represents a distinct area of the application, often referred to as the "Seller Portal" or "Store Dashboard". Access control within this section is critical, based on the user's role (`Staff` schema `role` field) and permissions (`Staff` schema `permissions` array).

1.  **Store Dashboard:**
    *   **Purpose:** Overview of store performance and quick access to management tasks.
    *   **Data Displayed:** Key metrics (sales, orders, visits - potentially from `GET /api/analytics/daily/dashboard/`), recent orders, low stock alerts, notifications.
    *   **Data Fetched:** Analytics (`GET /api/analytics/*`), recent orders (`GET /api/orders/`), potentially inventory summaries (`GET /api/warehouses/inventory/`).
    *   **Source:** API.

2.  **Product Management Page:**
    *   **Purpose:** List, filter, search, add, edit, and delete store products.
    *   **Data Displayed:** Paginated table/list of products (`Product` schema), filters (status, category), search bar, bulk action controls.
    *   **Data Fetched:** Store's products (`GET /api/products/` scoped to store), categories (`GET /api/products/categories/`).
    *   **Data Posted:** Bulk actions (`POST /api/products/bulk-create/`, `PUT /api/products/bulk-update/`, `DELETE /api/products/bulk-delete/`). Links to Add/Edit Product pages.
    *   **Source:** API.

3.  **Add/Edit Product Page:**
    *   **Purpose:** Form to create or modify a single product, including variants and images.
    *   **Data Displayed:** Form fields corresponding to `ProductCreateUpdate`, `Variant`, and `ProductImage` schemas.
    *   **Data Fetched:** Existing product data for editing (`GET /api/products/{id}/`), categories (`GET /api/products/categories/`).
    *   **Data Posted:** Product data (`POST /api/products/` or `PUT/PATCH /api/products/{id}/`), variant data (`POST/PUT/PATCH /api/products/{product_pk}/variants/{id}/`), image uploads/data (`POST/PUT/PATCH /api/products/{product_pk}/images/{id}/`).
    *   **Source:** API.
    *   **Data Flow:** Complex form potentially involving sub-components for variants and image uploads. Saving triggers multiple API calls or a single complex one.

4.  **Category Management Page:**
    *   **Purpose:** Manage product categories specific to the store or platform (depending on permissions).
    *   **Data Displayed:** List/tree of categories.
    *   **Data Fetched:** Categories (`GET /api/products/categories/`).
    *   **Data Posted:** Create (`POST /api/products/categories/`), Update (`PUT/PATCH /api/products/categories/{id}/`), Delete (`DELETE /api/products/categories/{id}/`).
    *   **Source:** API.

5.  **Order Management Page:**
    *   **Purpose:** List, filter, search, and view details of store orders.
    *   **Data Displayed:** Paginated table/list of orders (`Order` schema), filters (status, date range), search bar.
    *   **Data Fetched:** Store's orders (`GET /api/orders/` scoped to store).
    *   **Source:** API.
    *   **Data Flow:** Links to Order Detail page.

6.  **Store Order Detail Page:**
    *   **Purpose:** View full details of a specific order and perform actions like updating status or assigning staff.
    *   **Data Displayed:** Full order details (`Order`, `OrderItem`), customer info, status update options, staff assignment options.
    *   **Data Fetched:** Specific order (`GET /api/orders/{id}/`), staff list for assignment (`GET /api/staff/`).
    *   **Data Posted:** Status updates (`POST /api/orders/{id}/update_status/`), staff assignment (`POST /api/orders/{id}/assign_staff/`).
    *   **Source:** API.

7.  **Staff Management Page:**
    *   **Purpose:** Invite, view, edit permissions, activate/deactivate, and remove staff members (Owner/Manager access).
    *   **Data Displayed:** List of staff members (`Staff` schema), their roles, status, permissions.
    *   **Data Fetched:** Staff list (`GET /api/staff/`).
    *   **Data Posted:** Invite (`POST /api/staff/`), Update (`PUT/PATCH /api/staff/{id}/`), Delete (`DELETE /api/staff/{id}/`), Activate (`POST /api/staff/{id}/activate/`), Deactivate (`POST /api/staff/{id}/deactivate/`).
    *   **Source:** API.

8.  **Warehouse Management Page:**
    *   **Purpose:** Add, view, edit, delete warehouses for the store.
    *   **Data Displayed:** List of warehouses (`Warehouse` schema).
    *   **Data Fetched:** Warehouses (`GET /api/warehouses/`).
    *   **Data Posted:** Create (`POST /api/warehouses/`), Update (`PUT/PATCH /api/warehouses/{id}/`), Delete (`DELETE /api/warehouses/{id}/`), Set Default (`POST /api/warehouses/{id}/set_default/`).
    *   **Source:** API.

9.  **Inventory Management Page:**
    *   **Purpose:** View and manage stock levels across warehouses.
    *   **Data Displayed:** Table/list of inventory records (`Inventory` schema: variant, warehouse, quantity), potentially filterable by product/variant/warehouse.
    *   **Data Fetched:** Inventory records (`GET /api/warehouses/inventory/` or `GET /api/warehouses/{id}/inventory/`).
    *   **Data Posted:** Stock adjustments (`POST /api/warehouses/inventory/{id}/adjust_stock/`), potentially creating initial records (`POST /api/warehouses/inventory/`). Links to Stock Transfer.
    *   **Source:** API.

10. **Stock Transfer Page:**
    *   **Purpose:** Create and track stock transfers between warehouses.
    *   **Data Displayed:** List of past transfers (`StockTransfer` schema), form to create new transfer.
    *   **Data Fetched:** Transfers (`GET /api/warehouses/transfers/`), Warehouses (`GET /api/warehouses/`), Variants (for selection).
    *   **Data Posted:** New transfer (`POST /api/warehouses/transfers/`), potentially updating status (`PUT/PATCH /api/warehouses/transfers/{id}/`).
    *   **Source:** API.

11. **Store Settings Page:**
    *   **Purpose:** Configure store details, logo, policies, domains, locations.
    *   **Data Displayed:** Forms for store name, description, logo/cover photo upload, domain management, location management.
    *   **Data Fetched:** Store details (`GET /api/stores/{id}/`), domains (`GET /api/stores/{store_pk}/domains/`), locations (`GET /api/stores/{store_pk}/locations/`).
    *   **Data Posted:** Store updates (`PUT/PATCH /api/stores/{id}/`), settings updates (`PATCH /api/stores/{id}/update_settings/`), domain actions (`POST/PUT/PATCH/DELETE /api/stores/{store_pk}/domains/{id}/`), location actions (`POST/PUT/PATCH/DELETE /api/stores/{store_pk}/locations/{id}/`).
    *   **Source:** API.

12. **Analytics Pages:**
    *   **Purpose:** Display various analytics reports (daily, product performance, staff performance).
    *   **Data Displayed:** Charts, tables showing analytics data.
    *   **Data Fetched:** Data from various `/api/analytics/*` endpoints, potentially staff performance (`GET /api/staff/performance/`).
    *   **Source:** API.

13. **Subscription Management Page:**
    *   **Purpose:** View current subscription plan, limits, payment history, and potentially upgrade/renew/cancel.
    *   **Data Displayed:** Current subscription details (`Subscription` schema), limits (`SubscriptionLimit` schema), payment history (`SubscriptionPayment` schema).
    *   **Data Fetched:** Subscription (`GET /api/stores/{id}/subscription/` or `GET /api/subscriptions/`), limits (`GET /api/subscriptions/limits/`), payments (`GET /api/payments/subscription/`).
    *   **Data Posted:** Renew (`POST /api/subscriptions/{id}/renew/`), Cancel (`POST /api/subscriptions/{id}/cancel/`), potentially initiating new subscription payments (`POST /api/payments/subscription/initiate/`).
    *   **Source:** API.

### Admin Pages (Require Superuser/Admin Authentication)

This assumes a separate administration interface, potentially sharing some components but with broader scope and different API interactions (often targeting endpoints not available to regular store managers, like managing *all* users or stores).

1.  **Admin Dashboard:** Overview of platform health (total users, stores, sales, etc.).
2.  **Platform User Management:** List, view, edit roles (`is_staff`, `is_superuser`), activate/deactivate, delete *any* user (`GET/POST/PUT/PATCH/DELETE /api/users/`).
3.  **Platform Store Management:** List, view, approve (if applicable), activate/deactivate *any* store (`GET/POST/PUT/PATCH/DELETE /api/stores/`).
4.  **Platform Category Management:** Manage global categories (`GET/POST/PUT/PATCH/DELETE /api/products/categories/`).
5.  **Platform Review Moderation:** View and moderate reviews across all stores (`GET/POST /api/products/{product_pk}/reviews/{id}/approve/`, `.../reject/`, potentially dedicated admin endpoints).
6.  **System Settings:** Configure platform-wide settings (if applicable).
7.  **Platform Analytics:** View aggregated analytics for the entire platform.

*Data flow for Admin pages involves fetching and manipulating data across the entire platform scope using admin-privileged API calls.*
