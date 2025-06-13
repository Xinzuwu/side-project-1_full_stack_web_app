import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://budvgwzgpzgbjqobroyb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZHZnd3pncHpnYmpxb2Jyb3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Nzc0ODcsImV4cCI6MjA2NDM1MzQ4N30.X-vUqEvLZHh7cpxsi5WIVrxNSZlnDoCK-XWWQO4p9j0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
