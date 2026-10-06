// Muhafız Playz - Supabase Configuration

const SUPABASE_URL = "https://esbmthtgujjqavjusvck.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_O_zi2xIoTcyYsA-ryz_hiQ_7GgElXtV";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
