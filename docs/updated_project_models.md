# Updated Core Data Models and Roles (Based on schema.yaml)

This document outlines the core data models and user roles derived from the provided `schema (3).yaml` file. It serves as the foundation for the revised API documentation, frontend data flow, and user stories.

## Authentication

The API primarily uses JWT authentication (`jwtAuth`), required for most endpoints beyond public data retrieval.

*   Token Acquisition: `POST /api/users/token/` (Login)
*   Token Refresh: `POST /api/users/token/refresh/`
*   Registration: `POST /api/users/register/`

## User Roles (Inferred from Schema)

Based on the API structure and models, the following roles are identified:

1.  **Guest (Unauthenticated):** Can access public read-only endpoints like listing products (`GET /api/products/`), categories (`GET /api/products/categories/`), stores (`GET /api/stores/`), and potentially nearby stores (`GET /api/stores/nearby/`). Cannot perform actions requiring login.
2.  **Customer (Authenticated User):** Registered users. Can manage their profile (`GET /api/users/me/`, `POST /api/users/change_password/`), manage addresses (`GET/POST/PUT/PATCH/DELETE /api/users/addresses/`), manage their cart (`GET /api/orders/cart/my_cart/`, `POST /api/orders/cart/add_item/`, `POST /api/orders/cart/remove_item/`, `POST /api/orders/cart/update_item/`, `POST /api/orders/cart/clear/`), create orders (`POST /api/orders/`), view their orders (`GET /api/orders/`, `GET /api/orders/{id}/`), submit product reviews (`POST /api/products/{product_pk}/reviews/`). Requires JWT.
3.  **Store Owner / Manager:** Users responsible for managing a store. The schema doesn't explicitly differentiate between "Owner" and "Manager", but provides extensive store management capabilities. They can manage the store entity (`POST/GET/PUT/PATCH/DELETE /api/stores/`), settings (`PATCH /api/stores/{id}/update_settings/`), domains (`GET/POST/PUT/PATCH/DELETE /api/stores/{store_pk}/domains/`), locations (`GET/POST/PUT/PATCH/DELETE /api/stores/{store_pk}/locations/`), manage staff (`GET/POST/PUT/PATCH/DELETE /api/staff/`, `POST /api/staff/{id}/activate/`, `POST /api/staff/{id}/deactivate/`), manage products (`GET/POST/PUT/PATCH/DELETE /api/products/`, bulk actions), categories (`GET/POST/PUT/PATCH/DELETE /api/products/categories/`), variants (`GET/POST/PUT/PATCH/DELETE /api/products/{product_pk}/variants/`), product images (`GET/POST/PUT/PATCH/DELETE /api/products/{product_pk}/images/`), manage orders (`GET /api/orders/`, `GET/PUT/PATCH /api/orders/{id}/`, `POST /api/orders/{id}/update_status/`, `POST /api/orders/{id}/assign_staff/`), manage warehouses (`GET/POST/PUT/PATCH/DELETE /api/warehouses/`), inventory (`GET/POST/PUT/PATCH/DELETE /api/warehouses/inventory/`, `POST /api/warehouses/inventory/{id}/adjust_stock/`), stock transfers (`GET/POST /api/warehouses/transfers/`), view analytics (`GET /api/analytics/*`), manage subscriptions (`GET/POST/PUT/PATCH/DELETE /api/subscriptions/`). Requires JWT.
4.  **Staff:** Users associated with a store, likely with permissions granted by the Owner/Manager. Can be managed via `/api/staff/` endpoints. Can be assigned to orders (`POST /api/orders/{id}/assign_staff/`). Can have performance tracked (`GET /api/staff/performance/`, `GET /api/staff/{id}/performance/`). Specific capabilities depend on granted permissions, but likely include subsets of product, order, and inventory management. Requires JWT.
5.  **Admin:** While no specific `/admin/` routes were seen in the read portions, platform-wide administrative functions (like managing *all* users, *all* stores, potentially system settings, high-level analytics, or approving/rejecting reviews platform-wide if not delegated to stores) usually necessitate an Admin role. This role would have the broadest access. Requires JWT.

## Core Data Models (Based on `components/schemas`)

This summarizes key models identified in the schema. Fields are inferred from schema properties (type, format, required, readOnly, etc.).

