import bcrypt from "bcryptjs";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
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

interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date | string;
  department: Department;
  position: Position;
  experience?: string;
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
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const payload = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  const expiresIn = (process.env.JWT_EXPIRES_IN || "30m") as unknown as StringValue;

  const signOptions: SignOptions = {
    expiresIn,
  };

  const token = jwt.sign(payload, getJwtSecret(), signOptions);
console.log({...user})
  return { token, ...user.toObject() };
};

// Fixed RegisterUserService
export const RegisterUserService = async (
  userData: RegisterUserInput
): Promise<{ newUser: IUser }> => {
  
  const existingUser = await findUserByEmail(userData.email);
 
  if (existingUser) {
    throw new Error("User already exists with this email");
    return
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

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
    image: userData.image, // This now contains the file path
    role: userData.role ?? "Employee",
    status: userData.status ?? "PENDING",
  });
  
  await newUser.save();
  
  console.log("User saved successfully:", newUser);
  return { newUser };
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
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
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
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 30px;">
          <h2 style="color: #333; text-align: center;">🔒 Password Reset Request</h2>
          <p style="font-size: 15px; color: #555;">
            Hi ${user.firstName || "there"},<br><br>
            We received a request to reset your password for your EMS account.
            Click the button below to choose a new password:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/reset-password/${token}" 
               style="background-color: #007bff; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
               Reset Password
            </a>
          </div>

          <p style="font-size: 14px; color: #555;">
            This link will expire in <b>10 minutes</b> for your security.
          </p>
          <p style="font-size: 13px; color: #777;">
            If you didn’t request a password reset, you can safely ignore this email.
          </p>

          <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} DevRolin EMS System. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });

  const respose = {
    status: 200,
    message: "Reset email sent successfully",
  };

  return { user, respose };
};

export const ResetPasswordService = async (
  newPass: string,
  token: string
): Promise<{ Emp: EmployeeProfileDocument; response: string }> => {
  const decoded = jwt.verify(token, getJwtSecret()) as ResetTokenPayload;

  if (!decoded?.userId) {
    throw new Error("Invalid or expired token");
  }

  const Emp = await FindEmployeeId(decoded.userId);

  if (!Emp) {
    throw new Error(
      "Employee not found in the system for the provided reset token"
    );
  }

  const hashedPassword = await bcrypt.hash(newPass, 10);
  Emp.password = hashedPassword;
  await Emp.save();

  const response = "Password Reset Successfully";
  return { Emp, response };
};

