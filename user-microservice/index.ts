import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import AuthRouter from "./v1/routes/Auth.route";
import UserRouter from "./v1/routes/User.route";

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
  origin: [String(process.env.FRONTEND_URL)],
};

const app: Express = express();

app.use(helmet());
app.set("trust proxy", 1);
app.use(limiter);
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Welcome to the User Microservice",
  });
});

const apiVersion = "v1";

app.use(`/api/${apiVersion}/auth`, AuthRouter);
app.use(`/api/${apiVersion}/user`, UserRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Resource not found",
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: "Internal server error",
  });
});

const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`USER MICROSERVICE IS RUNNING ON PORT ${PORT}`);
});
