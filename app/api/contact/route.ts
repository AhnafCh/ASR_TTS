import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, message } = await req.json()

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "info@sensevoice.ai",
      subject: `SenseVoice | ${company || "No Company"}`,
      text: `Name: ${name}\nCompany: ${company || "-"}\nEmail: ${email}\n${message ? `Message: ${message}` : ""}`,
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Contact form error:", e)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
