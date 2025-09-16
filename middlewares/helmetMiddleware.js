import helmet from "helmet";

const securityMiddleware = helmet({
  crossOriginEmbedderPolicy: true,
  crossOriginResourcePolicy: { policy: "same-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    },
  },
  referrerPolicy: { policy: "no-referrer" },
  frameGuard: { action: "deny" },
  noSniff: true,
  hidePoweredBy: true,
});

export default securityMiddleware;