import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import EmployeeProfile, {
  EmployeeProfileDocument,
} from "../models/EmployeeProfile";
import { Role } from "../models/User";

interface DecodedToken extends JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: EmployeeProfileDocument | null;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    const decoded = jwt.verify(token, secret) as DecodedToken;

    req.user = await EmployeeProfile.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found or not approved" });
    }

    next();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Not authorized, invalid token";
    console.error("❌ Protect middleware error:", message);
    return res.status(401).json({ message });
  }
};

export const authorizeRoles =
  (...roles: Role[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const role = req.user?.role ?? "Unknown";
      return res.status(403).json({
        message: `Role (${role}) is not allowed to access this resource`,
      });
    }
    next();
  };
