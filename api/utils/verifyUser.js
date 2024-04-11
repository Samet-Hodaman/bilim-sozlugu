import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'

export const verifyToken = (req, res, next) => {
  const token = req.headers.access_token;
  
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.log(err.name);
        return next(errorHandler(401, 'TokenExpiredError'))
      } else {
        return next(errorHandler(401, 'Unauthorized'))
      }
    }
    req.user = user
    next()
  })
}