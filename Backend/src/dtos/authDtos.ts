export class LoginDto {
    email: string;
    password: string;
}
export class RegisterUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    dateOfBirth?: string;
    department?: string;
    position?: string;
    experience?: number;
    education?: string;
    image?: string;
  }
  export class ForgetPasswordDto {
    email: string;
  }
  export class ResetPasswordDto {
    newPassword: string;
  }