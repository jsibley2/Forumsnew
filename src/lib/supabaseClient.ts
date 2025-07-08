import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are missing
let supabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables not found. Using mock client.");

  // Create a mock client that prevents errors but doesn't actually connect
  supabaseClient = {
    auth: {
      signUp: () =>
        Promise.resolve({
          data: null,
          error: new Error("Supabase not configured"),
        }),
      signIn: () =>
        Promise.resolve({
          data: null,
          error: new Error("Supabase not configured"),
        }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () =>
        Promise.resolve({
          data: null,
          error: new Error("Supabase not configured"),
        }),
      update: () =>
        Promise.resolve({
          data: null,
          error: new Error("Supabase not configured"),
        }),
      delete: () =>
        Promise.resolve({
          data: null,
          error: new Error("Supabase not configured"),
        }),
    }),
  };
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;
