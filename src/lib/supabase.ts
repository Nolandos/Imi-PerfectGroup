import { SupabaseClient, createClient } from "@supabase/supabase-js";
import type { Database } from "./db.types"
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

export const getClient = () => {
  if (!client) {
    client = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  }
  return client
}
