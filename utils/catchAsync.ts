import { Request, Response } from "express";

export const catchAsync = fn => {
  return (req: Request, res: Response, next) => {
    // fn(req, res, next).catch(err => next(err));
    fn(req, res, next).catch(next);
  };
};
