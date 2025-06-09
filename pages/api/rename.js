// pages/api/rename.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { transactionId, name, email, phone } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: "Falta transactionId" });
  }

  try {
    const { data: tx, error: txError } = await supabase
      .from("transacciones")
      .select("*")
      .eq("id", transactionId)
      .single();

    if (txError || !tx) {
      return res.status(500).json({ error: "Error al obtener la transacción" });
    }

    const { data: pt, error: ptError } = await supabase
      .from("terrazas")
      .select("price, name, description");

    if (ptError || !pt) {
      return res.status(500).json({ error: "Error al obtener productos" });
    }

    const trimmedName = (name || "").trim();
    const [first, ...rest] = trimmedName.split(" ");
    const shippingName = {
      name: first || "Cliente",
      last: rest.length > 0 ? rest.join(" ") : "Anonimo"
    };

    const baseUrl = "https://jackboys.vercel.app";
    const callbackParams = `transaccion_id=${tx.id}&terraza_availability_id=${tx.terraza_id}`;

    const payload = {
      order_id: transactionId,
      description: tx.concept || "Sin descripción",
      amount: {
        total: tx.amount,
        currency: "MXN",
        details: { subtotal: tx.amount }
      },
      items: pt.map((terraza, i) => ({
        name: terraza.name,
        description: terraza.description || "",
        price: terraza.price,
        currency: "MXN",
        sku: `SKU-${i + 1}`,
        quantity: 1
      })),
      shipping: {
        name: shippingName,
        address: {
          address: "Sin dirección",
          interior: "",
          neighborhood: "",
          city: "CDMX",
          state: "CDMX",
          zipcode: "06000",
          country: "MX"
        },
        phone_number: phone ?? "0000000000",
        email: email || "no-email@placeholder.com"
      },
      callbacks: {
        on_success: `${baseUrl}/success?${callbackParams}`,
        on_reject: `${baseUrl}/reject?${callbackParams}`,
        on_canceled: `${baseUrl}/reject?${callbackParams}`,
        on_failed: `${baseUrl}/reject?${callbackParams}`
      }
    };

    const kueskiRes = await fetch("https://payments-api.sandbox-pay.kueski.codes/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
        "kp-name": "kueskilink-dev",
        "kp-source": "web",
        "kp-version": "1.0.0",
        "kp-trigger": "api"
      },
      body: JSON.stringify(payload)
    });

    const result = await kueskiRes.json();

    if (result.status === "success") {
      await supabase
        .from("transacciones")
        .update({
          status: result.data.status,
          kueski_payment_url: result.data.callback_url,
          kueski_created_at: new Date().toISOString()
        })
        .eq("id", transactionId);

      return res.status(200).json({ status: "success", data: result.data });
    } else {
      return res.status(500).json({ error: "Error en respuesta de Kueski", details: result });
    }
  } catch (err) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
