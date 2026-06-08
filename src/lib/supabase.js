import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
};

// ✅ signOut centralizado: invalida el token en Supabase
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  // El store se limpia desde el componente que llama a esto
};
