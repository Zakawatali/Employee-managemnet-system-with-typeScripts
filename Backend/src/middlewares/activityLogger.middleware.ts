import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { logActivity } from "../Services/activityLogger.service";

/**
 * Options for activity logger
 */
interface ActivityLoggerOptions {
  action: string;
  module: string;
}

export const activityLogger =
  (options: ActivityLoggerOptions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", async () => {
      let userId: mongoose.Types.ObjectId | null = null;

if (req.user?._id) {
  try {
    userId = new mongoose.Types.ObjectId(req.user._id.toString());
  } catch (err) {
    console.warn("Invalid user ID for activity log:", err);
  }
}


      await logActivity({
        user: userId,
        action: options.action,
        module: options.module,
        method: req.method,
        endpoint: req.originalUrl,
        requestData: req.method !== "GET" ? req.body : null,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] as string,
        status: res.statusCode >= 400 ? "FAILED" : "SUCCESS",
      });
    });

    next();
  };
