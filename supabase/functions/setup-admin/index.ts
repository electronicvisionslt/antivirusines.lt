import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { email, password, setup_secret } = body;

    // ── Security gate: require ADMIN_SETUP_SECRET ──
    // If the env var is set, the caller must provide a matching secret.
    // If the env var is NOT set, first-admin creation is completely disabled
    // and must be done via backend tools (SQL insert into user_roles).
    const requiredSecret = Deno.env.get("ADMIN_SETUP_SECRET");

    if (!requiredSecret) {
      return new Response(
        JSON.stringify({
          error: "Pirmo administratoriaus kūrimas išjungtas. Naudokite backend įrankius arba nustatykite ADMIN_SETUP_SECRET.",
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!setup_secret || setup_secret !== requiredSecret) {
      return new Response(
        JSON.stringify({ error: "Neteisingas nustatymo kodas." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Check if any admin already exists ──
    const { data: existingAdmins, error: checkError } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("role", "admin")
      .limit(1);

    if (checkError) throw checkError;

    if (existingAdmins && existingAdmins.length > 0) {
      return new Response(
        JSON.stringify({ error: "Administratorius jau egzistuoja. Naudokite prisijungimo formą." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Validate input ──
    if (!email || !password || password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Nurodykite el. paštą ir slaptažodį (min. 8 simboliai)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Create user ──
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) throw createError;

    // ── Assign admin role ──
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userData.user.id, role: "admin" });

    if (roleError) throw roleError;

    return new Response(
      JSON.stringify({ success: true, message: "Administratorius sukurtas sėkmingai." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
