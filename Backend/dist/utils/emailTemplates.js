"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
exports.emailTemplates = {
    welcomeEmployee: (employee) => `
    <h2>Welcome ${employee.firstName} <br>${employee.lastName}!</h2>
    <p>Your account has been approved 🎉.  
    You’re now part of the team 🚀.</p>
    <p>Login and start exploring your dashboard.</p>
  `,
    hrNotification: (employee) => `
    <h3>Employee Approved</h3>
    <p><strong>Name:</strong> ${employee.firstName} ${employee.lastName}</p>
    <p><strong>Email:</strong> ${employee.email ?? "N/A"}</p>
    <p>Status: <strong>${employee.status ?? "N/A"}</strong></p>
  `,
    leaveApproved: (employee, leave) => `
    <h2>Leave Approved ✅</h2>
    <p>Hello ${employee.firstName} ${employee.lastName}</p>
    <p>Your leave from <b>${new Date(leave.startDate).toDateString()}</b> to <b>${new Date(leave.endDate).toDateString()}</b> has been approved.</p>

  `,
    leaveRejected: (employee, leave) => `
    <h2>Leave Rejected ❌</h2>
    <p>Hello ${employee.firstName} ${employee.lastName}</p>
    <p>Your leave request from <b>${new Date(leave.startDate).toDateString()}</b> to <b>${new Date(leave.endDate).toDateString()}</b> has been rejected.</p>

  `,
};
