import * as employeeRepository from "../repositories/employeeRepositories";
import { EmployeeProfileDocument } from "../models/EmployeeProfile"; // Assuming this type is available

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
    throw new Error("Employee not found");
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
    throw new Error("Employee not found");
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
    throw new Error("Employee not found");
    return;
  }

  return deletedEmployee;
};

/**
 * Service to retrieve all employee profiles.
 * @returns An object containing the array of employees and their count.
 * @throws AppError for 404 if no employees are found.
 */
export const getAllEmployeesService = async (): Promise<{ employees: EmployeeProfileDocument[], count: number }> => {
  const employees = await employeeRepository.findAllEmployees();

  if (!employees || employees.length === 0) {
    throw new Error("No employees found");
  }

  return { employees, count: employees.length };
};