module.exports = {
  openapi: "3.0.3",
  info: {
    title: "E-Commerce API",
    version: "1.0.0",
    description: "Interactive documentation for the e-commerce JSON endpoints.",
  },
  servers: [{ url: "/", description: "Current server" }],
  components: {
    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid",
        description:
          "Express session cookie. Sign in to the application first.",
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
    },
  },
  paths: {
    "/cart/add/{productId}": {
      post: {
        summary: "Add a product to the session cart",
        security: [{ sessionCookie: [] }],
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  quantity: { type: "integer", minimum: 1, default: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Product added",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    cartCount: { type: "integer" },
                  },
                },
              },
            },
          },
          400: {
            description: "Insufficient stock",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: { description: "Product not found" },
        },
      },
    },
    "/cart/update/{productId}": {
      put: {
        summary: "Update a cart item's quantity",
        security: [{ sessionCookie: [] }],
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["quantity"],
                properties: { quantity: { type: "integer", minimum: 1 } },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Cart updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string" } },
                },
              },
            },
          },
          404: { description: "Cart not found" },
        },
      },
    },
    "/cart/remove/{productId}": {
      delete: {
        summary: "Remove a product from the session cart",
        security: [{ sessionCookie: [] }],
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Item removed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string" } },
                },
              },
            },
          },
          404: { description: "Cart not found" },
        },
      },
    },
    "/orders/create": {
      post: {
        summary: "Create an order from the session cart",
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ShippingDetails" },
            },
          },
        },
        responses: {
          200: {
            description: "Order created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    orderId: { type: "integer" },
                  },
                },
              },
            },
          },
          400: {
            description: "Cart is empty",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/orders/admin/update-status/{id}": {
      post: {
        summary: "Update an order status (legacy order route)",
        security: [{ sessionCookie: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateOrderStatus" },
            },
          },
        },
        responses: {
          200: { description: "Status updated" },
          403: { description: "Admin access required" },
          404: { description: "Order not found" },
        },
      },
    },
    "/admin/orders/{id}/details": {
      get: {
        summary: "Get order details (admin)",
        security: [{ sessionCookie: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            description: "Order details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    status: { $ref: "#/components/schemas/OrderStatus" },
                    totalAmount: { type: "number" },
                    items: { type: "array", items: { type: "object" } },
                  },
                },
              },
            },
          },
          404: { description: "Order not found" },
        },
      },
    },
    "/admin/orders/{id}/update-status": {
      post: {
        summary: "Update an order status (admin)",
        security: [{ sessionCookie: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateOrderStatus" },
            },
          },
        },
        responses: {
          200: { description: "Status updated" },
          400: { description: "Invalid status" },
          404: { description: "Order not found" },
        },
      },
    },
  },
};
