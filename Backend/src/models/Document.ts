import { Schema, model, Document, Types } from "mongoose";

export type DocumentKind =
  | "CONTRACT"
  | "LETTER"
  | "PAYSLIP"
  | "POLICY"
  | "OTHER";

export interface IDocument extends Document {
  employee?: Types.ObjectId;
  kind: DocumentKind;
  title: string;
  storageKey: string;
  mimeType?: string;
  originalName: string;
  uploadedBy?: Types.ObjectId;
}
export type DocumentDocument = IDocument;
const documentSchema = new Schema<IDocument>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "EmployeeProfile" },
    kind: {
      type: String,
      enum: ["CONTRACT", "LETTER", "PAYSLIP", "POLICY", "OTHER"],
      default: "OTHER",
    },
    title: { type: String, required: true },
    storageKey: { type: String, required: true },
    mimeType: { type: String },
    originalName: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "EmployeeProfile" },
  },
  { timestamps: true }
);

export default model<IDocument>("Document", documentSchema);
