import express, { type Express, type RequestHandler } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import type { IncomingMessage, ServerResponse } from "node:http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// pinoHttp's return type is not assignable to RequestHandler in all TS versions;
// cast once here so callers don't have to worry about it.
const httpLogger = pinoHttp({
  logger,
  serializers: {
    req(req: IncomingMessage) {
      const r = req as IncomingMessage & { id?: string | number };
      return {
        id: r.id,
        method: req.method,
        url: req.url?.split("?")[0],
      };
    },
    res(res: ServerResponse) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
}) as unknown as RequestHandler;

app.use(httpLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
