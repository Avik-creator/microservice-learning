import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import OrderRoute from "./v1/routes/Order.route";
import { customResponse } from "./util/CustomResponse.util";
import { orderConsumerEvent } from "./v1/consumer/consumer";

// RateLimitter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

const corsOption = {
  origin: String(process.env.FRONTEND_URL) || "*",
};

const app: Express = express();

// Middlewares
app.use(helmet());
app.set("trust proxy", 1);
app.use(limiter);
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.send({ message: "OrderMicroservice is Running" });
});

const apiVersion: string = "v1";

// Routes
app.use(`/${apiVersion}/orders`, OrderRoute);

// 404 Handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  //   next(createError.NotFound());
  next(customResponse("Not Found", "The requested resource could not be found", 404));
});

// Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

orderConsumerEvent("USER_REGISTERED"); // Reason -> may need to be aware of new users or updated user information for several reasons like sending emails, etc.
orderConsumerEvent("USER_PROFILE_UPDATED"); // Reason -> may need to be aware of new users or updated user information for several reasons like sending emails, etc.

// Server Configs
const PORT: number = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`ORDER MICROSERVICE IS RUNNING ON ${PORT}`);
});
