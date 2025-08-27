import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstname, lastname, email, phone, service, message } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_TO, EMAIL_FROM } =
      process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_TO) {
      return NextResponse.json(
        { error: "SMTP not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = `Nouveau message de ${firstname || ""} ${lastname || ""}`;
    const html = `
      <h3>Nouveau message de contact</h3>
      <p><strong>Name:</strong> ${firstname || ""} ${lastname || ""}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || ""}</p>
      <p><strong>Service:</strong> ${service || ""}</p>
      <p><strong>Message:</strong><br/>${(message || "").replace(
        /\n/g,
        "<br/>"
      )}</p>
    `;

    await transporter.sendMail({
      from: EMAIL_FROM || SMTP_USER, // doit être autorisé par le provider (souvent = SMTP_USER)
      to: EMAIL_TO,
      subject,
      html,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("send mail error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
