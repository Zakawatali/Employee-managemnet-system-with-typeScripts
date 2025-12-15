"use strict";
// import { Request, Response } from "express";
// import path from "path";
// import fs from "fs";
// import Document from "../models/Document";
// import { AuthenticatedRequest } from "../middlewares/authmiddlewares";
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
exports.deleteDocument = exports.downloadDocument = exports.getDocumentById = exports.getAllDocuments = exports.uploadDocument = void 0;
const documentService = __importStar(require("../Services/documentServices"));
// Helper interface to properly type errors that might contain a statusCode
/**
 * Controller to handle document upload.
 */
const uploadDocument = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            res.error = "No file uploaded";
            next(400);
            return;
        }
        const { employee, kind, title, uploadedBy } = req.body;
        // Delegate logic to service
        const newDoc = await documentService.uploadDocumentService({ employee, kind, title, uploadedBy }, file);
        res.result = newDoc;
        next(201);
    }
    catch (err) {
        const message = err.message || "Failed to upload document";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.uploadDocument = uploadDocument;
/**
 * Controller to fetch all documents with role-based access.
 */
const getAllDocuments = async (req, res, next) => {
    try {
        if (!req.user) {
            res.error = "Authentication required";
            next(401);
            return;
        }
        // Delegate logic to service
        const documents = await documentService.getAllDocumentsService(req.user);
        res.result = documents;
        next(200);
    }
    catch (err) {
        const message = err.message || "Failed to fetch documents";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getAllDocuments = getAllDocuments;
/**
 * Controller to fetch a single document by ID.
 */
const getDocumentById = async (req, res, next) => {
    try {
        const doc = await documentService.getDocumentByIdService(req.params.id);
        res.result = doc;
        next(200);
    }
    catch (err) {
        const message = err.message || "Server error";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.getDocumentById = getDocumentById;
/**
 * Controller to handle file download. This is a special case as it uses `res.download`.
 */
const downloadDocument = async (req, res, next) => {
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
    }
    catch (err) {
        const message = err.message || "Failed to download document";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.downloadDocument = downloadDocument;
/**
 * Controller to handle document deletion (DB and File System).
 */
const deleteDocument = async (req, res, next) => {
    try {
        await documentService.deleteDocumentService(req.params.id);
        res.result = { message: "Document deleted successfully" };
        next(200);
    }
    catch (err) {
        const message = err.message || "Failed to delete document";
        const statusCode = err.statusCode || 500;
        res.error = message;
        next(statusCode);
    }
};
exports.deleteDocument = deleteDocument;
