import * as employeeRepository from "../repositories/employeeRepositories";
import { EmployeeProfileDocument } from "../models/EmployeeProfile"; // Assuming this type is available
import { ApiError } from "../utils/ApiError";
import {ERROR_MESSAGES  } from "../constants/errorMessages";
import { SUCCESS_MESSAGES } from "../constants/successMessages";
// Define a custom error type for predictable HTTP status codes


/**
 * Service to retrieve a single employee profile by ID.
 * @param id The ID of the employee.
 * @returns The EmployeeProfile document.
 * @throws AppError for 404 if the employee is not found.
 */
export const getEmployeeByIdService = async (id: string): Promise<EmployeeProfileDocument> => {
  const employee = await employeeRepository.findEmployeeById(id);

  if (!employee) {
    throw new ApiError(ERROR_MESSAGES.EMPLOYEE_NOT_FOUND,404);
    return;
  }

  return employee;
};

/**
 * Service to update an employee profile.
 * @param id The ID of the employee to update.
 * @param updateData The data to apply.
 * @returns The updated EmployeeProfile document.
 * @throws AppError for 404 if the employee is not found.
 */
export const updateEmployeeService = async (
  id: string,
  updateData: any
): Promise<EmployeeProfileDocument> => {
  // Business logic: Check if the employee exists and update in one go
  const updatedEmployee = await employeeRepository.updateEmployeeById(id, updateData);

  if (!updatedEmployee) {
    throw new ApiError(ERROR_MESSAGES.EMPLOYEE_NOT_FOUND,404);
    return;
  }

  return updatedEmployee;
};

/**
 * Service to delete an employee profile.
 * @param id The ID of the employee to delete.
 * @returns The deleted EmployeeProfile document.
 * @throws AppError for 404 if the employee is not found.
 */
export const deleteEmployeeService = async (id: string): Promise<EmployeeProfileDocument> => {
  const deletedEmployee = await employeeRepository.deleteEmployeeById(id);

  if (!deletedEmployee) {
    throw new ApiError(ERROR_MESSAGES.EMPLOYEE_NOT_FOUND,404);
    return;
  }

  return deletedEmployee;
};

/**
 * Service to retrieve all employee profiles.
 * @returns An object containing the array of employees and their count.
 * @throws AppError for 404 if no employees are found.
 */
// services/employee.service.ts
// export const getAllEmployeesService = async (
//   page: number,
//   limit: number
// ): Promise<{
//   employees: EmployeeProfileDocument[];
//   page: number;
//   limit: number;
//   totalEmployees: number;
//   totalPages: number;
// }> => {
//   const skip = (page - 1) * limit;

//   const totalEmployees = await employeeRepository.countEmployees();
//   const employees = await employeeRepository.findAllEmployees(skip, limit);

//   if (!employees || employees.length === 0) {
//     throw new Error("No employees found");
//   }

//   return {
//     employees,
//     page,
//     limit,
//     totalEmployees,
//     totalPages: Math.ceil(totalEmployees / limit),
//   };
// };
// export const getAllEmployeesService = async (
//   page: number,
//   limit: number,
//   search: string,
//   department: string
// ): Promise<{
//   employees: EmployeeProfileDocument[];
//   page: number;
//   limit: number;
//   totalEmployees: number;
//   totalPages: number;
// }> => {
//   const skip = (page - 1) * limit;

//   // 🔍 dynamic filter
//   const filter: any = {};

//   if (search) {
//     filter.$or = [
//       { firstName: { $regex: search, $options: "i" } },
//       { lastName: { $regex: search, $options: "i" } },
//     ];
//   }

//   if (department) {
//     filter.department = department;
//   }

//   const totalEmployees = await employeeRepository.countEmployees(filter);
//   console.log(totalEmployees)
//   if (!totalEmployees ) {
//     throw new Error("No employees found");
//   }

//   const employees = await employeeRepository.findAllEmployees(
//     filter,
//     skip,
//     limit
//   );

  

//   return {
//     employees,
//     page,
//     limit,
//     totalEmployees,
//     totalPages: Math.ceil(totalEmployees / limit),
//   };
// };

export const getAllEmployeesService = async (
  page: number,
  limit: number,
  search: string,
  department: string
): Promise<{
  employees: EmployeeProfileDocument[];
  page: number;
  limit: number;
  totalEmployees: number;
  totalPages: number;
}> => {
  try {
    const skip = (page - 1) * limit;

    // 🔍 dynamic filter
    const filter: any = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    if (department) {
      filter.department = department;
    }

    // Count total employees matching the filter
    const totalEmployees = await employeeRepository.countEmployees(filter);

    // ❌ Throw ApiError if none found
    if (!totalEmployees) {
      throw new ApiError(ERROR_MESSAGES.EMPLOYEE_NOT_FOUND, 404);
    }

    // Get employees for current page
    const employees = await employeeRepository.findAllEmployees(
      filter,
      skip,
      limit
    );

    return {
      employees,
      page,
      limit,
      totalEmployees,
      totalPages: Math.ceil(totalEmployees / limit),
    };
  } catch (err: any) {
    
      throw err; // Already a custom error, rethrow
   
  }
};
