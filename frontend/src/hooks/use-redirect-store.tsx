"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";

// Create the store type
type RedirectStore = {
  hasConnectedAddresses: string[];
  addConnectedAddress: (address: string) => void;
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
};

// Create the store with proper initialization
export const useRedirectStore = create<RedirectStore>()(
  persist(
    (set) => ({
      hasConnectedAddresses: [] as string[],
      isHydrated: false,
      setHydrated: (state: boolean) => set({ isHydrated: state }),
      addConnectedAddress: (address: string) => {
        set((state) => ({
          hasConnectedAddresses: [...state.hasConnectedAddresses, address],
        }));
      },
    }),
    {
      name: "redirect-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (state) {
          useRedirectStore.getState().setHydrated(true);
        }
      },
    },
  ),
);

// Initialize the store on the client side
if (typeof window !== "undefined") {
  console.log("Initializing store on client side");
  void useRedirectStore.persist.rehydrate();
}

// Custom hook to ensure hydration is complete before using the store
export const useRedirectStoreHydrated = () => {
  const store = useRedirectStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(store.isHydrated);
  }, [store.isHydrated]);

  return {
    ...store,
    isHydrated,
  };
};
