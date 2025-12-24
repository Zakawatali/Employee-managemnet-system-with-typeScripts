import * as documentRepository from "../repositories/documentRepositories";
import { DocumentDocument } from "../models/Document"; // Assuming DocumentDocument type exists
import { AuthenticatedRequest } from "../middlewares/authmiddlewares"; // Assuming this type is available
import { Express } from "express"; // Import for Multer File type



/**
 * Service to handle document upload logic and persistence.
 */
export const uploadDocumentService = async (
  docData: any,
  file: Express.Multer.File
): Promise<DocumentDocument> => {
  // 1. Prepare persistence data
  const newDocData = {
    ...docData,
    storageKey: file.path,
    mimeType: file.mimetype,
    originalName: file.originalname,
  };

  // 2. Persistence via Repository
  const newDoc = await documentRepository.createDocument(newDocData);
  return newDoc;
};

/**
 * Service to handle fetching documents with role-based filtering.
 */
// export const getAllDocumentsService = async (
//   user: AuthenticatedRequest['user']
// ): Promise<DocumentDocument[]> => {
//   // Business Logic: Only Admin/HR can see all documents; Employees only see their own.
//   const filter =
//     user?.role !== "Admin" && user?.role !== "HR"
//       ? { employee: user?._id }
//       : {};

//   // Persistence via Repository
//   const documents = await documentRepository.findDocuments(filter);
  
//   // Note: We don't throw 404 if array is empty, as it's a valid result (no documents found).
//   return documents;
// };
// export const getAllDocumentsService = async (
//   user: AuthenticatedRequest['user'],
//   page: number = 1,
//   limit: number = 10
// ): Promise<{ documents: DocumentDocument[]; total: number; totalPages: number; page: number }> => {
//   const filter =
//     user?.role !== "Admin" && user?.role !== "HR"
//       ? { employee: user?._id }
//       : {};

//   const result = await documentRepository.findDocuments(filter, page, limit);

//   return result;
// };
export const getAllDocumentsService = async (
  user: AuthenticatedRequest['user'],
  page: number = 1,
  limit: number = 10,
  search?: string,
  typeFilter?: string
): Promise<{ documents: DocumentDocument[]; total: number; totalPages: number; page: number }> => {
  const filter =
    user?.role !== "Admin" && user?.role !== "HR"
      ? { employee: user?._id }
      : {};

  const result = await documentRepository.findDocuments(filter, page, limit, search, typeFilter);

  return result;
};

/**
 * Service to fetch a single document by ID.
 */
export const getDocumentByIdService = async (
  id: string
): Promise<DocumentDocument> => {
  // Persistence via Repository
  const doc = await documentRepository.findDocumentById(id);

  if (!doc) {
    throw new Error("Document not found");
  }

  return doc;
};

/**
 * Service to handle the preparation for file download.
 * Checks DB record and file existence on disk.
 */
export const downloadDocumentService = async (
  id: string
): Promise<{ filePath: string, originalName: string, mimeType?: string }> => {
  // 1. Check DB record
  const doc = await documentRepository.findDocumentById(id);
  if (!doc) {
    throw new Error("Document not found");
    return;
  }
  
  // 2. Resolve absolute file path
  const filePath = documentRepository.resolveFilePath(doc.storageKey);

  // 3. Check File System existence
  if (!documentRepository.checkFileExistence(filePath)) {
    // Optionally: Log file missing from disk while DB record exists
    throw new Error("File not found on server");
    return;
  }

  // 4. Return necessary data for Controller's res.download
  const fileName = doc.originalName || `${doc.title}${documentRepository.resolveFilePath(doc.storageKey).split('.').pop()}`;

  return { 
    filePath: filePath,
    originalName: fileName, 
    mimeType: doc.mimeType 
  };
};

/**
 * Service to handle document deletion (DB record and file from disk).
 */
export const deleteDocumentService = async (id: string): Promise<void> => {
  // 1. Find DB record (for storage key)
  const doc = await documentRepository.findDocumentById(id);
  if (!doc) {
    throw new Error("Document not found");
    return;
  }
  
  // 2. Delete file from disk (File System operation via Repository)
  try {
    const filePath = documentRepository.resolveFilePath(doc.storageKey);
    documentRepository.deleteFileFromStorage(filePath);
    // Note: If the file is already gone, the unlinkSync inside the repo is guarded, no crash.
  } catch (error) {
    console.warn(`File deletion warning: Could not delete file ${doc.storageKey}. Proceeding with DB deletion.`);
    return;
  }

  // 3. Delete DB record (Persistence via Repository)
  const deletedDoc = await documentRepository.deleteDocumentRecord(id);
  if (!deletedDoc) {
    // This should ideally not happen if findById succeeded, but as a safeguard:
    throw new Error("Document record could not be deleted");
    return;
  }
};