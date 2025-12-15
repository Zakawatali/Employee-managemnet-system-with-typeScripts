import transporter from "../config/nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
  from,
}: SendEmailOptions): Promise<void> => {
  try {
    const sender = from || process.env.EMAIL_USER;

    if (!sender) {
      throw new Error("EMAIL_USER is not configured");
    }

    await transporter.sendMail({
      from: sender,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to: ${to}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error sending email:", message);
  }
};
