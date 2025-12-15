import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { phone, otp } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data } = await supabase
    .from("phone_otps")
    .select("*")
    .eq("phone", phone)
    .eq("otp", otp)
    .gt("expires_at", new Date())
    .single();

  if (!data) {
    return new Response(
      JSON.stringify("Invalid or expired OTP"),
      { status: 400, headers: corsHeaders }
    );
  }

  await supabase
    .from("phone_otps")
    .delete()
    .eq("id", data.id);

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
