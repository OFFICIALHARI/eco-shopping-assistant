import { createClient } from "@supabase/supabase-js";
require("dotenv").config();

// Initialize Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
