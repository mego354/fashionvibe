# User Stories (Based on schema.yaml)

This document presents user stories for the various roles interacting with the e-commerce platform, derived directly from the functionalities exposed in the `schema (3).yaml` API specification and the updated data models.

## Guest User (Unauthenticated Visitor)

Guests primarily explore the platform's offerings before deciding to register or log in.

*   **Story:** As a Guest user, I want to browse the catalog of products, filtering by category, price range, or other attributes like `is_new` or `is_on_sale`, so that I can discover items relevant to my interests.
    *   *Flow:* Interact with the Product Listing Page, triggering `GET /api/products/` with various query parameters.
*   **Story:** As a Guest user, I want to search for specific products using keywords, so that I can quickly find items I already have in mind.
    *   *Flow:* Use the search bar, triggering `GET /api/products/?search={query}`.
*   **Story:** As a Guest user, I want to view the details of a specific product, including its description, multiple images, price, available variants, and stock status, so that I can evaluate it thoroughly before considering a purchase.
    *   *Flow:* Click a product on the PLP, navigating to the Product Detail Page and triggering `GET /api/products/{id}/` (potentially including variants and images).
*   **Story:** As a Guest user, I want to read reviews submitted by previous customers for a product, so that I can use their feedback to inform my purchasing decision.
    *   *Flow:* View the reviews section on the PDP, triggering `GET /api/products/{product_pk}/reviews/`.
*   **Story:** As a Guest user, I want to explore the different stores available on the platform, view their profiles, and browse the products they specifically offer, so that I can discover unique sellers or brands.
    *   *Flow:* Navigate the store directory (`GET /api/stores/`), view a store profile (`GET /api/stores/{id}/`), and see their products (`GET /api/products/?store={id}`).
*   **Story:** As a Guest user, I want to find stores located near me, possibly by providing my location, so that I can potentially find local sellers or pickup options.
    *   *Flow:* Use a "nearby stores" feature, triggering `GET /api/stores/nearby/` (requires location input).
*   **Story:** As a Guest user, I want to understand the platform's structure by browsing product categories, potentially viewing them hierarchically, so that I can navigate the product space effectively.
    *   *Flow:* Use category navigation, triggering `GET /api/products/categories/` or `GET /api/products/categories/root/`.
*   **Story:** As a Guest user, I want to be clearly directed to log in or register when I attempt actions that require authentication, such as adding an item to a persistent cart or checking out, so that I understand the necessary steps to proceed.
    *   *Flow:* Click "Add to Cart" or "Checkout", triggering a prompt or redirect to the login/registration pages.

## Customer (Registered and Logged-in User)

Customers interact with the platform to make purchases, manage their account, and track their activity.

*   **Story:** As a Customer, I want to register for an account using my email and password, providing my name, so that I can access authenticated features and make purchases.
    *   *Flow:* Use the registration form, triggering `POST /api/users/register/`.
*   **Story:** As a Customer, I want to securely log in to my account using my email and password, so that I can access my personalized information and functionalities.
    *   *Flow:* Use the login form, triggering `POST /api/users/token/` to obtain JWT tokens.
*   **Story:** As a Customer, I want to view and manage my shopping cart, adding products/variants, updating quantities, or removing items, so that I can curate my order before purchasing.
    *   *Flow:* Interact with the cart UI, triggering `GET /api/orders/cart/my_cart/`, `POST /api/orders/cart/add_item/`, `POST /api/orders/cart/update_item/`, `POST /api/orders/cart/remove_item/`.
*   **Story:** As a Customer, I want to clear all items from my shopping cart easily, so that I can start building a new order from scratch.
    *   *Flow:* Click a "Clear Cart" button, triggering `POST /api/orders/cart/clear/`.
*   **Story:** As a Customer, I want to proceed through a multi-step checkout process, providing or selecting my shipping and billing addresses, choosing a shipping method, and completing payment via an integrated gateway, so that I can finalize my purchase.
    *   *Flow:* Navigate from cart, select/enter addresses (using `/api/users/addresses/`), choose shipping, interact with payment gateway (potentially involving `POST /api/payments/initiate/`), and finally create the order (`POST /api/orders/`).
*   **Story:** As a Customer, I want to view my complete order history, with the ability to filter or search, so that I can track my past purchases and their statuses.
    *   *Flow:* Access the "My Orders" section, triggering `GET /api/orders/` (with potential query parameters).
