import { signInWithGoogle } from "@/lib/supabase";

export const handleGoogleSignIn = async ({ setError }) => {
  try {
    await signInWithGoogle();
  } catch (err) {
    setError(err.message);
  }
};
