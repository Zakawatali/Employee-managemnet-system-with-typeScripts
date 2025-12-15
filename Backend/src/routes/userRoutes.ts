import { Router } from "express";
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
import {loginSchema,registerSchema,approveUserSchema,forgetPasswordSchema,resetPasswordSchema}  from "../validations/userValidation"

const router = Router();

// Routes
router.post("/signup",validateRequest(registerSchema),upload.single("image"), registerUser);
router.post("/login", validateRequest(loginSchema),loginUser);
router.get("/", protect, authorizeRoles("Admin","HR"), getAllUsers);
 router.post("/approve/:userId",validateRequest(approveUserSchema),protect, authorizeRoles("Admin","HR"), approveUser)
 router.post("/reject/:userId",validateRequest(approveUserSchema),protect, authorizeRoles("Admin","HR"), rejectUser);
 router.post("/forget-password",validateRequest(forgetPasswordSchema), forgetPassword);
router.post("/reset-password/:token",validateRequest(resetPasswordSchema), resetPassword);


export default router;
