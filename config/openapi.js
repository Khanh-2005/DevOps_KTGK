const sessionSecurity = [{ sessionCookie: [] }];

const pathId = (name = "id") => ({
  name,
  in: "path",
  required: true,
  schema: { type: "integer" },
});

const operation = (tag, summary, responses, options = {}) => ({
  tags: [tag],
  summary,
  ...(options.security ? { security: sessionSecurity } : {}),
  ...(options.parameters ? { parameters: options.parameters } : {}),
  ...(options.requestBody ? { requestBody: options.requestBody } : {}),
  responses,
});

const response = (description, content) => ({
  description,
  ...(content ? { content } : {}),
});

const json = (schema) => ({
  "application/json": { schema },
});

const body = (schema, mediaType = "application/json", required = true) => ({
  required,
  content: { [mediaType]: { schema } },
});

const messageSchema = {
  type: "object",
  properties: { message: { type: "string" } },
};

const errorResponse = response(
  "Request failed",
  json({ $ref: "#/components/schemas/Error" }),
);

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "E-Commerce API",
    version: "1.0.0",
    description:
      "Routes are grouped by the six Express router files: Admin, Auth, Cart, Orders, Profile, and User. HTML pages and redirects are labeled separately from JSON endpoints.",
  },
  servers: [{ url: "/", description: "Current server" }],
  tags: [
    {
      name: "Admin",
      description: "Routes mounted at /admin from routes/admin.js",
    },
    { name: "Auth", description: "Authentication routes from routes/auth.js" },
    {
      name: "Cart",
      description: "Routes mounted at /cart from routes/cart.js",
    },
    {
      name: "Orders",
      description: "Routes mounted at /orders from routes/orders.js",
    },
    { name: "Profile", description: "Profile routes from routes/profile.js" },
    { name: "User", description: "Storefront routes from routes/user.js" },
  ],
  components: {
    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid",
        description:
          "Sign in to the application first to establish an Express session.",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: { message: { type: "string" } },
      },
      OrderStatus: {
        type: "string",
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      },
      Login: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          password: { type: "string", format: "password", example: "user123" },
        },
      },
      Register: {
        type: "object",
        required: ["name", "email", "password", "confirmPassword"],
        properties: {
          name: { type: "string", example: "Nguyen Van A" },
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          password: { type: "string", format: "password" },
          confirmPassword: { type: "string", format: "password" },
        },
      },
      Category: {
        type: "object",
        required: ["name"],
        properties: { name: { type: "string", example: "Beverages" } },
      },
      Product: {
        type: "object",
        required: ["name", "price"],
        properties: {
          name: { type: "string", example: "Green Tea" },
          description: { type: "string" },
          price: { type: "number", example: 4.5 },
          stock: { type: "integer", example: 20 },
          categoryId: { type: "integer" },
          image: { type: "string", format: "binary" },
        },
      },
      ShippingDetails: {
        type: "object",
        required: [
          "fullName",
          "phone",
          "email",
          "address",
          "city",
          "district",
          "ward",
        ],
        properties: {
          fullName: { type: "string", example: "Nguyen Van A" },
          phone: { type: "string", example: "0901234567" },
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          address: { type: "string", example: "123 Main Street" },
          city: { type: "string", example: "Ho Chi Minh City" },
          district: { type: "string", example: "District 1" },
          ward: { type: "string", example: "Ben Nghe Ward" },
          note: { type: "string", example: "Call on arrival" },
        },
      },
      UpdateOrderStatus: {
        type: "object",
        required: ["status"],
        properties: { status: { $ref: "#/components/schemas/OrderStatus" } },
      },
      UpdateQuantity: {
        type: "object",
        required: ["quantity"],
        properties: { quantity: { type: "integer", minimum: 1 } },
      },
    },
  },
  paths: {
    "/admin": {
      get: operation(
        "Admin",
        "Admin entry; redirects to the admin login page",
        {
          302: response("Redirect to /admin/login"),
        },
      ),
    },
    "/admin/login": {
      get: operation("Admin", "Display admin login page", {
        200: response("HTML login page"),
      }),
      post: operation(
        "Admin",
        "Submit admin login credentials",
        { 302: response("Redirect to admin dashboard or login page") },
        {
          requestBody: body(
            {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string" },
                password: { type: "string", format: "password" },
              },
            },
            "application/x-www-form-urlencoded",
          ),
        },
      ),
    },
    "/admin/logout": {
      get: operation("Admin", "Log out admin", {
        302: response("Redirect to admin login page"),
      }),
    },
    "/admin/dashboard": {
      get: operation(
        "Admin",
        "Display admin dashboard",
        { 200: response("HTML dashboard") },
        { security: true },
      ),
    },
    "/admin/categories": {
      get: operation(
        "Admin",
        "List categories in admin",
        { 200: response("HTML categories page") },
        { security: true },
      ),
      post: operation(
        "Admin",
        "Create a category",
        { 302: response("Redirect to categories page") },
        {
          security: true,
          requestBody: body(
            { $ref: "#/components/schemas/Category" },
            "application/x-www-form-urlencoded",
          ),
        },
      ),
    },
    "/admin/categories/{id}": {
      put: operation(
        "Admin",
        "Update a category",
        { 302: response("Redirect to categories page") },
        {
          security: true,
          parameters: [pathId()],
          requestBody: body(
            { $ref: "#/components/schemas/Category" },
            "application/x-www-form-urlencoded",
          ),
        },
      ),
      delete: operation(
        "Admin",
        "Delete a category",
        { 200: response("Category deleted") },
        { security: true, parameters: [pathId()] },
      ),
    },
    "/admin/products": {
      get: operation(
        "Admin",
        "List products in admin",
        { 200: response("HTML products page") },
        { security: true },
      ),
      post: operation(
        "Admin",
        "Create a product, optionally with an image",
        { 302: response("Redirect to products page") },
        {
          security: true,
          requestBody: body(
            { $ref: "#/components/schemas/Product" },
            "multipart/form-data",
          ),
        },
      ),
    },
    "/admin/products/{id}": {
      put: operation(
        "Admin",
        "Update a product, optionally replacing its image",
        { 302: response("Redirect to products page") },
        {
          security: true,
          parameters: [pathId()],
          requestBody: body(
            { $ref: "#/components/schemas/Product" },
            "multipart/form-data",
          ),
        },
      ),
      delete: operation(
        "Admin",
        "Delete a product",
        { 200: response("Product deleted") },
        { security: true, parameters: [pathId()] },
      ),
    },
    "/admin/inventory": {
      get: operation(
        "Admin",
        "Display inventory",
        { 200: response("HTML inventory page") },
        { security: true },
      ),
    },
    "/admin/inventory/update-stock/{id}": {
      post: operation(
        "Admin",
        "Adjust product stock",
        { 302: response("Redirect to inventory page") },
        {
          security: true,
          parameters: [pathId()],
          requestBody: body(
            {
              type: "object",
              required: ["quantity"],
              properties: {
                quantity: {
                  type: "integer",
                  description: "Positive to add stock, negative to subtract",
                },
                notes: { type: "string" },
              },
            },
            "application/x-www-form-urlencoded",
          ),
        },
      ),
    },
    "/admin/orders": {
      get: operation(
        "Admin",
        "Display all orders for admin",
        { 200: response("HTML orders page") },
        { security: true },
      ),
    },
    "/admin/orders/{id}/details": {
      get: operation(
        "Admin",
        "Get order details as JSON",
        {
          200: response(
            "Order details",
            json({
              type: "object",
              properties: {
                id: { type: "integer" },
                status: { $ref: "#/components/schemas/OrderStatus" },
                totalAmount: { type: "number" },
                items: { type: "array", items: { type: "object" } },
              },
            }),
          ),
          404: response(
            "Order not found",
            json({ $ref: "#/components/schemas/Error" }),
          ),
        },
        { security: true, parameters: [pathId()] },
      ),
    },
    "/admin/orders/{id}/update-status": {
      post: operation(
        "Admin",
        "Update order status",
        {
          200: response(
            "Status updated",
            json({
              type: "object",
              properties: {
                message: { type: "string" },
                status: { $ref: "#/components/schemas/OrderStatus" },
              },
            }),
          ),
          400: response(
            "Invalid status",
            json({ $ref: "#/components/schemas/Error" }),
          ),
          404: response(
            "Order not found",
            json({ $ref: "#/components/schemas/Error" }),
          ),
        },
        {
          security: true,
          parameters: [pathId()],
          requestBody: body({ $ref: "#/components/schemas/UpdateOrderStatus" }),
        },
      ),
    },
    "/login": {
      get: operation("Auth", "Display login page", {
        200: response("HTML login page"),
      }),
      post: operation(
        "Auth",
        "Log in with email and password",
        { 302: response("Redirect to storefront or admin dashboard") },
        {
          requestBody: body(
            { $ref: "#/components/schemas/Login" },
            "application/x-www-form-urlencoded",
          ),
        },
      ),
    },
    "/register": {
      get: operation("Auth", "Display registration page", {
        200: response("HTML registration page"),
      }),
      post: operation(
        "Auth",
        "Register a user account",
        { 302: response("Redirect to login page") },
        {
          requestBody: body(
            { $ref: "#/components/schemas/Register" },
            "application/x-www-form-urlencoded",
          ),
        },
      ),
    },
    "/logout": {
      get: operation("Auth", "Log out the current user", {
        302: response("Redirect to login page"),
      }),
    },
    "/cart": {
      get: operation(
        "Cart",
        "Display the current session cart",
        { 200: response("HTML cart page") },
        { security: true },
      ),
    },
    "/cart/add/{productId}": {
      post: operation(
        "Cart",
        "Add a product to the session cart",
        {
          200: response(
            "Product added",
            json({
              type: "object",
              properties: {
                message: { type: "string" },
                cartCount: { type: "integer" },
              },
            }),
          ),
          400: response(
            "Insufficient stock",
            json({ $ref: "#/components/schemas/Error" }),
          ),
          404: response(
            "Product not found",
            json({ $ref: "#/components/schemas/Error" }),
          ),
        },
        {
          security: true,
          parameters: [{ ...pathId("productId") }],
          requestBody: body({
            type: "object",
            properties: {
              quantity: { type: "integer", minimum: 1, default: 1 },
            },
          }),
        },
      ),
    },
    "/cart/update/{productId}": {
      put: operation(
        "Cart",
        "Update a cart item's quantity",
        {
          200: response("Cart updated", json(messageSchema)),
          404: response(
            "Cart not found",
            json({ $ref: "#/components/schemas/Error" }),
          ),
        },
        {
          security: true,
          parameters: [pathId("productId")],
          requestBody: body({ $ref: "#/components/schemas/UpdateQuantity" }),
        },
      ),
    },
    "/cart/remove/{productId}": {
      delete: operation(
        "Cart",
        "Remove a product from the session cart",
        {
          200: response("Item removed", json(messageSchema)),
          404: response(
            "Cart not found",
            json({ $ref: "#/components/schemas/Error" }),
          ),
        },
        { security: true, parameters: [pathId("productId")] },
      ),
    },
    "/cart/checkout": {
      get: operation(
        "Cart",
        "Display checkout page",
        { 200: response("HTML checkout page") },
        { security: true },
      ),
    },
    "/orders": {
      get: operation(
        "Orders",
        "Display orders belonging to the signed-in user",
        { 200: response("HTML order history page") },
        { security: true },
      ),
    },
    "/orders/create": {
      post: operation(
        "Orders",
        "Create an order from the session cart",
        {
          200: response(
            "Order created",
            json({
              type: "object",
              properties: {
                message: { type: "string" },
                orderId: { type: "integer" },
              },
            }),
          ),
          400: response(
            "Cart is empty",
            json({ $ref: "#/components/schemas/Error" }),
          ),
        },
        {
          security: true,
          requestBody: body({ $ref: "#/components/schemas/ShippingDetails" }),
        },
      ),
    },
    "/orders/{id}": {
      get: operation(
        "Orders",
        "Display details for the signed-in user's order",
        {
          200: response("HTML order detail page"),
          404: response("Order not found"),
        },
        { security: true, parameters: [pathId()] },
      ),
    },
    "/orders/admin/list": {
      get: operation(
        "Orders",
        "Display all orders (admin only)",
        {
          200: response("HTML admin orders page"),
          403: response("Admin access required"),
        },
        { security: true },
      ),
    },
    "/orders/admin/update-status/{id}": {
      post: operation(
        "Orders",
        "Update order status (admin only)",
        {
          200: response("Status updated", json(messageSchema)),
          403: response(
            "Admin access required",
            json({ $ref: "#/components/schemas/Error" }),
          ),
          404: response(
            "Order not found",
            json({ $ref: "#/components/schemas/Error" }),
          ),
        },
        {
          security: true,
          parameters: [pathId()],
          requestBody: body({ $ref: "#/components/schemas/UpdateOrderStatus" }),
        },
      ),
    },
    "/profile": {
      get: operation(
        "Profile",
        "Display the signed-in user's profile",
        { 200: response("HTML profile page") },
        { security: true },
      ),
      post: operation(
        "Profile",
        "Update profile details and optionally change password",
        { 302: response("Redirect to profile page") },
        {
          security: true,
          requestBody: body(
            {
              type: "object",
              required: ["name", "email"],
              properties: {
                name: { type: "string" },
                email: { type: "string", format: "email" },
                phone: { type: "string" },
                address: { type: "string" },
                birthdate: { type: "string", format: "date" },
                currentPassword: { type: "string", format: "password" },
                newPassword: { type: "string", format: "password" },
                confirmPassword: { type: "string", format: "password" },
              },
            },
            "application/x-www-form-urlencoded",
          ),
        },
      ),
    },
    "/": {
      get: operation("User", "Display storefront home page", {
        200: response("HTML storefront page"),
      }),
    },
    "/products": {
      get: operation(
        "User",
        "List products with optional filters",
        { 200: response("HTML product list page") },
        {
          parameters: [
            { name: "category", in: "query", schema: { type: "integer" } },
            { name: "search", in: "query", schema: { type: "string" } },
            {
              name: "sort",
              in: "query",
              schema: { type: "string", enum: ["price_asc", "price_desc"] },
            },
          ],
        },
      ),
    },
    "/product/{id}": {
      get: operation(
        "User",
        "Display product details (singular route)",
        {
          200: response("HTML product detail page"),
          404: response("Product not found"),
        },
        { parameters: [pathId()] },
      ),
    },
    "/products/{id}": {
      get: operation(
        "User",
        "Display product details",
        {
          200: response("HTML product detail page"),
          404: response("Product not found"),
        },
        { parameters: [pathId()] },
      ),
    },
    "/category/{id}": {
      get: operation(
        "User",
        "List products in a category (singular route)",
        {
          200: response("HTML category product page"),
          404: response("Category not found"),
        },
        { parameters: [pathId()] },
      ),
    },
    "/categories/{id}": {
      get: operation(
        "User",
        "List products in a category",
        {
          200: response("HTML category product page"),
          404: response("Category not found"),
        },
        { parameters: [pathId()] },
      ),
    },
    "/categories": {
      get: operation("User", "Display all categories", {
        200: response("HTML categories page"),
      }),
    },
    "/category": {
      get: operation("User", "Display all categories (singular route)", {
        200: response("HTML categories page"),
      }),
    },
  },
};
