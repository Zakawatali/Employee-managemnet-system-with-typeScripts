"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocumentService = exports.downloadDocumentService = exports.getDocumentByIdService = exports.getAllDocumentsService = exports.uploadDocumentService = void 0;
const documentRepository = __importStar(require("../repositories/documentRepositories"));
/**
 * Service to handle document upload logic and persistence.
 */
const uploadDocumentService = async (docData, file) => {
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
exports.uploadDocumentService = uploadDocumentService;
/**
 * Service to handle fetching documents with role-based filtering.
 */
const getAllDocumentsService = async (user) => {
    // Business Logic: Only Admin/HR can see all documents; Employees only see their own.
    const filter = user?.role !== "Admin" && user?.role !== "HR"
        ? { employee: user?._id }
        : {};
    // Persistence via Repository
    const documents = await documentRepository.findDocuments(filter);
    // Note: We don't throw 404 if array is empty, as it's a valid result (no documents found).
    return documents;
};
exports.getAllDocumentsService = getAllDocumentsService;
/**
 * Service to fetch a single document by ID.
 */
const getDocumentByIdService = async (id) => {
    // Persistence via Repository
    const doc = await documentRepository.findDocumentById(id);
    if (!doc) {
        throw new Error("Document not found");
    }
    return doc;
};
exports.getDocumentByIdService = getDocumentByIdService;
/**
 * Service to handle the preparation for file download.
 * Checks DB record and file existence on disk.
 */
const downloadDocumentService = async (id) => {
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
exports.downloadDocumentService = downloadDocumentService;
/**
 * Service to handle document deletion (DB record and file from disk).
 */
const deleteDocumentService = async (id) => {
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
    }
    catch (error) {
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
exports.deleteDocumentService = deleteDocumentService;
