import { Router } from "express";
import { activityLogger } from "../middlewares/activityLogger.middleware";
import { registerUser,
     loginUser,
      getAllUsers,
      approveUser,
      rejectUser,
    forgetPassword,
    resetPassword
 } from "../controllers/userController";
import { protect,authorizeRoles } from "../middlewares/authmiddlewares";
import upload from "../middlewares/upload";
import {validateRequest} from "../middlewares/validateRequest"
import {loginSchema,registerSchema,forgetPasswordSchema,resetPasswordSchema}  from "../validations/userValidation"

const router = Router();

// Signup with activity logger
router.post(
  "/signup",
  upload.single("image"),
  validateRequest(registerSchema),
  activityLogger({ action: "CREATE_USER", module: "USER" }),
  registerUser
);

// Login (optional to log)
router.post(
  "/login",
  activityLogger({ action: "USER_LOGIN", module: "AUTH" }),
  loginUser
);

// Get all users (Admin/HR)
router.get(
  "/",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "GET_ALL_USERS", module: "USER" }),
  getAllUsers
);

// Approve user
router.post(
  "/approve/:userId",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "APPROVE_USER", module: "USER" }),
  approveUser
);

// Reject user
router.post(
  "/reject/:userId",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "REJECT_USER", module: "USER" }),
  rejectUser
);

// Forget password
router.post(
  "/forget-password",
  validateRequest(forgetPasswordSchema),
  activityLogger({ action: "FORGOT_PASSWORD", module: "AUTH" }),
  forgetPassword
);

// Reset password
router.post(
  "/reset-password/:token",
  validateRequest(resetPasswordSchema),
  activityLogger({ action: "RESET_PASSWORD", module: "AUTH" }),
  resetPassword
);


export default router;
