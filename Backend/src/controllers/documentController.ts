// import { Request, Response } from "express";
// import path from "path";
// import fs from "fs";
// import Document from "../models/Document";
// import { AuthenticatedRequest } from "../middlewares/authmiddlewares";

// export const uploadDocument = async (
//   req: AuthenticatedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const file = req.file as Express.Multer.File | undefined;

//     if (!file) {
//       res.error("No file uploaded", {}, 400);
//       return;
//     }

//     const { employee, kind, title, uploadedBy } = req.body;

//     const newDoc = new Document({
//       employee,
//       kind,
//       title,
//       storageKey: file.path,
//       mimeType: file.mimetype,
//       originalName: file.originalname,
//       uploadedBy,
//     });

//     await newDoc.save();

//     res.success("Document uploaded successfully", { document: newDoc }, 201);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Server error";
//     res.error("Failed to upload document", { error: message }, 500);
//   }
// };

// export const getAllDocuments = async (
//   req: AuthenticatedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const filter =
//       req.user && req.user.role !== "Admin" && req.user.role !== "HR"
//         ? { employee: req.user._id }
//         : {};

//     const documents = await Document.find(filter)
//       .populate("employee uploadedBy", "firstName lastName email")
//       .sort({ createdAt: -1 });

//     res.success("Documents fetched successfully", { documents }, 200);
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Failed to fetch documents";
//     res.error("Failed to fetch documents", { error: message }, 500);
//   }
// };

// export const getDocumentById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const doc = await Document.findById(req.params.id).populate(
//       "employee uploadedBy",
//       "firstName lastName email"
//     );

//     if (!doc) {
//       res.error("Document not found", {}, 404);
//       return;
//     }

//     res.success("Document fetched successfully", { document: doc }, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Server error";
//     res.error("Server error", { error: message }, 500);
//   }
// };

// export const downloadDocument = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const doc = await Document.findById(req.params.id);
//     if (!doc) {
//       res.error("Document not found", {}, 404);
//       return;
//     }

//     const filePath = path.resolve(doc.storageKey);
//     if (!fs.existsSync(filePath)) {
//       res.error("File not found on server", {}, 404);
//       return;
//     }

//     if (doc.mimeType) {
//       res.setHeader("Content-Type", doc.mimeType);
//     }

//     const fileName = doc.originalName || `${doc.title}${path.extname(filePath)}`;
//     res.download(filePath, fileName);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Server error";
//     res.error("Failed to download document", { error: message }, 500);
//   }
// };

// export const deleteDocument = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const doc = await Document.findById(req.params.id);
//     if (!doc) {
//       res.error("Document not found", {}, 404);
//       return;
//     }

//     if (fs.existsSync(doc.storageKey)) {
//       fs.unlinkSync(doc.storageKey);
//     }

//     await doc.deleteOne();
//     res.success("Document deleted successfully", {}, 200);
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Server error";
//     res.error("Failed to delete document", { error: message }, 500);
//   }
// };




import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authmiddlewares"; // Assuming AuthenticatedRequest is imported
import * as documentService from "../Services/documentServices";

// Helper interface to properly type errors that might contain a statusCode


/**
 * Controller to handle document upload.
 */
export const uploadDocument = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      res.error = "No file uploaded";
      next(400);
      return;
    }

    const { employee, kind, title, uploadedBy } = req.body;
    
    // Delegate logic to service
    const newDoc = await documentService.uploadDocumentService({ employee, kind, title, uploadedBy }, file);

    res.result =  newDoc ;
    next(201);
  } catch (err) {
   
    const message = err.message || "Failed to upload document";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to fetch all documents with role-based access.
 */
// export const getAllDocuments = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     if (!req.user) {
//       res.error = "Authentication required";
//       next(401);
//       return;
//     }
    
//     // Delegate logic to service
//     const documents = await documentService.getAllDocumentsService(req.user);

//     res.result =  documents ;
//     next(200);
//   } catch (err) {
    
//     const message = err.message || "Failed to fetch documents";
//     const statusCode = err.statusCode || 500;
    
//     res.error = message;
//     next(statusCode);
//   }
// };
export const getAllDocuments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.error = "Authentication required";
      next(401);
      return;
    }

    // Read pagination params from query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await documentService.getAllDocumentsService(req.user, page, limit);

    res.result = result;
    next(200);
  } catch (err) {
    const message = err.message || "Failed to fetch documents";
    const statusCode = err.statusCode || 500;

    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to fetch a single document by ID.
 */
export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const doc = await documentService.getDocumentByIdService(req.params.id);

    res.result =  doc ;
    next(200);
  } catch (err) {
    
    const message = err.message || "Server error";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to handle file download. This is a special case as it uses `res.download`.
 */
export const downloadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Service handles all validation (404 for DB/FS)
    const { filePath, originalName, mimeType } = await documentService.downloadDocumentService(req.params.id);

    if (mimeType) {
      res.setHeader("Content-Type", mimeType);
    }
    
    // Use res.download to send the file
    res.download(filePath, originalName, (err) => {
        if (err) {
            // Handle errors during the download process itself (e.g., streaming failure)
            console.error("Download failure:", err);
            res.error = "Error transferring file";
            next(500);
        }
        // Success: no need to call next() or send explicit response, res.download does it.
    });
  } catch (err) {
   
    const message = err.message || "Failed to download document";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};

/**
 * Controller to handle document deletion (DB and File System).
 */
export const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await documentService.deleteDocumentService(req.params.id);

    res.result = { message: "Document deleted successfully" };
    next(200);
  } catch (err) {
    
    const message = err.message || "Failed to delete document";
    const statusCode = err.statusCode || 500;
    
    res.error = message;
    next(statusCode);
  }
};
