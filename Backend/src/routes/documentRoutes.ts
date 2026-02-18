import { Router } from "express";
import { activityLogger } from "../middlewares/activityLogger.middleware";
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

// router.post(
//   "/upload",
//   upload.single("file"),
//   protect,
//   authorizeRoles("Admin", "HR"),
//   validateRequest(uploadDocumentSchema),
//   uploadDocument
// );
// router.get("/", protect, getAllDocuments);
// router.get("/:id", protect, getDocumentById);
// router.get("/download/:id", protect, downloadDocument);
// router.delete(
//   "/:id",
//   protect,
//   authorizeRoles("Admin", "HR"),
//   deleteDocument
// );

// Upload document
router.post(
  "/upload",
  upload.single("file"),
  protect,
  authorizeRoles("Admin", "HR"),
  validateRequest(uploadDocumentSchema),
  activityLogger({ action: "UPLOAD_DOCUMENT", module: "DOCUMENT" }),
  uploadDocument
);

// Get all documents
router.get(
  "/",
  protect,
  activityLogger({ action: "GET_ALL_DOCUMENTS", module: "DOCUMENT" }),
  getAllDocuments
);

// Get document by ID
router.get(
  "/:id",
  protect,
  activityLogger({ action: "GET_DOCUMENT_BY_ID", module: "DOCUMENT" }),
  getDocumentById
);

// Download document
router.get(
  "/download/:id",
  protect,
  activityLogger({ action: "DOWNLOAD_DOCUMENT", module: "DOCUMENT" }),
  downloadDocument
);

// Delete document
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "HR"),
  activityLogger({ action: "DELETE_DOCUMENT", module: "DOCUMENT" }),
  deleteDocument
);
export default router;