import { Schema, model, Document } from "mongoose";

export type Department = "HR" | "IT" | "Finance" | "Marketing" | "Sales";
export type Position =
  | "Manager"
  | "Team Lead"
  | "Developer"
  | "Designer"
  | "Intern"
  | "HR";
export type Role = "HR" | "Employee" | "Admin";
export type EmploymentStatus =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "TERMINATED";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  department: Department;
  position: Position;
  experience?: string;
  education?: string;
  image?: string;
  role: Role;
  status: EmploymentStatus;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    department: {
      type: String,
      enum: ["HR", "IT", "Finance", "Marketing", "Sales"],
      required: true,
    },
    position: {
      type: String,
      enum: ["Manager", "Team Lead", "Developer", "Designer", "Intern", "HR"],
      required: true,
    },
    experience: { type: String },
    education: { type: String },
    role: {
      type: String,
      enum: ["HR", "Employee", "Admin"],
      default: "Employee",
    },
    image: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "SUSPENDED", "TERMINATED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
