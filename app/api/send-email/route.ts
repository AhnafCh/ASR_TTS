import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, message } = await req.json()

    // Configure nodemailer transporter (example uses Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "asifahnafchowdhury@gmail.com",
      subject: `SenseVoice | ${company || "No Company"}`,
      text: `Name: ${name}\nCompany: ${company || "-"}\nEmail: ${email}\n${message ? `Message: ${message}` : ""}`,
    }

    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
