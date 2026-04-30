import { NextFunction, Response, Request } from 'express';

export function requestSizeMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.originalUrl.length > 2048) {
    res.status(414).json({ message: 'URI Too Long' });
    return;
  }
  next();
}
