// Leva | Supabase connection
// هذا الملف مُجهز لمشروع Leva-store.
// لا تضعي Secret key أو service_role key هنا.

window.SUPABASE_URL = 'https://bwadfheopabpcmiwfvvw.supabase.co';
window.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_YlVCX1dAaeYe1_bABL_LIg_dI4G8uV8';

window.LEVA_SUPABASE_READY =
  window.SUPABASE_URL.startsWith('https://') &&
  window.SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_');

window.supabaseClient = null;

if (window.LEVA_SUPABASE_READY && window.supabase) {
  window.supabaseClient = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_PUBLISHABLE_KEY
  );
}
