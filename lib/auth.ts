import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { sendOTPEmail } from "@/services/mail.services";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`\n========================================`);
        console.log(`[AUTH OTP DISPATCHED]`);
        console.log(`Email: ${email}`);
        console.log(`OTP Code: ${otp}`);
        console.log(`Type: ${type}`);
        console.log(`========================================\n`);

        try {
          await sendOTPEmail({ to: email, otp, type });
        } catch (error) {
          console.error("Failed to send OTP email:", error);
        }
      },
    }),
  ],
});
