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
import {loginSchema,registerSchema,forgetPasswordSchema,resetPasswordSchema}  from "../validations/userValidation"

const router = Router();

// Routes
router.post("/signup",upload.single("image"),validateRequest(registerSchema), registerUser);
router.post("/login", loginUser);
router.get("/", protect, authorizeRoles("Admin","HR"), getAllUsers);
 router.post("/approve/:userId",protect, authorizeRoles("Admin","HR"), approveUser)
 router.post("/reject/:userId",protect, authorizeRoles("Admin","HR"), rejectUser);
 router.post("/forget-password",validateRequest(forgetPasswordSchema), forgetPassword);
router.post("/reset-password/:token",validateRequest(resetPasswordSchema), resetPassword);


export default router;
