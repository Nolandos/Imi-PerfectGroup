import { Session, SupabaseClient } from '@supabase/supabase-js'
import * as React from 'react'
import type { Database } from "./db.types"

export interface AuthContext {
  role: string | null
  session: Session | null
  supabase: SupabaseClient<Database> | null
}
export const AuthContext = React.createContext<AuthContext | null>(null)

