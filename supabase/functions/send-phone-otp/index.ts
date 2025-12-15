import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  // ✅ Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { phone } = await req.json();

  if (!phone) {
    return new Response("Phone required", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  await supabase.from("phone_otps").insert({
    phone,
    otp,
    expires_at: new Date(Date.now() + 5 * 60 * 1000),
  });

  // ✅ FAST2SMS SEND
  await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: Deno.env.get("FAST2SMS_API_KEY")!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: "otp",
      numbers: phone,
      message: `Your one-time password is ${otp} for login – MediCare`,
    }),
  });

  return new Response(
    JSON.stringify({ success: true }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
});
