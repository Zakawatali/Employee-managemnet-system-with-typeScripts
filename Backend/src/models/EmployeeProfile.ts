import { Schema, model, Document } from "mongoose";
import {
  Department,
  Position,
  Role,
  EmploymentStatus,
} from "./User";

export interface IEmployeeProfile extends Document {
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
  role: Role;
  employeeCode: string;
  image?: string;
  status: EmploymentStatus;
}

const employeeProfileSchema = new Schema<IEmployeeProfile>(
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
      required: true,
    },
    employeeCode: { type: String, unique: true, required: true, index: true },
    image: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "SUSPENDED", "TERMINATED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export type EmployeeProfileDocument = IEmployeeProfile;

export default model<IEmployeeProfile>("EmployeeProfile", employeeProfileSchema);

