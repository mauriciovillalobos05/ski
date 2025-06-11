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
  // Preflight para CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, kueski-authorization");
    return res.status(200).end();
  }

  // Solo aceptar POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Leer cuerpo crudo
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks).toString("utf8");

    console.log("[WEBHOOK] Recibido body:", rawBody);

    // Autenticación con JWT de Kueski
    const incomingHeader = req.headers["kueski-authorization"] || req.headers.authorization || "";
    const [, incomingToken] = incomingHeader.split(" ");

    if (!incomingToken) throw new Error("No token provided");
    jwt.verify(incomingToken, API_SECRET);

    // Parsear datos de la transacción
    const {
      payment_id,
      order_id,
      status: newStatus,
      status_reason,
    } = JSON.parse(rawBody);

    console.log(`[WEBHOOK] Transacción ${order_id} recibida con estado '${newStatus}'`);

    // Mapear a estados locales
    let supabaseStatus = null;

    if (["rejected", "canceled", "failed"].includes(newStatus)) {
      supabaseStatus = "rejected";
    } else if (["approved", "success"].includes(newStatus)) {
      supabaseStatus = "approved";
    } else if (newStatus === "pending") {
      supabaseStatus = "pending";
    }

    if (order_id && supabaseStatus) {
      // Leer estado actual para proteger 'approved'
      const { data: current, error: readError } = await supabase
        .from("transacciones")
        .select("status")
        .eq("id", order_id)
        .single();

      if (readError) {
        console.error(`[WEBHOOK] Error leyendo transacción ${order_id}:`, readError.message);
      } else if (current.status === "approved") {
        console.log(`[WEBHOOK] Transacción ${order_id} ya está aprobada. No se sobrescribe.`);
      } else {
        // Actualizar estado si aún no es 'approved'
        const { error: updateError } = await supabase
          .from("transacciones")
          .update({ status: supabaseStatus })
          .eq("id", order_id);

        if (updateError) {
          console.error(`[WEBHOOK] Error actualizando transacción ${order_id}:`, updateError.message);
        } else {
          console.log(`[WEBHOOK] Transacción ${order_id} actualizada a '${supabaseStatus}'`);
        }
      }
    } else {
      console.warn(`[WEBHOOK] order_id o status inválidos: ${order_id}, ${supabaseStatus}`);
    }

    // Responder con JWT firmado para Kueski
    const nowSec = Math.floor(Date.now() / 1000);
    const iat = nowSec;
    const exp = nowSec + 5 * 60;
    const jti = crypto.createHash("sha256").update(`${API_SECRET}:${iat}`).digest("hex");

    const responseJwtPayload = { public_key: API_KEY, iat, exp, jti };
    const responseToken = jwt.sign(responseJwtPayload, API_SECRET, { algorithm: "HS256" });

    res.setHeader("Authorization", `Bearer ${responseToken}`);
    res.setHeader("kueski-authorization", `Bearer ${responseToken}`);
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("[WEBHOOK] Error en webhook:", err.message);

    const nowSec = Math.floor(Date.now() / 1000);
    const iat = nowSec;
    const exp = nowSec + 5 * 60;
    const jti = crypto.createHash("sha256").update(`${API_SECRET}:${iat}`).digest("hex");

    const responseJwtPayload = { public_key: API_KEY, iat, exp, jti };
    const responseToken = jwt.sign(responseJwtPayload, API_SECRET, { algorithm: "HS256" });

    res.setHeader("Authorization", `Bearer ${responseToken}`);
    res.setHeader("kueski-authorization", `Bearer ${responseToken}`);
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({ status: "reject", error: err.message });
  }
}