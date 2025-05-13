import { createClient } from "@supabase/supabase-js";

export default createClient(
  "https://dfcnaenhsmhudbislsyj.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
