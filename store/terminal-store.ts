import { create } from "zustand";

interface TerminalState {
  isOpen: boolean;
  isMinimized: boolean;
  toggleTerminal: () => void;
  openTerminal: () => void;
  closeTerminal: () => void;
  setMinimized: (minimized: boolean) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  isOpen: true,
  isMinimized: true,
  toggleTerminal: () => set((state) => ({ isOpen: !state.isOpen, isMinimized: false })),
  openTerminal: () => set({ isOpen: true, isMinimized: false }),
  closeTerminal: () => set({ isOpen: false }),
  setMinimized: (minimized) => set({ isMinimized: minimized }),
}));
