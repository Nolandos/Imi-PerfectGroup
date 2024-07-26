import { create } from 'zustand';
import { persist } from "zustand/middleware"
import type { Database } from './db.types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { getClient } from './supabase';

interface GlobalStore {
  auth: {
    session: Session | null;
    supabase: SupabaseClient<Database>;
    role: string | null;
  },
  setRole: (role: string | null) => void
  setSession: (session: Session | null) => void
}

export const globalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      auth: {
        session: null,
        supabase: getClient(),
        role: null
      },
      setRole: function(role: string | null) {
        set((state) => {
          state.auth.role = role
          return state
        })
      },
      setSession(session) {
        set((state) => {
          state.auth.session = session
          return state
        })
      }
    }), { name: 'global-store' }))
