import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useRedirectStore = create<{
  hasConnectedAddresses: string[];
  addConnectedAddress: (address: string) => void;
}>()(
  persist(
    (set) => ({
      hasConnectedAddresses: [] as string[],
      addConnectedAddress: (address: string) =>
        set((state) => ({
          hasConnectedAddresses: [...state.hasConnectedAddresses, address],
        })),
    }),
    {
      name: "redirect",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