*   **Story:** As a Customer, I want to view the detailed information for a specific order, including the items purchased, quantities, prices, addresses used, payment status, shipping status, and assigned staff (if any), so that I have a complete record of the transaction.
    *   *Flow:* Click on an order in the history, triggering `GET /api/orders/{id}/` and potentially `GET /api/orders/{order_pk}/items/`.
*   **Story:** As a Customer, I want to manage my saved addresses, adding new ones, editing existing ones, deleting unused ones, and setting a default address, so that I can expedite the checkout process for future orders.
    *   *Flow:* Use the address management page, triggering `GET/POST/PUT/PATCH/DELETE /api/users/addresses/{id}/` and `POST /api/users/addresses/{id}/set_default/`.
*   **Story:** As a Customer, I want to update my profile information, such as my name, and change my password securely, so that my account details remain accurate and secure.
    *   *Flow:* Use the profile settings page, triggering `GET /api/users/me/`, `PATCH /api/users/{id}/`, and `POST /api/users/change_password/`.
*   **Story:** As a Customer, I want to submit a rating and a textual review for a product I have purchased, so that I can share my experience and feedback with the seller and other potential buyers.
    *   *Flow:* Access the review submission form (e.g., from order history or product page), triggering `POST /api/products/{product_pk}/reviews/`.

## Store Owner / Manager (Manages a Store)

This role encompasses users who operate a store on the platform, managing all aspects from products and orders to staff and settings. The term "Manager" implies significant control, potentially equivalent to an Owner or a highly privileged staff member.

*   **Story:** As a Store Owner/Manager, I want to register and set up my store, providing essential details like name, description, logo, and potentially linking my user account as the owner, so that I can establish my presence on the platform.
    *   *Flow:* Use the store creation process, triggering `POST /api/stores/`.
*   **Story:** As a Store Owner/Manager, I want to access a comprehensive dashboard that summarizes key store performance indicators like daily sales, order volume, visits, and product performance, so that I can quickly assess the state of my business.
    *   *Flow:* Access the store dashboard, triggering calls to various `/api/analytics/*` endpoints (e.g., `GET /api/analytics/daily/dashboard/`, `GET /api/analytics/products/top_products/`).
*   **Story:** As a Store Owner/Manager, I want to add new products to my store, defining their name, description, category, price, SKU, initial stock, images, and variants (with attributes, price, SKU, stock), so that I can expand my offerings.
    *   *Flow:* Use the "Add Product" form, triggering `POST /api/products/`, potentially followed by calls to add variants (`POST /api/products/{product_pk}/variants/`) and images (`POST /api/products/{product_pk}/images/`).
*   **Story:** As a Store Owner/Manager, I want to efficiently manage my product catalog by editing existing product details, updating variant information (price, stock), managing images (uploading, deleting, setting primary), and activating/deactivating products, so that my listings are always accurate.
    *   *Flow:* Use the product list and edit pages, triggering `PUT/PATCH /api/products/{id}/`, `PUT/PATCH /api/products/{product_pk}/variants/{id}/`, `PUT/PATCH/DELETE /api/products/{product_pk}/images/{id}/`, `POST /api/products/{product_pk}/images/{id}/set_primary/`.
*   **Story:** As a Store Owner/Manager, I want to perform bulk operations on products, such as creating multiple products at once, updating several products simultaneously, or deleting multiple products, so that I can manage large catalogs efficiently.
    *   *Flow:* Use bulk action features in the product management UI, triggering `POST /api/products/bulk-create/`, `PUT /api/products/bulk-update/`, `DELETE /api/products/bulk-delete/`.
*   **Story:** As a Store Owner/Manager, I want to manage the product categories used within my store or the platform (depending on scope), including creating, editing, and deleting categories, so that my products are well-organized.
    *   *Flow:* Use the category management interface, triggering `GET/POST/PUT/PATCH/DELETE /api/products/categories/{id}/`.
*   **Story:** As a Store Owner/Manager, I want to view and manage all orders received by my store, filtering by status or searching for specific orders, so that I can track fulfillment progress.
    *   *Flow:* Use the order management page, triggering `GET /api/orders/` (scoped to the store).
*   **Story:** As a Store Owner/Manager, I want to update the status of an order (e.g., processing, shipped, delivered, cancelled) and add tracking information when applicable, so that the customer and the system are informed of the order's progress.
    *   *Flow:* Interact with an order's details, triggering `POST /api/orders/{id}/update_status/`.
