import { create } from "zustand";

export const useStore = create((set) => ({
  elements: [],
  selectedElement: null,
  variableStyles: {},

  addElement: (el: any) =>
    set((state: any) => ({
      elements: [...state.elements, el],
    })),

  selectElement: (el: any) =>
    set({ selectedElement: el }),

  updateElement: (id: string, updates: any) =>
    set((state: any) => ({
      elements: state.elements.map((e: any) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  setElements: (elements: any[]) =>
    set({ elements }),

  // 🔥 NEW
  setVariableStyles: (styles: any) =>
    set({ variableStyles: styles || {} }),

  updateVariableStyle: (varName: string, updates: any) =>
    set((state: any) => ({
      variableStyles: {
        ...state.variableStyles,
        [varName]: {
          ...state.variableStyles[varName],
          ...updates,
        },
      },
    })),
}));