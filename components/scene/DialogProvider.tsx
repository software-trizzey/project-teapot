"use client";

import { createContext, useContext, useReducer } from "react";
import type { ReactNode, Dispatch } from "react";

import { dialogReducer, initialDialogState } from "@/lib/dialogState";
import type { DialogEvent, DialogState } from "@/lib/dialogState";

type DialogContextValue = {
  state: DialogState;
  dispatch: Dispatch<DialogEvent>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dialogReducer, initialDialogState);

  return <DialogContext.Provider value={{ state, dispatch }}>{children}</DialogContext.Provider>;
}

export function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within DialogProvider");
  }
  return context;
}
