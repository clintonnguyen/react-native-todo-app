import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bbxqqpcakfmkvynhrnnx.supabase.co";
const supabasePublishableKey = "sb_publishable_jpg3hmmMbNg3bEQuw7-f-w_zqrr-6Ut";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
