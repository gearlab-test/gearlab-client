import { create } from 'zustand';

let toastId = 0;

const useToast = create((set) => ({
  toasts: [],

  addToast: (message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  showSuccess: (message) => {
    useToast.getState().addToast(message, 'success');
  },

  showError: (message) => {
    useToast.getState().addToast(message, 'error');
  },

  showInfo: (message) => {
    useToast.getState().addToast(message, 'info');
  },

  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

export default useToast;
