# API Documentation (Generated from schema.yaml)

This document provides a detailed reference for the backend API based on the provided `schema (3).yaml` OpenAPI specification. It covers endpoints, methods, authentication, parameters, request bodies, and response formats.

## Base URL

All API endpoints described here are relative to the base path `/api`.

## Authentication

Most endpoints require authentication via JSON Web Tokens (JWT). The schema defines a security scheme named `jwtAuth`. A valid JWT must be obtained (typically via `/users/token/`) and sent in the `Authorization` header as a Bearer token:

`Authorization: Bearer <your_jwt_token>`

Endpoints marked with `Security: jwtAuth` require this token. Some GET endpoints might allow unauthenticated access (indicated by `{}` alongside `jwtAuth` or no security requirement), primarily for public data retrieval.

## Data Format

Request and response bodies primarily use `application/json`. Some endpoints may also support `application/x-www-form-urlencoded` or `multipart/form-data` for request bodies, as indicated in the schema.

## Error Handling

While not explicitly detailed for every endpoint in the schema summary, standard HTTP status codes should be expected for errors (e.g., 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error). Error responses likely include a JSON body detailing the error.

---

## Analytics Endpoints (`/analytics/*`)

Endpoints related to retrieving analytics data.

### Daily Analytics

*   **Purpose:** Provides access to daily aggregated analytics.
*   **Endpoints:**
    *   `GET /analytics/daily/`: List daily analytics records.
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `DailyAnalytics` objects.
    *   `GET /analytics/daily/{id}/`: Retrieve a specific daily analytics record by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `DailyAnalytics` object.
    *   `GET /analytics/daily/dashboard/`: Get dashboard-specific analytics data.
        *   Security: `jwtAuth`
        *   Response (200 OK): `DailyAnalytics` object.

### Analytics Events

*   **Purpose:** Manages raw analytics events.
*   **Endpoints:**
    *   `GET /analytics/events/`: List analytics events.
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `AnalyticsEvent` objects.
    *   `POST /analytics/events/`: Create a new analytics event.
        *   Security: `jwtAuth`
        *   Request Body: `AnalyticsEventCreate` (JSON, form, multipart).
        *   Response (201 Created): `AnalyticsEventCreate` object.
    *   `GET /analytics/events/{id}/`: Retrieve a specific analytics event by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Response (200 OK): `AnalyticsEvent` object.
    *   `PUT /analytics/events/{id}/`: Update an analytics event.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Request Body: `AnalyticsEvent` (JSON, form, multipart).
        *   Response (200 OK): `AnalyticsEvent` object.
    *   `PATCH /analytics/events/{id}/`: Partially update an analytics event.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Request Body: `PatchedAnalyticsEvent` (JSON, form, multipart).
        *   Response (200 OK): `AnalyticsEvent` object.
    *   `DELETE /analytics/events/{id}/`: Delete an analytics event.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Response (204 No Content).

### Product Performance Analytics

*   **Purpose:** Provides analytics related to product performance.
*   **Endpoints:**
    *   `GET /analytics/products/`: List product performance records.
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `ProductPerformance` objects.
    *   `GET /analytics/products/{id}/`: Retrieve performance for a specific product ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `ProductPerformance` object.
    *   `GET /analytics/products/top_products/`: Get top performing products.
        *   Security: `jwtAuth`
        *   Response (200 OK): `ProductPerformance` object.

---

## Order Endpoints (`/orders/*`)

Endpoints for managing orders and shopping carts.

### Orders

