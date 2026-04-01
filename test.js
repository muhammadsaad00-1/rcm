import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  const { data, error } = await supabase
    .from("insurance_companies")   // replace with any table you created
    .select("*")
    .limit(1);

  if (error) {
    console.error("❌ Query failed:", error.message);
  } else {
    console.log("✅ Supabase connected and query successful!");
    console.log(data);
  }
}

testConnection();