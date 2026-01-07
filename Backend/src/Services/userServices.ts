import bcrypt from "bcryptjs";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { ApiError } from "../utils/ApiError";
import User, {
  IUser,
  Department,
  Position,
  Role,
  EmploymentStatus,
} from "../models/User";
import EmployeeProfile, {
  EmployeeProfileDocument,
} from "../models/EmployeeProfile";
import { sendEmail } from "../utils/mailService";
import { emailTemplates } from "../utils/emailTemplates";
import {
  findUserByEmail,
  findAllUser,
  FindUserIdandEmail,
  FindEmployeeId,
} from "../repositories/userRepositories";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { SUCCESS_MESSAGES } from "../constants/successMessages";

// import { resetPasswordEmailTemplate } from "../utils/emailTemplates";

interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date | string;
  department: string;
  position: string;
  experience?: number;
  education?: string;
  image?: string;
  role?: Role;
  status?: EmploymentStatus;
}

interface ResetTokenPayload extends JwtPayload {
  userId: string;
}

const getJwtSecret = (): Secret => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

const generateEmployeeCode = (): string => {
  const prefix = "EMP";
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${random}`;
};

export const LoginUserService = async (
  email: string,
  password: string
): Promise<any> => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      throw new ApiError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    const payload = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const expiresIn = process.env.JWT_EXPIRES_IN || "30m";

    const signOptions: SignOptions = {
      expiresIn: expiresIn as SignOptions["expiresIn"],
    };

    const token = jwt.sign(payload, getJwtSecret(), signOptions);

    // ❌ never log full user with password in production
    // console.log(user);

    return {
      token,
      ...user.toObject(),
    };
  } catch (error) {
    // If it's already a known ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error;
    }

    // Otherwise wrap unknown error
    throw new ApiError(
      "Error while logging in user",
      500
    );
  }
};


// Fixed RegisterUserService
export const RegisterUserService = async (
  userData: RegisterUserInput
): Promise<{ newUser: IUser }> => {
  try {
    // Check if user already exists
    const existingUser = await findUserByEmail(userData.email);

    if (existingUser) {
      throw new ApiError("User already exists with this email", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create new user
    const newUser = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
      address: userData.address,
      dateOfBirth: userData.dateOfBirth,
      department: userData.department,
      position: userData.position,
      experience: userData.experience,
      education: userData.education,
      image: userData.image, // file path
      role: userData.role ?? "Employee",
      status: userData.status ?? "PENDING",
    });

    // Save to DB
    await newUser.save();

    console.log("User saved successfully:", newUser);
    return { newUser };
  } catch (error: any) {
    // Log the error for debugging
    console.error("Error in RegisterUserService:", error);

    // Throw ApiError if not already
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Failed to register user", 500);
  }
};


// export const GetAllUserService = async (page: number = 1, limit: number = 10) => {
//   return findAllUser(page, limit);
// };
export const GetAllUserService = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  return findAllUser(page, limit, search);
};

export const ApproveUserServices = async (
  userId: string
): Promise<{ user: IUser; employeeProfile: EmployeeProfileDocument }> => {
  const user = await FindUserIdandEmail(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const employeeProfile = new EmployeeProfile({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    phone: user.phone,
    address: user.address,
    dateOfBirth: user.dateOfBirth,
    department: user.department,
    position: user.position,
    experience: user.experience,
    education: user.education,
    role: user.role,
    image: user.image,
    employeeCode: generateEmployeeCode(),
    status: "ACTIVE",
  });

  await employeeProfile.save();
  await user.deleteOne();

  try {
    await sendEmail({
      to: employeeProfile.email,
      subject: "🎉 Welcome to the Company!",
      html: emailTemplates.welcomeEmployee(employeeProfile),
    });
  } catch (emailErr) {
    const message =
      emailErr instanceof Error ? emailErr.message : "Unknown email error";
    console.error("Error sending email:", message);
  }

  return { user, employeeProfile };
};

export const RejectUserServices = async (
  userId: string
): Promise<{ user: IUser }> => {
  const user = await FindUserIdandEmail(userId);

  if (!user) {
    throw new Error("User not found");
  }

  await user.deleteOne();
  return { user };
};

export const ForgetPasswordServices = async (
  email: string
): Promise<{ user: EmployeeProfileDocument; respose: { status: number; message: string } }> => {
  try {
    const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError("User not found",404);
  }

  const resetTokenOptions: SignOptions = {
    expiresIn: "10m" as unknown as StringValue,
  };

  const token = jwt.sign(
    { userId: user._id.toString() },
    getJwtSecret(),
    resetTokenOptions
  );

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: emailTemplates.resetPasswordEmailTemplate(user.firstName, token),
  });

  const respose = {
    status: 200,
    message: "Reset email sent successfully",
  };

  return { user, respose };
    
  } catch (error) {
    console.error("ForgetPasswordServices Error:", error,"status",error.statusCode);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || "Something went wrong during password forget", error.statusCode || 500);
    
  }
  
};

export const ResetPasswordService = async (
  newPass: string,
  token: string
): Promise<{ Emp?: EmployeeProfileDocument; response?: string }> => {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as ResetTokenPayload;

    if (!decoded?.userId) {
      throw new ApiError("Invalid or expired token",401);
    }

    const Emp = await FindEmployeeId(decoded.userId);

    if (!Emp) {
      throw new ApiError("Employee not found in the system for the provided reset token",401);
    }

    // Compare new password with old hashed password
    const isSamePassword = await bcrypt.compare(newPass, Emp.password);
    if (isSamePassword) {
      throw new ApiError("Please enter a new password different from the old password",401);
    }

    // Hash & save new password
    const hashedPassword = await bcrypt.hash(newPass, 10);
    Emp.password = hashedPassword;
    await Emp.save();

    return { Emp, response: "Password Reset Successfully" };
  } catch (error: any) {
    // Log the error if needed
    console.error("ResetPasswordService Error:", error,"status",error.statusCode);

    // Throw error to be caught in controller
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || "Something went wrong during password reset", error.statusCode || 500);
  }
};

