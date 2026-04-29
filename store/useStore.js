import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  token: null,
  cart: [],

  setUser: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, cart: [] });
  },

  setCart: (cart) => set({ cart }),
}));

export default useStore;