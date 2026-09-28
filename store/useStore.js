import { create } from 'zustand';
import API from '@/lib/api';


const useStore = create((set, get) => ({
  user: null,
  token: null,
  sessionLoading: true,
  cart: [],
  cartCount: 0,

  setUser: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, cart: [], cartCount: 0 });
  },

  initialize: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ sessionLoading: false });
      return;
    }
    
    try {
      const res = await API.get('/auth/me');
      set({ user: res.data, token, sessionLoading: false });
      // Fetch cart count after auth
      get().fetchCartCount();
    } catch (err) {
      console.error('Session restoration failed:', err.message);
      localStorage.removeItem('token');
      set({ user: null, token: null, sessionLoading: false });
    }
  },

  fetchCartCount: async () => {
    try {
      const res = await API.get('/cart');
      const count = res.data?.configurations?.length || 0;
      set({ cartCount: count });
    } catch {
      // Not logged in or cart doesn't exist yet
      set({ cartCount: 0 });
    }
  },

  setCart: (cart) => set({ cart }),

}));

export default useStore;