// Assuming the following types and models are imported from their respective paths
import EmployeeProfile, { EmployeeProfileDocument } from "../models/EmployeeProfile";

/**
 * Finds an employee profile by ID.
 * @param id The ID of the employee to find.
 * @returns The EmployeeProfile document or null if not found.
 */
export const findEmployeeById = async (id: string): Promise<EmployeeProfileDocument | null> => {
  return EmployeeProfile.findById(id).exec();
};

/**
 * Updates an employee profile by ID.
 * @param id The ID of the employee to update.
 * @param updateData The data to apply to the employee profile.
 * @returns The updated EmployeeProfile document or null if not found.
 */
export const updateEmployeeById = async (
  id: string,
  updateData: any
): Promise<EmployeeProfileDocument | null> => {
  return EmployeeProfile.findByIdAndUpdate(id, updateData, {
    new: true, // Return the modified document rather than the original
    runValidators: true, // Ensure schema validators run on update
  }).exec();
};

/**
 * Finds and deletes an employee profile by ID.
 * @param id The ID of the employee to delete.
 * @returns The deleted EmployeeProfile document or null if not found.
 */
export const deleteEmployeeById = async (id: string): Promise<EmployeeProfileDocument | null> => {
  return EmployeeProfile.findByIdAndDelete(id).exec();
};

/**
 * Finds all employee profiles in the database.
 * @returns An array of EmployeeProfile documents.
 */
// repositories/employee.repository.ts
// export const findAllEmployees = async (
//   skip: number,
//   limit: number
// ): Promise<EmployeeProfileDocument[]> => {
//   return EmployeeProfile.find()
//     .skip(skip)
//     .limit(limit)
//     .sort({ createdAt: -1 })
//     .exec();
// };

// export const countEmployees = async (): Promise<number> => {
//   return EmployeeProfile.countDocuments();
// };
export const findAllEmployees = async (
  filter: any,
  skip: number,
  limit: number
): Promise<EmployeeProfileDocument[]> => {
  return EmployeeProfile.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();
};
export const countEmployees = async (filter: any = {}): Promise<number> => {
  return EmployeeProfile.countDocuments(filter);
};