*   **Purpose:** Manage customer orders.
*   **Endpoints:**
    *   `GET /orders/`: List orders. Supports filtering (`search`) and ordering (`ordering`).
        *   Security: `jwtAuth`
        *   Parameters: `ordering` (query, string), `search` (query, string).
        *   Response (200 OK): Array of `Order` objects.
    *   `POST /orders/`: Create a new order.
        *   Security: `jwtAuth`
        *   Request Body: `OrderCreate` (JSON, form, multipart).
        *   Response (201 Created): `OrderCreate` object.
    *   `GET /orders/{id}/`: Retrieve a specific order by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `Order` object.
    *   `PUT /orders/{id}/`: Update an order.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Order` (JSON, form, multipart).
        *   Response (200 OK): `Order` object.
    *   `PATCH /orders/{id}/`: Partially update an order.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `PatchedOrder` (JSON, form, multipart).
        *   Response (200 OK): `Order` object.
    *   `DELETE /orders/{id}/`: Delete an order.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (204 No Content).
    *   `POST /orders/{id}/assign_staff/`: Assign a staff member to the order.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Order` (JSON, form, multipart) - *Schema likely needs refinement here, should probably take staff ID.*
        *   Response (200 OK): `Order` object.
    *   `POST /orders/{id}/update_status/`: Update the order status.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Order` (JSON, form, multipart) - *Schema likely needs refinement, should take status value.*
        *   Response (200 OK): `Order` object.

### Order Items

*   **Purpose:** Access items within a specific order.
*   **Endpoints:**
    *   `GET /orders/{order_pk}/items/`: List items for a specific order.
        *   Security: `jwtAuth`
        *   Parameters: `order_pk` (path, integer, required).
        *   Response (200 OK): Array of `OrderItem` objects.
    *   `GET /orders/{order_pk}/items/{id}/`: Retrieve a specific item within an order.
        *   Security: `jwtAuth`
        *   Parameters: `order_pk` (path, integer, required), `id` (path, integer, required).
        *   Response (200 OK): `OrderItem` object.

### Shopping Cart

*   **Purpose:** Manage the current user's shopping cart.
*   **Endpoints:**
    *   `GET /orders/cart/my_cart/`: Get the current user's cart.
        *   Security: `jwtAuth`
        *   Response (200 OK): `Cart` object.
    *   `POST /orders/cart/add_item/`: Add an item to the cart.
        *   Security: `jwtAuth`
        *   Request Body: `Cart` (JSON, form, multipart) - *Schema likely needs refinement, should take variant ID and quantity.*
        *   Response (200 OK): `Cart` object.
    *   `POST /orders/cart/remove_item/`: Remove an item from the cart.
        *   Security: `jwtAuth`
        *   Request Body: `Cart` (JSON, form, multipart) - *Schema likely needs refinement, should take cart item ID or variant ID.*
        *   Response (200 OK): `Cart` object.
    *   `POST /orders/cart/update_item/`: Update a cart item (e.g., quantity).
        *   Security: `jwtAuth`
        *   Request Body: `Cart` (JSON, form, multipart) - *Schema likely needs refinement, should take cart item ID/variant ID and new quantity.*
        *   Response (200 OK): `Cart` object.
    *   `POST /orders/cart/clear/`: Clear the entire cart.
        *   Security: `jwtAuth`
        *   Request Body: `Cart` (JSON, form, multipart) - *Schema likely needs refinement, might not need a body.*
        *   Response (200 OK): `Cart` object.

---

## Payment Endpoints (`/payments/*`)

Endpoints related to payment processing and subscriptions.

### Payments

*   **Purpose:** Manage order payments.
*   **Endpoints:**
    *   `GET /payments/`: List payments.
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `Payment` objects.
    *   `GET /payments/{id}/`: Retrieve a specific payment by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `Payment` object.
    *   `POST /payments/initiate/`: Initiate a payment (e.g., with Paymob).
        *   Security: `jwtAuth`
        *   Request Body: `Payment` (JSON, form, multipart) - *Schema likely needs refinement, should take order ID and amount.*
        *   Response (200 OK): `Payment` object (likely containing gateway details).
    *   `POST /payments/webhook/`: Handle incoming payment webhooks (e.g., from Paymob).
        *   Security: `jwtAuth` (May need adjustment depending on webhook security model).
        *   Response (200 OK): No response body specified, typically a simple success confirmation.

### Subscription Payments

*   **Purpose:** Manage payments related to store subscriptions.
*   **Endpoints:**
    *   `GET /payments/subscription/`: List subscription payments.
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `SubscriptionPayment` objects.
    *   `GET /payments/subscription/{id}/`: Retrieve a specific subscription payment.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `SubscriptionPayment` object.
    *   `POST /payments/subscription/initiate/`: Initiate a subscription payment.
        *   Security: `jwtAuth`
        *   Request Body: `SubscriptionPayment` (JSON, form, multipart) - *Schema likely needs refinement, should take subscription ID/plan.*
        *   Response (200 OK): `SubscriptionPayment` object.

---

## Product Endpoints (`/products/*`)

Endpoints for managing products, categories, variants, images, and reviews.

### Products

*   **Purpose:** Manage products, including CRUD and bulk operations.
*   **Endpoints:**
    *   `GET /products/`: List products. Supports filtering (`category`, `is_active`, `is_featured`, `is_new`, `is_on_sale`), searching (`search`), and ordering (`ordering`).
        *   Security: `jwtAuth` or Public (`{}`).
        *   Parameters: Various query parameters for filtering/searching/ordering.
        *   Response (200 OK): Array of `Product` objects.
    *   `POST /products/`: Create a new product.
        *   Security: `jwtAuth`
        *   Request Body: `ProductCreateUpdate` (JSON, form, multipart).
        *   Response (201 Created): `ProductCreateUpdate` object.
    *   `GET /products/{id}/`: Retrieve a specific product by ID.
        *   Security: `jwtAuth` or Public (`{}`).
        *   Parameters: `id` (path, integer, required).
        *   Response (200 OK): `Product` object.
    *   `PUT /products/{id}/`: Update a product.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Request Body: `ProductCreateUpdate` (JSON, form, multipart).
        *   Response (200 OK): `ProductCreateUpdate` object.
    *   `PATCH /products/{id}/`: Partially update a product.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Request Body: `PatchedProductCreateUpdate` (JSON, form, multipart).
        *   Response (200 OK): `ProductCreateUpdate` object.
    *   `DELETE /products/{id}/`: Delete a product.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Response (204 No Content).
    *   `POST /products/bulk-create/`: Bulk create products.
        *   Security: `jwtAuth`
        *   Request Body: Array of `Product` objects (JSON).
        *   Response (200 OK): Array of created `Product` objects.
    *   `PUT /products/bulk-update/`: Bulk update products.
        *   Security: `jwtAuth`
        *   Request Body: Array of `Product` objects with IDs (JSON).
        *   Response (200 OK): Array of updated `Product` objects.
    *   `DELETE /products/bulk-delete/`: Bulk delete products.
        *   Security: `jwtAuth`
        *   Request Body: List of product IDs (likely in JSON body, schema needs clarification).
        *   Response (204 No Content).

### Product Categories

*   **Purpose:** Manage product categories.
*   **Endpoints:**
    *   `GET /products/categories/`: List categories. Supports filtering (`is_active`, `parent`), searching (`search`), and ordering (`ordering`).
        *   Security: `jwtAuth` or Public (`{}`).
        *   Parameters: Various query parameters.
        *   Response (200 OK): Array of `Category` objects.
    *   `POST /products/categories/`: Create a new category.
        *   Security: `jwtAuth`
        *   Request Body: `Category` (JSON, form, multipart).
        *   Response (201 Created): `Category` object.
    *   `GET /products/categories/{id}/`: Retrieve a specific category.
        *   Security: `jwtAuth` or Public (`{}`).
        *   Parameters: `id` (path, integer, required).
        *   Response (200 OK): `Category` object.
    *   `PUT /products/categories/{id}/`: Update a category.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Request Body: `Category` (JSON, form, multipart).
        *   Response (200 OK): `Category` object.
    *   `PATCH /products/categories/{id}/`: Partially update a category.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Request Body: `PatchedCategory` (JSON, form, multipart).
        *   Response (200 OK): `Category` object.
    *   `DELETE /products/categories/{id}/`: Delete a category.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Response (204 No Content).
    *   `GET /products/categories/root/`: Get only root categories (those with no parent).
        *   Security: `jwtAuth` or Public (`{}`).
        *   Response (200 OK): Array of `Category` objects.

### Product Variants

*   **Purpose:** Manage variants (e.g., size, color) for a specific product.
*   **Endpoints:** (All relative to `/products/{product_pk}/variants/`)
    *   `GET /`: List variants for a product.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required).
        *   Response (200 OK): Array of `Variant` objects.
    *   `POST /`: Create a new variant for a product.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required).
        *   Request Body: `Variant` (JSON, form, multipart).
        *   Response (201 Created): `Variant` object.
    *   `GET /{id}/`: Retrieve a specific variant.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Response (200 OK): `Variant` object.
    *   `PUT /{id}/`: Update a variant.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Request Body: `Variant` (JSON, form, multipart).
        *   Response (200 OK): `Variant` object.
    *   `PATCH /{id}/`: Partially update a variant.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Request Body: `PatchedVariant` (JSON, form, multipart).
        *   Response (200 OK): `Variant` object.
    *   `DELETE /{id}/`: Delete a variant.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Response (204 No Content).

### Product Images

*   **Purpose:** Manage images associated with a specific product.
*   **Endpoints:** (All relative to `/products/{product_pk}/images/`)
    *   `GET /`: List images for a product.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required).
        *   Response (200 OK): Array of `ProductImage` objects.
    *   `POST /`: Add a new image to a product.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required).
        *   Request Body: `ProductImage` (JSON, form, multipart - likely requires multipart for upload).
        *   Response (201 Created): `ProductImage` object.
    *   `GET /{id}/`: Retrieve a specific product image.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Response (200 OK): `ProductImage` object.
    *   `PUT /{id}/`: Update product image details (e.g., alt text).
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Request Body: `ProductImage` (JSON, form, multipart).
        *   Response (200 OK): `ProductImage` object.
    *   `PATCH /{id}/`: Partially update product image details.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Request Body: `PatchedProductImage` (JSON, form, multipart).
        *   Response (200 OK): `ProductImage` object.
    *   `DELETE /{id}/`: Delete a product image.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Response (204 No Content).
    *   `POST /{id}/set_primary/`: Set an image as the primary image for the product.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Request Body: `ProductImage` (JSON, form, multipart) - *Schema likely needs refinement, might not need a body.*
        *   Response (200 OK): `ProductImage` object.

### Product Reviews

*   **Purpose:** Manage reviews for a specific product.
*   **Endpoints:** (All relative to `/products/{product_pk}/reviews/`)
    *   `GET /`: List reviews for a product.
        *   Security: `jwtAuth` or Public (`{}`).
        *   Parameters: `product_pk` (path, integer, required).
        *   Response (200 OK): Array of `ProductReview` objects (likely only approved ones for public view).
    *   `POST /`: Create a new review for a product.
        *   Security: `jwtAuth` (Customer role implied).
        *   Parameters: `product_pk` (path, integer, required).
        *   Request Body: `ProductReview` (JSON, form, multipart).
        *   Response (201 Created): `ProductReview` object.
    *   `GET /{id}/`: Retrieve a specific review.
        *   Security: `jwtAuth` or Public (`{}`).
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Response (200 OK): `ProductReview` object.
    *   `PUT /{id}/`: Update a review (potentially by Admin/Owner/Author).
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Request Body: `ProductReview` (JSON, form, multipart).
        *   Response (200 OK): `ProductReview` object.
    *   `PATCH /{id}/`: Partially update a review.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Request Body: `PatchedProductReview` (JSON, form, multipart).
        *   Response (200 OK): `ProductReview` object.
    *   `DELETE /{id}/`: Delete a review.
        *   Security: `jwtAuth`
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Response (204 No Content).
    *   `POST /{id}/approve/`: Approve a pending review.
        *   Security: `jwtAuth` (Admin/Owner/Manager role implied).
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Request Body: `ProductReview` (JSON, form, multipart) - *Schema likely needs refinement, might not need a body.*
        *   Response (200 OK): `ProductReview` object.
    *   `POST /{id}/reject/`: Reject a pending review.
        *   Security: `jwtAuth` (Admin/Owner/Manager role implied).
        *   Parameters: `product_pk` (path, integer, required), `id` (path, integer, required).
        *   Request Body: `ProductReview` (JSON, form, multipart) - *Schema likely needs refinement, might not need a body.*
        *   Response (200 OK): `ProductReview` object.

---

## Staff Endpoints (`/staff/*`)

Endpoints for managing staff members and their performance.

### Staff Management

*   **Purpose:** Manage staff users associated with a store.
*   **Endpoints:**
    *   `GET /staff/`: List staff members (likely scoped to the manager's store).
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `Staff` objects.
    *   `POST /staff/`: Create/invite a new staff member.
        *   Security: `jwtAuth`
        *   Request Body: `StaffCreate` (JSON, form, multipart).
        *   Response (201 Created): `StaffCreate` object.
    *   `GET /staff/{id}/`: Retrieve a specific staff member by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `Staff` object.
    *   `PUT /staff/{id}/`: Update a staff member's details (e.g., role, permissions).
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `StaffUpdate` (JSON, form, multipart).
        *   Response (200 OK): `StaffUpdate` object.
    *   `PATCH /staff/{id}/`: Partially update a staff member.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `PatchedStaffUpdate` (JSON, form, multipart).
        *   Response (200 OK): `StaffUpdate` object.
    *   `DELETE /staff/{id}/`: Remove a staff member.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (204 No Content).
    *   `POST /staff/{id}/activate/`: Activate a staff member's account.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Staff` (JSON, form, multipart) - *Schema likely needs refinement, might not need a body.*
        *   Response (200 OK): `Staff` object.
    *   `POST /staff/{id}/deactivate/`: Deactivate a staff member's account.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Staff` (JSON, form, multipart) - *Schema likely needs refinement, might not need a body.*
        *   Response (200 OK): `Staff` object.

### Staff Performance

*   **Purpose:** Track and manage staff performance records.
*   **Endpoints:**
    *   `GET /staff/performance/`: List staff performance records.
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `StaffPerformance` objects.
    *   `POST /staff/performance/`: Create a staff performance record.
        *   Security: `jwtAuth`
        *   Request Body: `StaffPerformanceCreate` (JSON, form, multipart).
        *   Response (201 Created): `StaffPerformanceCreate` object.
    *   `GET /staff/{id}/performance/`: Get performance records for a specific staff member.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `Staff` object (Schema seems incorrect here, should be `StaffPerformance` array).
    *   `GET /staff/performance/{id}/`: Retrieve a specific performance record by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `StaffPerformance` object.
    *   `PUT /staff/performance/{id}/`: Update a performance record.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `StaffPerformance` (JSON, form, multipart).
        *   Response (200 OK): `StaffPerformance` object.
    *   `PATCH /staff/performance/{id}/`: Partially update a performance record.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `PatchedStaffPerformance` (JSON, form, multipart).
        *   Response (200 OK): `StaffPerformance` object.
    *   `DELETE /staff/performance/{id}/`: Delete a performance record.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (204 No Content).

---

## Store Endpoints (`/stores/*`)

Endpoints for managing stores, locations, domains, and settings.

### Stores

*   **Purpose:** Manage store entities.
*   **Endpoints:**
    *   `GET /stores/`: List stores.
        *   Security: `jwtAuth` (Potentially public access for basic listing).
        *   Response (200 OK): Array of `Store` objects.
    *   `POST /stores/`: Create a new store.
        *   Security: `jwtAuth`
        *   Request Body: `StoreCreate` (JSON, form, multipart).
        *   Response (201 Created): `StoreCreate` object.
    *   `GET /stores/{id}/`: Retrieve a specific store by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Response (200 OK): `Store` object.
    *   `PUT /stores/{id}/`: Update a store.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Request Body: `Store` (JSON, form, multipart).
        *   Response (200 OK): `Store` object.
    *   `PATCH /stores/{id}/`: Partially update a store.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Request Body: `PatchedStore` (JSON, form, multipart).
        *   Response (200 OK): `Store` object.
    *   `DELETE /stores/{id}/`: Delete a store.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Response (204 No Content).
    *   `GET /stores/{id}/subscription/`: Get subscription details for a store.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Response (200 OK): `Store` object (Schema seems incorrect, should be `Subscription` object).
    *   `PATCH /stores/{id}/update_settings/`: Update store settings.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Request Body: `PatchedStoreSettings` (JSON, form, multipart).
        *   Response (200 OK): `StoreSettings` object.
    *   `GET /stores/nearby/`: Find nearby stores based on location (latitude/longitude likely passed as query params, schema needs detail).
        *   Security: `jwtAuth` or Public (`{}`).
        *   Response (200 OK): Array of `Store` objects (likely). Schema notes "No response body", which seems incorrect.

### Store Domains

*   **Purpose:** Manage custom domains associated with a store.
*   **Endpoints:** (All relative to `/stores/{store_pk}/domains/`)
    *   `GET /`: List domains for a store.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, string, required).
        *   Response (200 OK): Array of `Domain` objects.
    *   `POST /`: Add a new domain to a store.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, string, required).
        *   Request Body: `Domain` (JSON, form, multipart).
        *   Response (201 Created): `Domain` object.
    *   `GET /{id}/`: Retrieve a specific domain.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, string, required), `id` (path, integer, required).
        *   Response (200 OK): `Domain` object.
    *   `PUT /{id}/`: Update a domain.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, string, required), `id` (path, integer, required).
        *   Request Body: `Domain` (JSON, form, multipart).
        *   Response (200 OK): `Domain` object.
    *   `PATCH /{id}/`: Partially update a domain.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, string, required), `id` (path, integer, required).
        *   Request Body: `PatchedDomain` (JSON, form, multipart).
        *   Response (200 OK): `Domain` object.
    *   `DELETE /{id}/`: Delete a domain.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, string, required), `id` (path, integer, required).
        *   Response (204 No Content).
    *   `POST /{id}/set_primary/`: Set a domain as the primary domain for the store.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, string, required), `id` (path, integer, required).
        *   Request Body: `Domain` (JSON, form, multipart) - *Schema likely needs refinement, might not need a body.*
        *   Response (200 OK): `Domain` object.

### Store Locations

*   **Purpose:** Manage physical locations/branches associated with a store.
*   **Endpoints:** (All relative to `/stores/{store_pk}/locations/`)
    *   `GET /`: List locations for a store.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, integer, required).
        *   Response (200 OK): Array of `StoreLocation` objects.
    *   `POST /`: Add a new location to a store.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, integer, required).
        *   Request Body: `StoreLocation` (JSON, form, multipart).
        *   Response (201 Created): `StoreLocation` object.
    *   `GET /{id}/`: Retrieve a specific location.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, integer, required), `id` (path, integer, required).
        *   Response (200 OK): `StoreLocation` object.
    *   `PUT /{id}/`: Update a location.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, integer, required), `id` (path, integer, required).
        *   Request Body: `StoreLocation` (JSON, form, multipart).
        *   Response (200 OK): `StoreLocation` object.
    *   `PATCH /{id}/`: Partially update a location.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, integer, required), `id` (path, integer, required).
        *   Request Body: `PatchedStoreLocation` (JSON, form, multipart).
        *   Response (200 OK): `StoreLocation` object.
    *   `DELETE /{id}/`: Delete a location.
        *   Security: `jwtAuth`
        *   Parameters: `store_pk` (path, integer, required), `id` (path, integer, required).
        *   Response (204 No Content).

---

## Subscription Endpoints (`/subscriptions/*`)

Endpoints for managing store subscriptions and limits.

### Subscriptions

*   **Purpose:** Manage store subscription plans.
*   **Endpoints:**
    *   `GET /subscriptions/`: List subscriptions.
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `Subscription` objects.
    *   `POST /subscriptions/`: Create a new subscription.
        *   Security: `jwtAuth`
        *   Request Body: `SubscriptionCreate` (JSON, form, multipart).
        *   Response (201 Created): `SubscriptionCreate` object.
    *   `GET /subscriptions/{id}/`: Retrieve a specific subscription by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `Subscription` object.
    *   `PUT /subscriptions/{id}/`: Update a subscription.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `SubscriptionUpdate` (JSON, form, multipart).
        *   Response (200 OK): `SubscriptionUpdate` object.
    *   `PATCH /subscriptions/{id}/`: Partially update a subscription.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `PatchedSubscriptionUpdate` (JSON, form, multipart).
        *   Response (200 OK): `SubscriptionUpdate` object.
    *   `DELETE /subscriptions/{id}/`: Delete a subscription.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (204 No Content).
    *   `POST /subscriptions/{id}/cancel/`: Cancel a subscription.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Subscription` (JSON, form, multipart) - *Schema likely needs refinement, might not need a body.*
        *   Response (200 OK): `Subscription` object.
    *   `POST /subscriptions/{id}/renew/`: Renew a subscription.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Subscription` (JSON, form, multipart) - *Schema likely needs refinement, might not need a body.*
        *   Response (200 OK): `Subscription` object.

### Subscription Limits

*   **Purpose:** Manage and check limits associated with subscriptions.
*   **Endpoints:**
    *   `GET /subscriptions/limits/`: List subscription limits.
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `SubscriptionLimit` objects.
    *   `GET /subscriptions/limits/{id}/`: Retrieve a specific subscription limit by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `SubscriptionLimit` object.
    *   `GET /subscriptions/limits/{id}/check_limits/`: Check if any limits have been reached for a subscription.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `SubscriptionLimit` object (likely with status flags).

---

## User Endpoints (`/users/*`)

Endpoints for managing users, authentication, and addresses.

### User Management

*   **Purpose:** Manage user accounts.
*   **Endpoints:**
    *   `GET /users/`: List users (likely Admin access).
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `User` objects.
    *   `POST /users/`: Create a new user (likely Admin access).
        *   Security: `jwtAuth` or Public (`{}`).
        *   Request Body: `User` (JSON, form, multipart).
        *   Response (201 Created): `User` object.
    *   `GET /users/{id}/`: Retrieve a specific user by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Response (200 OK): `User` object.
    *   `PUT /users/{id}/`: Update a user.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Request Body: `User` (JSON, form, multipart).
        *   Response (200 OK): `User` object.
    *   `PATCH /users/{id}/`: Partially update a user.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Request Body: `PatchedUser` (JSON, form, multipart).
        *   Response (200 OK): `User` object.
    *   `DELETE /users/{id}/`: Delete a user.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, integer, required).
        *   Response (204 No Content).
    *   `GET /users/me/`: Get the profile of the currently authenticated user.
        *   Security: `jwtAuth`
        *   Response (200 OK): `User` object.

### Authentication & Registration

*   **Purpose:** Handle user login, registration, and token management.
*   **Endpoints:**
    *   `POST /users/register/`: Register a new user account.
        *   Security: `jwtAuth` or Public (`{}`).
        *   Request Body: `UserRegistration` (JSON, form, multipart).
        *   Response (201 Created): `UserRegistration` object (likely includes user details and possibly tokens).
    *   `POST /users/token/`: Obtain JWT tokens (login).
        *   Security: Public.
        *   Request Body: `CustomTokenObtainPair` (JSON, form, multipart) - Requires credentials (e.g., email/password).
        *   Response (200 OK): `CustomTokenObtainPair` object (contains access and refresh tokens).
    *   `POST /users/token/refresh/`: Refresh the JWT access token using a refresh token.
        *   Security: Public (but requires valid refresh token).
        *   Request Body: `TokenRefresh` (JSON, form, multipart) - Requires refresh token.
        *   Response (200 OK): `TokenRefresh` object (contains new access token).
    *   `POST /users/change_password/`: Change the authenticated user's password.
        *   Security: `jwtAuth`
        *   Request Body: `User` (JSON, form, multipart) - *Schema likely needs refinement, should take old and new passwords.*
        *   Response (200 OK): `User` object.

### User Addresses

*   **Purpose:** Manage shipping/billing addresses associated with a user.
*   **Endpoints:**
    *   `GET /users/addresses/`: List addresses for the current user.
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `Address` objects.
    *   `POST /users/addresses/`: Add a new address for the current user.
        *   Security: `jwtAuth`
        *   Request Body: `Address` (JSON, form, multipart).
        *   Response (201 Created): `Address` object.
    *   `GET /users/addresses/{id}/`: Retrieve a specific address by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `Address` object.
    *   `PUT /users/addresses/{id}/`: Update an address.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Address` (JSON, form, multipart).
        *   Response (200 OK): `Address` object.
    *   `PATCH /users/addresses/{id}/`: Partially update an address.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `PatchedAddress` (JSON, form, multipart).
        *   Response (200 OK): `Address` object.
    *   `DELETE /users/addresses/{id}/`: Delete an address.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (204 No Content).
    *   `POST /users/addresses/{id}/set_default/`: Set an address as the user's default.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Address` (JSON, form, multipart) - *Schema likely needs refinement, might not need a body.*
        *   Response (200 OK): `Address` object.

---

## Warehouse Endpoints (`/warehouses/*`)

Endpoints for managing warehouses, inventory, and stock transfers.

### Warehouses

*   **Purpose:** Manage warehouse locations associated with a store.
*   **Endpoints:**
    *   `GET /warehouses/`: List warehouses (likely scoped to the user's store).
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `Warehouse` objects.
    *   `POST /warehouses/`: Create a new warehouse.
        *   Security: `jwtAuth`
        *   Request Body: `Warehouse` (JSON, form, multipart).
        *   Response (201 Created): `Warehouse` object.
    *   `GET /warehouses/{id}/`: Retrieve a specific warehouse by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `Warehouse` object.
    *   `PUT /warehouses/{id}/`: Update a warehouse.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Warehouse` (JSON, form, multipart).
        *   Response (200 OK): `Warehouse` object.
    *   `PATCH /warehouses/{id}/`: Partially update a warehouse.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `PatchedWarehouse` (JSON, form, multipart).
        *   Response (200 OK): `Warehouse` object.
    *   `DELETE /warehouses/{id}/`: Delete a warehouse.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (204 No Content).
    *   `POST /warehouses/{id}/set_default/`: Set a warehouse as the default for the store.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Warehouse` (JSON, form, multipart) - *Schema likely needs refinement, might not need a body.*
        *   Response (200 OK): `Warehouse` object.

### Inventory Management

*   **Purpose:** Manage stock levels for product variants within warehouses.
*   **Endpoints:**
    *   `GET /warehouses/inventory/`: List inventory records.
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `Inventory` objects.
    *   `POST /warehouses/inventory/`: Create an inventory record (associating a variant with a warehouse).
        *   Security: `jwtAuth`
        *   Request Body: `Inventory` (JSON, form, multipart).
        *   Response (201 Created): `Inventory` object.
    *   `GET /warehouses/{id}/inventory/`: Get inventory for a specific warehouse.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required - Warehouse ID).
        *   Response (200 OK): `Warehouse` object (Schema seems incorrect, should be array of `Inventory` objects).
    *   `GET /warehouses/inventory/{id}/`: Retrieve a specific inventory record by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required - Inventory Record ID).
        *   Response (200 OK): `Inventory` object.
    *   `PUT /warehouses/inventory/{id}/`: Update an inventory record (e.g., restock level, location within warehouse - use adjust_stock for quantity).
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `InventoryUpdate` (JSON, form, multipart).
        *   Response (200 OK): `InventoryUpdate` object.
    *   `PATCH /warehouses/inventory/{id}/`: Partially update an inventory record.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `PatchedInventoryUpdate` (JSON, form, multipart).
        *   Response (200 OK): `InventoryUpdate` object.
    *   `DELETE /warehouses/inventory/{id}/`: Delete an inventory record.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (204 No Content).
    *   `POST /warehouses/inventory/{id}/adjust_stock/`: Adjust the stock quantity for an inventory record.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `Inventory` (JSON, form, multipart) - *Schema likely needs refinement, should take adjustment quantity and reason.*
        *   Response (200 OK): `Inventory` object.

### Stock Transfers

*   **Purpose:** Manage the transfer of stock between warehouses.
*   **Endpoints:**
    *   `GET /warehouses/transfers/`: List stock transfers.
        *   Security: `jwtAuth`
        *   Response (200 OK): Array of `StockTransfer` objects.
    *   `POST /warehouses/transfers/`: Create a new stock transfer.
        *   Security: `jwtAuth`
        *   Request Body: `StockTransferCreate` (JSON, form, multipart).
        *   Response (201 Created): `StockTransferCreate` object.
    *   `GET /warehouses/transfers/{id}/`: Retrieve a specific stock transfer by ID.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (200 OK): `StockTransfer` object.
    *   `PUT /warehouses/transfers/{id}/`: Update a stock transfer (e.g., status).
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `StockTransfer` (JSON, form, multipart).
        *   Response (200 OK): `StockTransfer` object.
    *   `PATCH /warehouses/transfers/{id}/`: Partially update a stock transfer.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Request Body: `PatchedStockTransfer` (JSON, form, multipart).
        *   Response (200 OK): `StockTransfer` object.
    *   `DELETE /warehouses/transfers/{id}/`: Delete a stock transfer.
        *   Security: `jwtAuth`
        *   Parameters: `id` (path, string, required).
        *   Response (204 No Content).

---

## Schema Endpoint (`/schema/*`)

*   **Purpose:** Provides the OpenAPI schema itself.
*   **Endpoint:**
    *   `GET /schema/`: Retrieve the OpenAPI schema for the API.
        *   Security: `jwtAuth` or Public (`{}`).
        *   Parameters: `format` (query, enum: json, yaml), `lang` (query, enum: ar, en).
        *   Response (200 OK): OpenAPI schema document (JSON or YAML).

---

*Note: Some request/response body schemas for specific actions (like `update_status`, `assign_staff`, `adjust_stock`, cart actions, etc.) appear generic in the provided schema (`schema (3).yaml`) and might require more specific definitions in a real implementation (e.g., taking only the necessary fields like `status: "shipped"` or `quantity: 5`). This documentation reflects the schema as provided.*
