"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authmiddlewares_1 = require("../middlewares/authmiddlewares");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = (0, express_1.Router)();
// Routes
router.post("/signup", upload_1.default.single("image"), userController_1.registerUser);
router.post("/login", userController_1.loginUser);
router.get("/", authmiddlewares_1.protect, (0, authmiddlewares_1.authorizeRoles)("Admin", "HR"), userController_1.getAllUsers);
router.post("/approve/:userId", authmiddlewares_1.protect, (0, authmiddlewares_1.authorizeRoles)("Admin", "HR"), userController_1.approveUser);
router.post("/reject/:userId", authmiddlewares_1.protect, (0, authmiddlewares_1.authorizeRoles)("Admin", "HR"), userController_1.rejectUser);
router.post("/forget-password", userController_1.forgetPassword);
router.post("/reset-password/:token", userController_1.resetPassword);
exports.default = router;
