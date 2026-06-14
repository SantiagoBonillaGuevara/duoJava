import { signOut } from "@/lib/supabase";

export const handleLogout = async ({ logout, navigate }) => {
  try {
    await signOut();
    logout();
    navigate("/login");
  } catch (err) {
    console.error("Logout error:", err);
    logout();
    navigate("/login");
  }
};
