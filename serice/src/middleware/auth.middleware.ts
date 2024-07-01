import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {TokenService} from "../user/token.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService:TokenService) {
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.json({ 'message': 'Unauthorized' });
    }
    const token = authorizationHeader.split(' ')[1]

    const isValid = await this.tokenService.VerifyAccessToken(token);

    if (!isValid) {
      return res.json({ 'message': 'Unauthorized' });
    }
    next();
  }
}
