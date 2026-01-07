interface EmployeeInfo {
  firstName: string;
  lastName: string;
  email?: string;
  status?: string;
}

interface LeaveInfo {
  startDate: string | Date;
  endDate: string | Date;
}

export const emailTemplates = {
  welcomeEmployee: (employee: EmployeeInfo): string => `
    <h2>Welcome ${employee.firstName} <br>${employee.lastName}!</h2>
    <p>Your account has been approved 🎉.  
    You’re now part of the team 🚀.</p>
    <p>Login and start exploring your dashboard.</p>
  `,

  hrNotification: (employee: EmployeeInfo): string => `
    <h3>Employee Approved</h3>
    <p><strong>Name:</strong> ${employee.firstName} ${employee.lastName}</p>
    <p><strong>Email:</strong> ${employee.email ?? "N/A"}</p>
    <p>Status: <strong>${employee.status ?? "N/A"}</strong></p>
  `,

  leaveApproved: (employee: EmployeeInfo, leave: LeaveInfo): string => `
    <h2>Leave Approved ✅</h2>
    <p>Hello ${employee.firstName} ${employee.lastName}</p>
    <p>Your leave from <b>${new Date(leave.startDate).toDateString()}</b> to <b>${new Date(leave.endDate).toDateString()}</b> has been approved.</p>

  `,

  leaveRejected: (employee: EmployeeInfo, leave: LeaveInfo): string => `
    <h2>Leave Rejected ❌</h2>
    <p>Hello ${employee.firstName} ${employee.lastName}</p>
    <p>Your leave request from <b>${new Date(leave.startDate).toDateString()}</b> to <b>${new Date(leave.endDate).toDateString()}</b> has been rejected.</p>

  `,
  resetPasswordEmailTemplate : (firstName: string, token: string):string => `
  <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 30px;">
      <h2 style="color: #333; text-align: center;">🔒 Password Reset Request</h2>
      <p style="font-size: 15px; color: #555;">
        Hi ${firstName || "there"},<br><br>
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
  `
  
  

};

// export const resetPasswordEmailTemplate = (firstName: string, token: string) => `
// <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 40px;">
//   <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 30px;">
//     <h2 style="color: #333; text-align: center;">🔒 Password Reset Request</h2>
//     <p style="font-size: 15px; color: #555;">
//       Hi ${firstName || "there"},<br><br>
//       We received a request to reset your password for your EMS account.
//       Click the button below to choose a new password:
//     </p>

//     <div style="text-align: center; margin: 30px 0;">
//       <a href="http://localhost:5173/reset-password/${token}" 
//          style="background-color: #007bff; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
//          Reset Password
//       </a>
//     </div>

//     <p style="font-size: 14px; color: #555;">
//       This link will expire in <b>10 minutes</b> for your security.
//     </p>
//     <p style="font-size: 13px; color: #777;">
//       If you didn’t request a password reset, you can safely ignore this email.
//     </p>

//     <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;">
//     <p style="font-size: 12px; color: #888; text-align: center;">
//       © ${new Date().getFullYear()} DevRolin EMS System. All rights reserved.
//     </p>
//   </div>
// </div>
// `;