*   **User:** `id` (int, readOnly), `email` (string, required), `first_name` (string), `last_name` (string), `password` (string, writeOnly), `is_active` (bool), `is_staff` (bool), `is_superuser` (bool), `date_joined` (datetime, readOnly), `last_login` (datetime, readOnly), `groups` (array of int), `user_permissions` (array of int). *(Note: Role seems tied to `is_staff`, `is_superuser`, and potentially group membership rather than a single 'role' field)*.
*   **Address:** `id` (string, readOnly), `user` (int, readOnly), `street_address` (string, required), `city` (string, required), `state` (string), `postal_code` (string), `country` (string, required), `is_default` (bool).
*   **Store:** `id` (int, readOnly), `name` (string, required), `owner` (int, required - User ID), `description` (string), `logo` (string, uri format), `cover_photo` (string, uri format), `created_at` (datetime, readOnly), `updated_at` (datetime, readOnly), `is_active` (bool), `subscription` (int, readOnly - Subscription ID), `settings` (object - StoreSettings), `locations` (array of StoreLocation), `domains` (array of Domain).
*   **StoreSettings:** (Nested within Store or separate endpoint) Likely contains settings for currency, language, policies, etc.
*   **StoreLocation:** `id` (int, readOnly), `store` (int, required), `name` (string), `address` (string), `city` (string), `country` (string), `latitude` (number, format double), `longitude` (number, format double), `is_primary` (bool).
*   **Domain:** `id` (int, readOnly), `store` (int, required), `domain_name` (string, required), `is_primary` (bool), `verified_at` (datetime, nullable).
*   **Staff:** `id` (string, readOnly), `user` (int, required - User ID), `store` (int, required - Store ID), `role` (string - e.g., 'manager', 'staff'), `permissions` (array of string), `created_at` (datetime, readOnly), `is_active` (bool).
*   **StaffPerformance:** `id` (string, readOnly), `staff` (int, required), `date` (date), `metrics` (object - e.g., orders_processed, sales_value).
*   **Product:** `id` (int, readOnly), `store` (int, required), `name` (string, required), `description` (string), `category` (int, required), `sku` (string), `price` (number, format decimal), `sale_price` (number, format decimal, nullable), `is_active` (bool), `is_featured` (bool), `is_new` (bool), `is_on_sale` (bool), `stock_quantity` (int), `created_at` (datetime, readOnly), `updated_at` (datetime, readOnly), `images` (array of ProductImage), `variants` (array of Variant), `reviews` (array of ProductReview).
*   **Category:** `id` (int, readOnly), `name` (string, required), `slug` (string, readOnly), `description` (string), `parent` (int, nullable), `image` (string, uri format), `is_active` (bool).
*   **Variant:** `id` (int, readOnly), `product` (int, required), `attributes` (object - e.g., {"size": "M", "color": "Red"}), `sku` (string), `price` (number, format decimal), `stock_quantity` (int), `image` (int - ProductImage ID, nullable).
*   **ProductImage:** `id` (int, readOnly), `product` (int, required), `image` (string, uri format, required), `alt_text` (string), `is_primary` (bool).
*   **ProductReview:** `id` (int, readOnly), `product` (int, required), `user` (int, required), `rating` (int, min 1, max 5), `comment` (string), `created_at` (datetime, readOnly), `is_approved` (bool).
*   **Order:** `id` (string, readOnly), `user` (int, required), `store` (int, required), `created_at` (datetime, readOnly), `updated_at` (datetime, readOnly), `status` (string - enum like 'pending', 'processing', 'shipped', 'delivered', 'cancelled'), `total_amount` (number, format decimal), `currency` (string), `shipping_address` (object - Address structure), `billing_address` (object - Address structure), `payment_status` (string - enum like 'pending', 'paid', 'failed'), `assigned_staff` (int - Staff ID, nullable), `items` (array of OrderItem).
*   **OrderItem:** `id` (int, readOnly), `order` (string, required - Order ID), `product` (int, required), `variant` (int, nullable), `quantity` (int, required), `price` (number, format decimal).
*   **Cart:** (Structure inferred from `/api/orders/cart/*` endpoints) Likely contains `user_id`, `items` (array of {`variant_id`, `quantity`}), `total_amount`.
*   **Warehouse:** `id` (string, readOnly), `store` (int, required), `name` (string, required), `address` (string), `is_default` (bool).
*   **Inventory:** `id` (string, readOnly), `warehouse` (string, required - Warehouse ID), `variant` (int, required - Variant ID), `quantity` (int), `last_updated` (datetime, readOnly).
*   **StockTransfer:** `id` (string, readOnly), `from_warehouse` (string, required), `to_warehouse` (string, required), `variant` (int, required), `quantity` (int), `transfer_date` (datetime), `status` (string).
*   **Payment:** `id` (string, readOnly), `order` (string, required - Order ID), `amount` (number, format decimal), `currency` (string), `status` (string), `payment_method` (string), `transaction_id` (string), `created_at` (datetime, readOnly).
*   **Subscription:** `id` (string, readOnly), `store` (int, required), `plan_id` (string), `start_date` (date), `end_date` (date), `status` (string - e.g., 'active', 'cancelled', 'expired'), `auto_renew` (bool).
*   **SubscriptionPayment:** `id` (string, readOnly), `subscription` (string, required), `amount` (number, format decimal), `payment_date` (date), `status` (string).
*   **AnalyticsEvent:** `id` (int, readOnly), `event_type` (string), `user` (int, nullable), `session_id` (string), `timestamp` (datetime), `payload` (object).
*   **DailyAnalytics:** `date` (date), `store` (int), `total_sales` (number), `total_orders` (int), `new_customers` (int), `visits` (int).
*   **ProductPerformance:** `product` (int), `total_views` (int), `total_sales` (number), `conversion_rate` (number).

This updated model list will now be used to generate the revised documentation.
