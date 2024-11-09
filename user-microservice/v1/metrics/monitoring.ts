import { NextFunction, Request, Response } from "express";
import { activeRequests } from "./activeRequests";
import { requestCounter } from "./requestCount";

export const monitoring = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
      activeRequests.inc();

      res.on('finish', function() {
          const endTime = Date.now();
          console.log(`Request took ${endTime - startTime}ms`);

          requestCounter.inc({
              method: req.method,
              route: req.route ? req.route.path : req.path,
              status_code: res.statusCode
          });
          activeRequests.dec();
      });
      next()
}
