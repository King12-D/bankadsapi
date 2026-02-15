import { Hono } from "hono";

const swaggerRoutes = new Hono();

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Bank Ads API",
    version: "2.0.0",
    description:
      "Ad serving API with intelligent targeting engine. Features include: segment-based targeting, frequency capping, time-slot filtering, composite ad scoring, Redis caching with smart TTL, and rate limiting.",
  },
  servers: [
    {
      url: "/",
      description: "Current server",
    },
  ],
  tags: [{ name: "Health" }, { name: "Ads" }, { name: "Analytics" }],
  components: {
    securitySchemes: {
      apiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
          message: { type: "string", example: "API is healthy" },
          database: { type: "string", example: "connected" },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      ServeAdRequest: {
        type: "object",
        required: ["balance", "customerId"],
        properties: {
          balance: {
            type: "number",
            example: 120000,
            description: "Customer account balance for segment derivation",
          },
          channel: {
            type: "string",
            enum: ["ATM", "mobile", "web", "USSD"],
            default: "ATM",
            description: "Channel where the ad will be displayed",
          },
          customerId: {
            type: "string",
            example: "CUST-98765",
            description:
              "Unique customer identifier (required for frequency capping and personalization)",
          },
        },
      },
      ServeAdResponse: {
        type: "object",
        properties: {
          adId: { type: "string", example: "67c0f4d8e3db53a6d8e8b9f1" },
          title: { type: "string", example: "Premium Loan Offer" },
          imageUrl: { type: "string", example: "https://cdn.site/ad.jpg" },
          videoUrl: { type: "string", example: "https://cdn.site/ad.mp4" },
          cta: { type: "string", example: "Apply Now" },
          segment: {
            type: "string",
            enum: ["low", "mass", "affluent", "hnw"],
            example: "mass",
          },
          channel: {
            type: "string",
            enum: ["ATM", "mobile", "web", "USSD"],
            example: "ATM",
          },
          fallback: {
            type: "boolean",
            description:
              "Present and true if the targeting engine failed and a basic fallback was used",
          },
        },
      },
      CreateAdRequest: {
        type: "object",
        required: ["title", "imageUrl", "segments", "startDate", "endDate"],
        properties: {
          title: { type: "string", example: "Premium Loan Offer" },
          imageUrl: { type: "string", example: "https://cdn.site/ad.jpg" },
          videoUrl: { type: "string", example: "https://cdn.site/ad.mp4" },
          cta: { type: "string", example: "Apply Now" },
          segments: {
            type: "array",
            items: {
              type: "string",
              enum: ["low", "mass", "affluent", "hnw"],
            },
            example: ["mass", "affluent"],
          },
          channels: {
            type: "array",
            items: {
              type: "string",
              enum: ["ATM", "mobile", "web", "USSD"],
            },
            example: ["ATM", "mobile"],
          },
          timeSlots: {
            type: "array",
            items: {
              type: "string",
              enum: ["morning", "afternoon", "evening", "night"],
            },
            description:
              "Time-of-day targeting. Empty or omitted means the ad runs all day.",
            example: ["morning", "afternoon"],
          },
          startDate: {
            type: "string",
            format: "date-time",
            example: "2026-02-14T00:00:00.000Z",
          },
          endDate: {
            type: "string",
            format: "date-time",
            example: "2026-03-14T00:00:00.000Z",
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            example: "active",
          },
          priority: {
            type: "number",
            example: 10,
            description:
              "Priority weight used in composite scoring (higher = more likely to serve)",
          },
          locations: {
            type: "array",
            items: { type: "string" },
            example: ["Lagos", "Port Harcourt"],
          },
          advertiser: {
            type: "object",
            properties: {
              name: { type: "string", example: "ACME Inc." },
              contactEmail: { type: "string", example: "ads@acme.com" },
            },
          },
        },
      },
      ImpressionRequest: {
        type: "object",
        required: ["adId"],
        properties: {
          adId: { type: "string", example: "67c0f4d8e3db53a6d8e8b9f1" },
          customerId: {
            type: "string",
            example: "CUST-98765",
            description:
              "If provided, updates the customer's user profile for frequency capping",
          },
        },
      },
      ClickRequest: {
        type: "object",
        required: ["adId"],
        properties: {
          adId: { type: "string", example: "67c0f4d8e3db53a6d8e8b9f1" },
        },
      },
      MessageResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      RateLimitResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Rate limit exceeded" },
          retryAfter: { type: "number", example: 60 },
        },
      },
    },
  },
  paths: {
    "/api/v1/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Service health",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/ads/serve": {
      post: {
        tags: ["Ads"],
        summary: "Serve a targeted ad to a customer",
        description:
          "Uses the targeting engine to find the best ad for a customer based on their segment, channel, time of day, and viewing history. Rate limited to 100 requests/minute per IP.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ServeAdRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Targeted ad returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ServeAdResponse" },
              },
            },
            headers: {
              "X-RateLimit-Limit": {
                schema: { type: "integer" },
                description: "Max requests per window",
              },
              "X-RateLimit-Remaining": {
                schema: { type: "integer" },
                description: "Remaining requests in current window",
              },
            },
          },
          "400": {
            description: "Validation error (missing customerId or invalid balance)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "No ad found matching targeting criteria",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RateLimitResponse" },
              },
            },
            headers: {
              "Retry-After": {
                schema: { type: "integer" },
                description: "Seconds to wait before retrying",
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/ads/create": {
      post: {
        tags: ["Ads"],
        summary: "Create a new ad",
        description:
          "Creates an ad campaign. Supports segment, channel, time slot, and location targeting. Automatically invalidates relevant cache entries.",
        security: [{ apiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAdRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Ad created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Ad created" },
                    ads: { type: "object" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "API key missing",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "403": {
            description: "Invalid API key",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/ads/impression": {
      post: {
        tags: ["Analytics"],
        summary: "Track an ad impression",
        description:
          "Records that an ad was displayed to a customer. If customerId is provided, also updates the customer's frequency cap profile.",
        security: [{ apiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ImpressionRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Impression recorded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/ads/click": {
      post: {
        tags: ["Analytics"],
        summary: "Track an ad click",
        description:
          "Records that a customer clicked on an ad. Used to calculate CTR for the scoring engine.",
        security: [{ apiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClickRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Click recorded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};

swaggerRoutes.get("/openapi.json", (c: any) => c.json(openApiSpec));

swaggerRoutes.get("/docs", (c: any) => {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bank Ads API Docs</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/api/v1/openapi.json",
        dom_id: "#swagger-ui",
      });
    </script>
  </body>
</html>`;

  return c.html(html);
});

export default swaggerRoutes;
