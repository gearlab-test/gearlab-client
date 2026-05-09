import { create } from 'zustand';
import API from '@/lib/api';


const useStore = create((set) => ({
  user: null,
  token: null,
  sessionLoading: true,
  cart: [],


  setUser: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, cart: [] });
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
    } catch (err) {
      console.error('Session restoration failed:', err.message);
      localStorage.removeItem('token');
      set({ user: null, token: null, sessionLoading: false });
    }
  },


  setCart: (cart) => set({ cart }),

}));

export default useStore;