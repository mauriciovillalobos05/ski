import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

export default async function handler(req, res) {
  // Permitir preflight CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, kueski-authorization");
    return res.status(200).end();
  }

  // Solo permitimos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Leer el cuerpo sin perder datos
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks).toString("utf8");

    console.log("Webhook recibido:", rawBody);

    const incomingHeader =
      req.headers["kueski-authorization"] || req.headers.authorization || "";
    const [, incomingToken] = incomingHeader.split(" ");

    if (!incomingToken) throw new Error("No token provided");
    jwt.verify(incomingToken, API_SECRET);

    const {
      payment_id,
      order_id,
      status: newStatus,
      status_reason,
    } = JSON.parse(rawBody);

    console.log("Transacción:", order_id, "Estado:", newStatus);

    // 3. Firmar respuesta
    const nowSec = Math.floor(Date.now() / 1000);
    const iat = nowSec;
    const exp = nowSec + 5 * 60;
    const jti = crypto.createHash("sha256").update(`${API_SECRET}:${iat}`).digest("hex");

    const responseJwtPayload = { public_key: API_KEY, iat, exp, jti };
    const responseToken = jwt.sign(responseJwtPayload, API_SECRET, {
      algorithm: "HS256",
    });

    res.setHeader("Authorization", `Bearer ${responseToken}`);
    res.setHeader("kueski-authorization", `Bearer ${responseToken}`);
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({ status: "ok" });

  } catch (err) {
    console.error("Error en webhook:", err.message);

    const nowSec = Math.floor(Date.now() / 1000);
    const iat = nowSec;
    const exp = nowSec + 5 * 60;
    const jti = crypto.createHash("sha256").update(`${API_SECRET}:${iat}`).digest("hex");

    const responseJwtPayload = { public_key: API_KEY, iat, exp, jti };
    const responseToken = jwt.sign(responseJwtPayload, API_SECRET, {
      algorithm: "HS256",
    });

    res.setHeader("Authorization", `Bearer ${responseToken}`);
    res.setHeader("kueski-authorization", `Bearer ${responseToken}`);
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({ status: "reject", error: err.message });
  }
}