```mermaid
erDiagram
    USER {
        int id PK "User ID (PK)"
        string email UK "Email (Unique)"
        string first_name
        string last_name
        string password "(Write Only)"
        bool is_active
        bool is_staff "(Indicates Staff/Manager/Owner potential)"
        bool is_superuser "(Indicates Admin)"
        datetime date_joined "(Read Only)"
        datetime last_login "(Read Only)"
    }

    ADDRESS {
        string id PK "Address ID (PK)"
        int user_id FK "User ID (FK)"
        string street_address
        string city
        string state
        string postal_code
        string country
        bool is_default
    }

    STORE {
        int id PK "Store ID (PK)"
        int owner_id FK "Owner User ID (FK)"
        string name
        string description
        string logo_url
        string cover_photo_url
        bool is_active
        string subscription_id FK "Subscription ID (FK)"
        datetime created_at "(Read Only)"
        datetime updated_at "(Read Only)"
        json settings "(Store Settings)"
    }

    STORE_LOCATION {
        int id PK "Location ID (PK)"
        int store_id FK "Store ID (FK)"
        string name
        string address
        string city
        string country
        float latitude
        float longitude
        bool is_primary
    }

    DOMAIN {
        int id PK "Domain ID (PK)"
        int store_id FK "Store ID (FK)"
        string domain_name UK "Domain Name (Unique)"
        bool is_primary
        datetime verified_at
    }

    STAFF {
        string id PK "Staff ID (PK)"
        int user_id FK "User ID (FK)"
        int store_id FK "Store ID (FK)"
        string role "(e.g., manager, staff)"
        json permissions "(Array of strings)"
        bool is_active
        datetime created_at "(Read Only)"
    }

    STAFF_PERFORMANCE {
        string id PK "Performance Record ID (PK)"
        string staff_id FK "Staff ID (FK)"
        date date
        json metrics
    }

    PRODUCT {
        int id PK "Product ID (PK)"
        int store_id FK "Store ID (FK)"
        int category_id FK "Category ID (FK)"
        string name
        string description
        string sku
        decimal price
        decimal sale_price
        bool is_active
        bool is_featured
        bool is_new
        bool is_on_sale
        int stock_quantity "(Overall, may be derived)"
        datetime created_at "(Read Only)"
        datetime updated_at "(Read Only)"
    }

    CATEGORY {
        int id PK "Category ID (PK)"
        int parent_id FK "Parent Category ID (FK, nullable)"
        string name
        string slug "(Read Only)"
        string description
        string image_url
        bool is_active
    }

    VARIANT {
        int id PK "Variant ID (PK)"
        int product_id FK "Product ID (FK)"
        int image_id FK "Primary Image ID (FK, nullable)"
        json attributes "(e.g., size, color)"
        string sku
        decimal price
        int stock_quantity "(Actual stock managed via Inventory)"
    }

    PRODUCT_IMAGE {
        int id PK "Image ID (PK)"
        int product_id FK "Product ID (FK)"
        string image_url
        string alt_text
        bool is_primary
    }

    PRODUCT_REVIEW {
        int id PK "Review ID (PK)"
        int product_id FK "Product ID (FK)"
        int user_id FK "User ID (FK)"
        int rating "(1-5)"
        string comment
        bool is_approved
        datetime created_at "(Read Only)"
    }

    ORDER {
        string id PK "Order ID (PK)"
        int user_id FK "User ID (FK)"
        int store_id FK "Store ID (FK)"
        string status
        decimal total_amount
        string currency
        json shipping_address "(Address structure)"
        json billing_address "(Address structure)"
        string payment_status
        string assigned_staff_id FK "Staff ID (FK, nullable)"
        datetime created_at "(Read Only)"
        datetime updated_at "(Read Only)"
    }

    ORDER_ITEM {
        int id PK "Order Item ID (PK)"
        string order_id FK "Order ID (FK)"
        int product_id FK "Product ID (FK)"
        int variant_id FK "Variant ID (FK, nullable)"
        int quantity
        decimal price
    }

    WAREHOUSE {
        string id PK "Warehouse ID (PK)"
        int store_id FK "Store ID (FK)"
        string name
        string address
        bool is_default
    }

    INVENTORY {
        string id PK "Inventory Record ID (PK)"
        string warehouse_id FK "Warehouse ID (FK)"
        int variant_id FK "Variant ID (FK)"
        int quantity
        datetime last_updated "(Read Only)"
    }

    STOCK_TRANSFER {
        string id PK "Transfer ID (PK)"
        string from_warehouse_id FK "Source Warehouse ID (FK)"
        string to_warehouse_id FK "Destination Warehouse ID (FK)"
        int variant_id FK "Variant ID (FK)"
        int quantity
        datetime transfer_date
        string status
    }

    PAYMENT {
        string id PK "Payment ID (PK)"
        string order_id FK "Order ID (FK)"
        decimal amount
        string currency
        string status
        string payment_method
        string transaction_id
        datetime created_at "(Read Only)"
    }

    SUBSCRIPTION {
        string id PK "Subscription ID (PK)"
        int store_id FK "Store ID (FK)"
        string plan_id
        date start_date
        date end_date
        string status
        bool auto_renew
    }

    SUBSCRIPTION_PAYMENT {
        string id PK "Subscription Payment ID (PK)"
        string subscription_id FK "Subscription ID (FK)"
        decimal amount
        date payment_date
        string status
    }

    SUBSCRIPTION_LIMIT {
        string id PK "Limit ID (PK)"
        string subscription_id FK "Subscription ID (FK)"
        string limit_type "(e.g., products, staff)"
        int limit_value
        int current_usage
    }

    ANALYTICS_EVENT {
        int id PK "Event ID (PK)"
        int user_id FK "User ID (FK, nullable)"
        string event_type
        string session_id
        datetime timestamp
        json payload
    }

    DAILY_ANALYTICS {
        date date PK "Date (PK)"
        int store_id FK "Store ID (FK, part of PK)"
        decimal total_sales
        int total_orders
        int new_customers
        int visits
    }

    PRODUCT_PERFORMANCE {
        int product_id FK "Product ID (FK, part of PK)"
        date date PK "Date (PK)"
        int total_views
        decimal total_sales
        float conversion_rate
    }

    -- Relationships
    USER ||--o{ ADDRESS : "has"
    USER ||--o{ PRODUCT_REVIEW : "writes"
    USER ||--o{ ORDER : "places"
    USER ||--o{ STAFF : "can be"
    USER ||--o{ STORE : "owns"
    USER ||--o{ ANALYTICS_EVENT : "triggers (optional)"

    STORE ||--o{ STAFF : "employs"
    STORE ||--o{ PRODUCT : "sells"
    STORE ||--o{ ORDER : "receives"
    STORE ||--o{ WAREHOUSE : "has"
    STORE ||--o{ STORE_LOCATION : "has physical"
    STORE ||--o{ DOMAIN : "has"
    STORE ||--o{ SUBSCRIPTION : "has"
    STORE ||--o{ DAILY_ANALYTICS : "has daily"

    STAFF ||--o{ STAFF_PERFORMANCE : "has"
    STAFF ||--o{ ORDER : "assigned to (optional)"

    CATEGORY ||--o{ PRODUCT : "contains"
    CATEGORY }o--|| CATEGORY : "can be child of (optional)"

    PRODUCT ||--o{ VARIANT : "has"
    PRODUCT ||--o{ PRODUCT_IMAGE : "has"
    PRODUCT ||--o{ PRODUCT_REVIEW : "receives"
    PRODUCT ||--o{ ORDER_ITEM : "appears in"
    PRODUCT ||--o{ PRODUCT_PERFORMANCE : "has performance for"

    VARIANT ||--o{ INVENTORY : "stock kept in"
    VARIANT ||--o{ ORDER_ITEM : "specified in (optional)"
    VARIANT ||--o{ STOCK_TRANSFER : "is transferred"
    VARIANT }o--|| PRODUCT_IMAGE : "can have primary (optional)"

    ORDER ||--o{ ORDER_ITEM : "contains"
    ORDER ||--o{ PAYMENT : "has"

    WAREHOUSE ||--o{ INVENTORY : "holds"
    WAREHOUSE ||--o{ STOCK_TRANSFER : "transfers from"
    WAREHOUSE ||--o{ STOCK_TRANSFER : "transfers to"

    SUBSCRIPTION ||--o{ SUBSCRIPTION_PAYMENT : "has"
    SUBSCRIPTION ||--o{ SUBSCRIPTION_LIMIT : "has"

```

**Notes on EER Concepts:**

*   **Specialization/Generalization (User Roles):** Mermaid ER diagrams don't have a standard, widely supported syntax for explicitly showing specialization hierarchies (like User -> Customer, Staff, Admin). This relationship is implied through attributes like `is_staff`, `is_superuser`, and the existence of the `STAFF` entity linked back to `USER`.
*   **Attributes:** Only key attributes (PKs, FKs, important fields) are included for clarity. Refer to `updated_project_models.md` for the full attribute list of each entity.
*   **Cardinality:** The notation `||--o{` represents a one-to-many relationship (one User has zero or more Addresses). `}o--||` represents many-to-one (many Products belong to one Category). Optional relationships are implied where FKs are nullable or the "many" side can be zero.

This Mermaid code can be rendered by tools or libraries that support it (like the Mermaid Live Editor, GitLab, Obsidian with plugins, etc.) to visualize the ERD.