*   **Story:** As a Store Owner/Manager, I want to assign specific staff members to handle particular orders, so that I can delegate fulfillment tasks effectively.
    *   *Flow:* Use the order detail interface to select and assign staff, triggering `POST /api/orders/{id}/assign_staff/`.
*   **Story:** As a Store Owner/Manager, I want to manage my store's staff members, inviting new staff (specifying role/permissions), viewing existing staff, updating their permissions or role, activating/deactivating their access, and removing them if necessary, so that I can control who manages my store and what they can do.
    *   *Flow:* Use the staff management section, triggering `GET/POST /api/staff/`, `PUT/PATCH /api/staff/{id}/`, `DELETE /api/staff/{id}/`, `POST /api/staff/{id}/activate/`, `POST /api/staff/{id}/deactivate/`.
*   **Story:** As a Store Owner/Manager, I want to manage multiple physical store locations or pickup points, including adding, editing, and deleting them, so that I can represent my physical presence accurately.
    *   *Flow:* Use the location management interface within store settings, triggering `GET/POST/PUT/PATCH/DELETE /api/stores/{store_pk}/locations/{id}/`.
*   **Story:** As a Store Owner/Manager, I want to manage custom domains associated with my store, adding new domains, verifying them, setting a primary domain, and removing domains, so that I can brand my storefront.
    *   *Flow:* Use the domain management interface within store settings, triggering `GET/POST/PUT/PATCH/DELETE /api/stores/{store_pk}/domains/{id}/` and `POST /api/stores/{store_pk}/domains/{id}/set_primary/`.
*   **Story:** As a Store Owner/Manager, I want to configure various settings for my store, such as currency, policies, or other operational parameters, so that the store functions according to my requirements.
    *   *Flow:* Use the store settings page, triggering `PATCH /api/stores/{id}/update_settings/`.
*   **Story:** As a Store Owner/Manager, I want to manage warehouses associated with my store, adding, editing, deleting them, and setting a default warehouse, so that my inventory management is properly structured.
    *   *Flow:* Use the warehouse management interface, triggering `GET/POST/PUT/PATCH/DELETE /api/warehouses/{id}/` and `POST /api/warehouses/{id}/set_default/`.
*   **Story:** As a Store Owner/Manager, I want to manage inventory levels for my product variants across different warehouses, including viewing current stock, adjusting quantities (e.g., for stock takes or receiving goods), and potentially setting up initial stock records, so that stock accuracy is maintained.
    *   *Flow:* Use the inventory management interface, triggering `GET /api/warehouses/inventory/`, `GET /api/warehouses/{id}/inventory/`, `POST /api/warehouses/inventory/`, `PUT/PATCH /api/warehouses/inventory/{id}/`, `POST /api/warehouses/inventory/{id}/adjust_stock/`.
*   **Story:** As a Store Owner/Manager, I want to manage and track the transfer of stock between my warehouses, initiating new transfers and viewing their status, so that I can move inventory efficiently.
    *   *Flow:* Use the stock transfer interface, triggering `GET/POST /api/warehouses/transfers/` and `GET/PUT/PATCH/DELETE /api/warehouses/transfers/{id}/`.
*   **Story:** As a Store Owner/Manager, I want to view and manage customer reviews submitted for my products, including approving or rejecting pending reviews, so that I can moderate feedback and maintain quality standards.
    *   *Flow:* Access the review moderation section, triggering `GET /api/products/{product_pk}/reviews/` (filtered for pending/all) and `POST /api/products/{product_pk}/reviews/{id}/approve/` or `.../reject/`.
*   **Story:** As a Store Owner/Manager, I want to manage my store's subscription plan, viewing its status and limits, and potentially renewing or canceling it, so that my store remains active and within usage tiers.
    *   *Flow:* Use the subscription management page, triggering `GET /api/subscriptions/{id}/`, `GET /api/subscriptions/limits/{id}/`, `POST /api/subscriptions/{id}/cancel/`, `POST /api/subscriptions/{id}/renew/`.
*   **Story:** As a Store Owner/Manager, I want to view detailed analytics about my store's performance, including daily summaries, product performance metrics, and potentially staff performance reports, so that I can make data-driven decisions.
    *   *Flow:* Access various analytics pages, triggering `GET /api/analytics/*` endpoints and potentially `GET /api/staff/performance/`.

