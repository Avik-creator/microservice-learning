import type { NextFunction } from "express";

export const requestCounter = new Client.Counter({
  name: 'http_requests_total',
     help: 'Total number of HTTP requests',
     labelNames: ['method', 'route', 'status', 'code'],
})

export const requestCountMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000;
    requestCounter
      .labels(req.method, req.route.path, res.statusCode, res.statusMessage)
      .inc();
  });

  next();
}
