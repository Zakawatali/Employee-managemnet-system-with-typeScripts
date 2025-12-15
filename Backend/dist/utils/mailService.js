"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
const sendEmail = async ({ to, subject, html, from, }) => {
    try {
        const sender = from || process.env.EMAIL_USER;
        if (!sender) {
            throw new Error("EMAIL_USER is not configured");
        }
        await nodemailer_1.default.sendMail({
            from: sender,
            to,
            subject,
            html,
        });
        console.log(`✅ Email sent to: ${to}`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ Error sending email:", message);
    }
};
exports.sendEmail = sendEmail;
