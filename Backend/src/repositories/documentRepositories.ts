import Document, { DocumentDocument } from "../models/Document"; // Assuming DocumentDocument type exists
import { Types } from "mongoose";
import path from "path";
import fs from "fs";

// --- Mongoose/DB Operations ---

/**
 * Creates and saves a new Document record.
 * @param docData The data for the new Document.
 * @returns The newly created Document document.
 */
export const createDocument = async (docData: any): Promise<DocumentDocument> => {
  const newDoc = new Document(docData);
  return newDoc.save();
};

/**
 * Finds documents based on a filter, populating employee and uploadedBy fields.
 * @param filter Mongoose query filter object.
 * @returns Array of Document documents.
 */
export const findDocuments = async (filter: any): Promise<DocumentDocument[]> => {
  return Document.find(filter)
    .populate("employee uploadedBy", "firstName lastName email")
    .sort({ createdAt: -1 })
    .exec();
};

/**
 * Finds a single document by ID, populating related fields.
 * @param id The ID of the document.
 * @returns The Document document or null.
 */
export const findDocumentById = async (id: string): Promise<DocumentDocument | null> => {
  return Document.findById(id)
    .populate("employee uploadedBy", "firstName lastName email")
    .exec();
};

/**
 * Deletes a document record from the database.
 * @param id The ID of the document record to delete.
 * @returns The deleted document or null.
 */
export const deleteDocumentRecord = async (id: string): Promise<DocumentDocument | null> => {
  // Using findByIdAndDelete to return the deleted document for consistency
  return Document.findByIdAndDelete(id).exec();
};


// --- File System Operations ---

/**
 * Resolves the absolute path of a file key.
 * @param storageKey The path stored in the database.
 * @returns The absolute file path.
 */
export const resolveFilePath = (storageKey: string): string => {
  return path.resolve(storageKey);
};

/**
 * Checks if a file exists on the server.
 * @param filePath The absolute path to the file.
 * @returns Boolean indicating existence.
 */
export const checkFileExistence = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

/**
 * Synchronously deletes a file from the server's storage.
 * @param filePath The absolute path to the file.
 */
export const deleteFileFromStorage = (filePath: string): void => {
  // Ensure we check existence just before deleting to avoid race condition/error
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};