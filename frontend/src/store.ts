import { create } from "zustand";

export const useStore = create((set) => ({
  elements: [],
  selected: null,

  addElement: (el: any) =>
    set((state: any) => ({
      elements: [...state.elements, el],
    })),

  selectElement: (el: any) => set({ selected: el }),

  updateElement: (id: string, updates: any) =>
    set((state: any) => ({
      elements: state.elements.map((e: any) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
}));