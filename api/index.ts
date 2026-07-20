/**
 * Vercel serverless entry point.
 * All /api/* requests are routed here by vercel.json.
 * The Express app already mounts routes at /api so paths resolve correctly.
 */
import app from "../artifacts/api-server/src/app";

export default app;
