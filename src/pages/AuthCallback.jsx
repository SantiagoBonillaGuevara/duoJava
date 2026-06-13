import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getMyProfile } from "@/api/endpoints";
import { useAuthStore } from "@/store/authStore";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const handle = async () => {
      // Supabase necesita un tick para procesar el hash de la URL
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        navigate("/login");
        return;
      }

      // Traer el perfil de la BD (la fuente de verdad del username)
      const { data: profile } = await getMyProfile();

      // Poblar el store correctamente
      setAuth(
        {
          id: session.user.id,
          email: session.user.email,
          username: profile?.username ?? null,
          displayName: profile?.displayName ?? null,
          avatarUrl: profile?.avatarUrl ?? null,
          googleAvatarUrl: profile?.googleAvatarUrl ?? null,
          xp: profile?.xp ?? 0,
          levelNumber: profile?.levelNumber ?? 1,
          streak: profile?.streak ?? 0,
          completedLessons: profile?.completedLessons ?? 0,
          completedCourses: profile?.completedCourses ?? 0,
        },
        session,
      );

      if (!profile?.username) {
        navigate("/setup-username");
      } else {
        navigate("/dashboard");
      }
    };

    handle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#161121]">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 animate-spin rounded-full border-2 border-[#6324eb] border-t-transparent" />
        <p className="text-slate-400 text-sm">Iniciando sesión...</p>
      </div>
    </div>
  );
}
