import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { consumeProductEvents } from "./consumers/consumer";
import { ProductMiddleware } from "./middlewares/Product.middleware";
import ProductRoute from "./routes/Product.route";
import { customMessage } from "./util/util";

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
app.use(ProductMiddleware);

// Welcome Route
app.all("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.send({ message: "Product Microservice is running" });
});

const apiVersion: string = "v1";

// Routes
app.use(`/${apiVersion}/product`, ProductRoute);

// 404 Handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(customMessage("Route not found", null));
});

// Error Handler
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  next(customMessage(err.message, null));
});

consumeProductEvents("ORDER_PLACED");

// Server Configs
const PORT: number = Number(process.env.PORT) || 6000;
app.listen(PORT, () => {
  console.log(`PRODUCT MICROSERVICE IS RUNNING ON PORT ${PORT}`);
});
