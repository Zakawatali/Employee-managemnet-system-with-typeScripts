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
};
