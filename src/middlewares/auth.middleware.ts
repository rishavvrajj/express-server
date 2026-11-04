import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { verifyAccessToken } from "../libs/jwt";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer")) {
        next(new AppError(401, "Access token is required!"))
        return
    };

    const token = authHeader.split(" ")[1];

    if (!token) {
        next(new AppError(401, "Access token is required!"));
        return;
    }

    req.user = verifyAccessToken(token);
    next();
}