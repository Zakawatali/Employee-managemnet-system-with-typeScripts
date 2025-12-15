import EmployeeProfile, {
  EmployeeProfileDocument,
} from "../models/EmployeeProfile";
import User, { IUser } from "../models/User";

export const findUserByEmail = async (
  email: string
): Promise<EmployeeProfileDocument | null> => {
  return EmployeeProfile.findOne({ email });
};

export const findAllUser = async (): Promise<IUser[]> => {
  return User.find().select("-password");
};

export const FindUserIdandEmail = async (
  userId: string
): Promise<IUser | null> => {
  return User.findById(userId);
};

export const FindEmployeeId = async (
  employeeId: string
): Promise<EmployeeProfileDocument | null> => {
  return EmployeeProfile.findById(employeeId);
};
 