import client from "prom-client";

export const activeRequests = new client.Gauge({
  name: 'active_requests',
  help: 'Number of active requests',
})

export const httpDurationInMicroSeconds = new client.Histogram({
  name: 'http_request_duration_micro_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'status', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 500, 1000, 5000, 10000],
})

  export function httpDurationMiddleware(req: any, res: any, next: any) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000;
    httpDurationInMicroSeconds
      .labels(req.method, req.route.path, res.statusCode, res.statusMessage)
      .observe(duration);
  });
  next();
}
