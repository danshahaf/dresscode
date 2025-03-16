/// <reference lib="deno.ns" />

// supabase/functions/sendNotifications.ts
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Load environment variables provided by Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Expo push notification endpoint
const expoPushEndpoint = "https://exp.host/--/api/v2/push/send";

async function sendNotifications(request: Request): Promise<Response> {
  try {
    // Query profiles with no uploaded outfit.
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("user_id, push_token")
      // Assumes you have an "outfits" table; adjust if needed.
      .not("user_id", "in", `(select distinct user_id from outfits)`);
    
    if (error) throw error;

    const messages: any[] = [];

    for (const profile of profiles || []) {
      if (!profile.push_token) continue;
      // Check if it's a valid Expo push token.
      if (typeof profile.push_token !== "string" || !profile.push_token.startsWith("ExponentPushToken")) {
        console.warn(`Invalid push token for user ${profile.user_id}`);
        continue;
      }
      messages.push({
        to: profile.push_token,
        sound: "default",
        body: "Yo, flex your style! Upload an outfit now and let your vibe shine!",
        data: { userId: profile.user_id },
      });
    }

    // Expo accepts an array of messages
    const response = await fetch(expoPushEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    console.log("Notifications sent:", result);

    return new Response("Notifications sent", { status: 200 });
  } catch (err) {
    console.error("Error in sendNotifications:", err);
    return new Response("Error sending notifications", { status: 500 });
  }
}

serve(sendNotifications);
