import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { demoMiddleware } from "./middleware/demo";

const app: Express = express();

const isProduction = process.env.NODE_ENV === "production";

// ─── Security headers ──────────────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  if (isProduction) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
  next();
});

// ─── CORS ──────────────────────────────────────────────────────────────────
// In production, restrict to CORS_ORIGIN env var (comma-separated list).
// In development, allow all origins for convenience.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: isProduction
      ? allowedOrigins.length > 0
        ? allowedOrigins
        : false
      : true,
    credentials: true,
  }),
);

// ─── Request logging ───────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: (req as Record<string, unknown>).id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// ─── Body parsers ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ─── Routes ────────────────────────────────────────────────────────────────
// Demo mode: if DATABASE_URL is not set, return realistic mock data for all routes.
app.use("/api", demoMiddleware);
app.use("/api", router);

export default app;
