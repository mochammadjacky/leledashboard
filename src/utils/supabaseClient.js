import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://betapnzdyprynenoouhy.supabase.co"; // Ganti sesuai projectmu
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldGFwbnpkeXByeW5lbm9vdWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjQxMTIsImV4cCI6MjA2NDEwMDExMn0.VWL-Ypt0Vm6UtijS0ooL2QwwduO4jzSVbdAiXUDWXtc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
