import { Router } from "express";
import {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  downloadDocument,
  deleteDocument,
} from "../controllers/documentController";
import upload from "../middlewares/upload";
import {validateRequest } from "../middlewares/validateRequest"
import { uploadDocumentSchema} from "../validations/reportValidation"
import { protect, authorizeRoles } from "../middlewares/authmiddlewares";

const router = Router();

router.post(
  "/upload",
  upload.single("file"),
  protect,
  authorizeRoles("Admin", "HR"),
  validateRequest(uploadDocumentSchema),
  uploadDocument
);
router.get("/", protect, getAllDocuments);
router.get("/:id", protect, getDocumentById);
router.get("/download/:id", protect, downloadDocument);
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  deleteDocument
);

export default router;