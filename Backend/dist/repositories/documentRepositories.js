"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromStorage = exports.checkFileExistence = exports.resolveFilePath = exports.deleteDocumentRecord = exports.findDocumentById = exports.findDocuments = exports.createDocument = void 0;
const Document_1 = __importDefault(require("../models/Document")); // Assuming DocumentDocument type exists
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// --- Mongoose/DB Operations ---
/**
 * Creates and saves a new Document record.
 * @param docData The data for the new Document.
 * @returns The newly created Document document.
 */
const createDocument = async (docData) => {
    const newDoc = new Document_1.default(docData);
    return newDoc.save();
};
exports.createDocument = createDocument;
/**
 * Finds documents based on a filter, populating employee and uploadedBy fields.
 * @param filter Mongoose query filter object.
 * @returns Array of Document documents.
 */
const findDocuments = async (filter) => {
    return Document_1.default.find(filter)
        .populate("employee uploadedBy", "firstName lastName email")
        .sort({ createdAt: -1 })
        .exec();
};
exports.findDocuments = findDocuments;
/**
 * Finds a single document by ID, populating related fields.
 * @param id The ID of the document.
 * @returns The Document document or null.
 */
const findDocumentById = async (id) => {
    return Document_1.default.findById(id)
        .populate("employee uploadedBy", "firstName lastName email")
        .exec();
};
exports.findDocumentById = findDocumentById;
/**
 * Deletes a document record from the database.
 * @param id The ID of the document record to delete.
 * @returns The deleted document or null.
 */
const deleteDocumentRecord = async (id) => {
    // Using findByIdAndDelete to return the deleted document for consistency
    return Document_1.default.findByIdAndDelete(id).exec();
};
exports.deleteDocumentRecord = deleteDocumentRecord;
// --- File System Operations ---
/**
 * Resolves the absolute path of a file key.
 * @param storageKey The path stored in the database.
 * @returns The absolute file path.
 */
const resolveFilePath = (storageKey) => {
    return path_1.default.resolve(storageKey);
};
exports.resolveFilePath = resolveFilePath;
/**
 * Checks if a file exists on the server.
 * @param filePath The absolute path to the file.
 * @returns Boolean indicating existence.
 */
const checkFileExistence = (filePath) => {
    return fs_1.default.existsSync(filePath);
};
exports.checkFileExistence = checkFileExistence;
/**
 * Synchronously deletes a file from the server's storage.
 * @param filePath The absolute path to the file.
 */
const deleteFileFromStorage = (filePath) => {
    // Ensure we check existence just before deleting to avoid race condition/error
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
    }
};
exports.deleteFileFromStorage = deleteFileFromStorage;
