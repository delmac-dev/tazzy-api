import type { NextFunction, Request, Response } from "express";

export default function errorHandler(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	res.setHeader("Content-Type", "application/json");
	res.status(500).json({error:err.name, message: err.message});
}