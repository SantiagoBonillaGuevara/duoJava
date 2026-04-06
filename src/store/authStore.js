import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      session: null,

      setAuth: (user, session) =>
        set({
          session,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            xp: user.xp,
            levelNumber: user.levelNumber,
            streak: user.streak,
          },
        }),

      logout: () => set({ user: null, session: null }),
    }),
    { name: "auth-storage" },
  ),
);
