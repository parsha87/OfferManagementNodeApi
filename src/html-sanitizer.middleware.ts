import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { IResponseDto } from './interfaces';

@Injectable()
export class HtmlSanitizerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    for (const key in body) {
      if (typeof body[key] === 'string' && /<[a-z][\s\S]*>/i.test(body[key])) {
        // If HTML element found in request body, send a 400 Bad Request response
        // return res.status(HttpStatus.BAD_REQUEST).send('HTML elements are not allowed in the request body');
        const respDto: IResponseDto = {
            isSuccess: false,
            status: 'Bad Request',
            message: 'Html elements are not allowed in the request body',           
          };
          return res.status(HttpStatus.BAD_REQUEST).json(respDto);
      }
    }
    // No HTML element found, continue to the next middleware
    next();
  }
}