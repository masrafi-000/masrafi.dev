import { google } from "googleapis"
import nodemailer from "nodemailer"

const CLIENT_ID = process.env.SMTP_CLIENT_ID
const CLIENT_SECRET = process.env.SMTP_CLIENT_SECRET
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = process.env.SMTP_REFRESH_TOKEN
const USER_EMAIL = process.env.SMTP_USER_EMAIL

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)

if (REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
}

async function sendMail(to: string, subject: string, html: string) {
  try {
    const accessToken = await oAuth2Client.getAccessToken()

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token || undefined,
      },
    })

    const mailOptions = {
      from: `Masrafi.dev Admin <${USER_EMAIL}>`,
      to,
      subject,
      html,
    }

    const result = await transport.sendMail(mailOptions)
    return result
  } catch (err) {
    console.log("ERROR: failed to send mail", err)
    throw err
  }
}

export default sendMail


export async function sendOTPEmail({
  to,
  otp,
  type,
}: {
  to: string;
  otp: string;
  type: string;
}) {
  const senderEmail = USER_EMAIL || "[EMAIL_ADDRESS]";

  const isReset = type === "forget-password";
  const subject = isReset
    ? "🔑 Your Password Reset OTP Code - Masrafi.dev"
    : "✉️ Your Email Verification Code - Masrafi.dev";

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; padding: 28px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 700;">Masrafi.dev Admin</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Security & Verification Service</p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #0f172a; margin-top: 0; font-size: 16px;">
          ${isReset ? "Password Reset Requested" : "Verification Requested"}
        </h3>
        <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">
          You requested a verification code to ${isReset ? "reset your admin account password" : "verify your email address"}. Use the OTP code below to proceed:
        </p>

        <div style="background-color: #ffffff; border: 2px dashed #3b82f6; border-radius: 8px; padding: 16px; text-align: center; margin: 16px 0;">
          <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1e40af;">
            ${otp}
          </span>
        </div>

        <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
          ⏳ This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
        </p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">
          If you did not request this email, please ignore it or contact administrator.
        </p>
      </div>
    </div>
  `;

  try {
    const result = await sendMail(to, subject, html);
    console.log(`[OTP Email Sent Successfully] to ${to}`);
    return result;
  } catch (error) {
    console.error(`[Failed to send OTP Email to ${to}]:`, error);
    throw error;
  }
}
