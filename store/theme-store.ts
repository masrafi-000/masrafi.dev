import { create } from "zustand";

interface ThemeStore {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  setIsDark: (isDark) => set({ isDark }),
}));
