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
            googleAvatarUrl: user.googleAvatarUrl,
            xp: user.xp,
            levelNumber: user.levelNumber,
            streak: user.streak,
            completedLessons: user.completedLessons,
            completedCourses: user.completedCourses,
          },
        }),

      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),

      logout: () => set({ user: null, session: null }),
    }),
    { name: "auth-storage" },
  ),
);
