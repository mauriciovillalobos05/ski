// pages/api/sendEmail.ts (o .js)
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const { to, subject, body, callback_url } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailText = `${body}

Puedes completar tu pago en el siguiente enlace:
${callback_url}

Gracias por tu preferencia.`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: emailText,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error al enviar correo:", err);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
}
