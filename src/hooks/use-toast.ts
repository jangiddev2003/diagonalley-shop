import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

// ----------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------
// Maximum number of toasts visible at the same time. Older ones get pushed out.
const TOAST_LIMIT = 1;

// Delay (in milliseconds) before a toast is completely removed from memory after being dismissed.
const TOAST_REMOVE_DELAY = 1000000;

// Defines the shape of a single Toast object, extending base props with an ID and optional text
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// ----------------------------------------------------------------------
// ACTIONS & IDENTIFIERS
// ----------------------------------------------------------------------
// These act like "commands" that tell our state management system what to do.
// Similar to Redux action types.
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

// Generates a unique string ID for every new toast so we can track and update them individually.
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

// TypeScript definitions for what data each action expects to receive.
type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

// Schedules a toast to be deleted from the "toasts" array entirely
// after the dismissal animation finishes (based on TOAST_REMOVE_DELAY).
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// ----------------------------------------------------------------------
// THE REDUCER (Logic Center)
// ----------------------------------------------------------------------
// This function takes the CURRENT state and an ACTION, and returns the NEW state.
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        // Add the new toast to the front, and slice off any beyond our TOAST_LIMIT
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        // Find the toast by ID and update it, leave others exactly as they were
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // When a toast is dismissed (started its exit animation), we queue it up to be 
      // completely removed from memory shortly after.
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Set open to false to trigger the exit animation
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// ----------------------------------------------------------------------
// GLOBAL STATE & DISPATCH (Custom State Management without Context API)
// ----------------------------------------------------------------------
// We store the state OUTSIDE of React so that we can call the `toast()` function 
// from regular javascript files, not just React components.
const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

// Takes an action, runs it through the reducer to get the new state, 
// then notifies all listening React components that they need to re-render.
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

/**
 * THE MAIN TOAST COMMAND
 * Call this function anywhere in the user interface to pop up a notification.
 * Example: toast({ title: "Success", description: "Your item was added!" })
 */
function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  // Returns tools so the caller can manually update or close the toast they just opened
  return {
    id: id,
    dismiss,
    update,
  };
}

/**
 * Custom React Hook: useToast
 * 
 * Used internally by the <Toaster /> component. It connects React to our global memoryState.
 * When a toast is fired, this hook "hears" it and forces the <Toaster /> to display the new array.
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    // Subscribe to state changes
    listeners.push(setState);
    return () => {
       // Unsubscribe when component unmounts
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