## Staff (Assists Store Owner/Manager)

Staff members perform tasks delegated by the Store Owner/Manager, with their capabilities restricted by assigned roles and permissions.

*   **Story:** As a Staff member, I want to log in to the platform and access the management dashboard for the store I am assigned to, so that I can perform my duties.
    *   *Flow:* Login (`POST /api/users/token/`), navigate to the store management section (UI adapts based on permissions associated with `GET /api/staff/{id}/`).
*   **Story:** As a Staff member (with `manage_products` permission), I want to add, edit, or manage products, variants, and images in the store's catalog, so that I can assist in keeping the product listings up-to-date.
    *   *Flow:* Interact with product management UI, triggering relevant `/api/products/*` endpoints allowed by permissions.
*   **Story:** As a Staff member (with `process_orders` permission), I want to view store orders, update their status (e.g., mark as shipped), and add tracking information, so that I can help with order fulfillment.
    *   *Flow:* Interact with order management UI, triggering relevant `/api/orders/*` endpoints (e.g., `GET /api/orders/`, `POST /api/orders/{id}/update_status/`).
*   **Story:** As a Staff member (with `manage_inventory` permission), I want to view inventory levels and adjust stock quantities in assigned warehouses, so that I can help maintain accurate stock records.
    *   *Flow:* Interact with inventory management UI, triggering relevant `/api/warehouses/inventory/*` endpoints.
*   **Story:** As a Staff member, I want to view my assigned role and specific permissions within the store, so that I understand the scope of my responsibilities.
    *   *Flow:* View profile or dashboard section displaying data from `GET /api/staff/{id}/`.
*   **Story:** As a Staff member, I want to view performance metrics related to my work (if tracked), so that I can understand my contribution.
    *   *Flow:* Access performance reports, potentially triggering `GET /api/staff/{id}/performance/`.

## Admin (Platform Administrator)

Admins oversee the entire platform, managing core settings, users, and stores, ensuring smooth operation.

*   **Story:** As an Admin, I want to log in to a dedicated administration panel with superuser privileges, so that I can manage the entire platform.
    *   *Flow:* Login (`POST /api/users/token/` with admin credentials), access admin-specific UI.
*   **Story:** As an Admin, I want to manage all user accounts on the platform, including viewing profiles, changing roles (staff, superuser status), activating/deactivating accounts, and deleting users, so that I can maintain the user base.
    *   *Flow:* Use the platform user management interface, triggering `GET/PUT/PATCH/DELETE /api/users/{id}/` across all users.
*   **Story:** As an Admin, I want to manage all stores on the platform, viewing their details, owner information, subscription status, and activating/deactivating stores, so that I can oversee sellers and ensure compliance.
    *   *Flow:* Use the platform store management interface, triggering `GET/PUT/PATCH/DELETE /api/stores/{id}/` across all stores.
*   **Story:** As an Admin, I want to manage the global product category structure for the entire platform, so that product organization is consistent.
    *   *Flow:* Use the platform category management interface, triggering `GET/POST/PUT/PATCH/DELETE /api/products/categories/{id}/`.
*   **Story:** As an Admin, I want to oversee and potentially moderate content across the platform, such as handling escalated review disputes or managing platform-wide content policies, so that platform standards are upheld.
    *   *Flow:* Use moderation tools, potentially involving review endpoints or dedicated admin moderation endpoints.
*   **Story:** As an Admin, I want to manage platform-level subscription plans and potentially oversee store subscriptions, so that the platform's business model is managed.
    *   *Flow:* Use subscription plan management tools, potentially interacting with `/api/subscriptions/*` endpoints with elevated privileges.
*   **Story:** As an Admin, I want to view comprehensive platform-wide analytics, covering user growth, overall sales volume, store performance summaries, and system health, so that I have a high-level overview of the platform's status.
    *   *Flow:* Access admin analytics dashboards, triggering aggregated data fetches (likely requires dedicated admin analytics endpoints beyond those in the schema snippet).
*   **Story:** As an Admin, I want to access the API schema definition easily, so that I can reference it for integration or development purposes.
    *   *Flow:* Trigger `GET /api/schema/`.

---

*These user stories are based on the provided schema and aim to cover the core functionalities for each identified role. Specific implementation details might lead to further refinement.*
