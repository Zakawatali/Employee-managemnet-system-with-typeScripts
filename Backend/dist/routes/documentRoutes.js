"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentController_1 = require("../controllers/documentController");
const upload_1 = __importDefault(require("../middlewares/upload"));
const authmiddlewares_1 = require("../middlewares/authmiddlewares");
const router = (0, express_1.Router)();
router.post("/upload", upload_1.default.single("file"), authmiddlewares_1.protect, (0, authmiddlewares_1.authorizeRoles)("Admin", "HR"), documentController_1.uploadDocument);
router.get("/", authmiddlewares_1.protect, documentController_1.getAllDocuments);
router.get("/:id", authmiddlewares_1.protect, documentController_1.getDocumentById);
router.get("/download/:id", authmiddlewares_1.protect, documentController_1.downloadDocument);
router.delete("/:id", authmiddlewares_1.protect, (0, authmiddlewares_1.authorizeRoles)("Admin", "HR"), documentController_1.deleteDocument);
exports.default = router;
