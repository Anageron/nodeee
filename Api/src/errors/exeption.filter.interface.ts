import { NextFunction, Request, Response } from "express";

export interface IExeprionFilter {
    catch: (err: Error, req: Request, res: Response, next: NextFunction) => void
}