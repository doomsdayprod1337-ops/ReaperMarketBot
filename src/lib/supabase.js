import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '@/config/environment'

// Create Supabase client
export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'X-Client-Info': 'reaper-market-vue'
      }
    }
  }
)

// Supabase helper functions
export const supabaseHelpers = {
  // Auth helpers
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signInWithProvider(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Database helpers
  async insert(table, data) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
    return { data: result, error }
  },

  async select(table, columns = '*', filters = {}) {
    let query = supabase.from(table).select(columns)
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })
    
    const { data, error } = await query
    return { data, error }
  },

  async update(table, data, filters) {
    let query = supabase.from(table).update(data)
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })
    
    const { data: result, error } = await query.select()
    return { data: result, error }
  },

  async delete(table, filters) {
    let query = supabase.from(table)
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })
    
    const { data, error } = await query.delete()
    return { data, error }
  },

  // Real-time subscriptions
  subscribeToTable(table, callback, filters = {}) {
    let query = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: table,
          ...filters
        }, 
        callback
      )
      .subscribe()

    return query
  },

  // Storage helpers
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    return { data, error }
  },

  async downloadFile(bucket, path) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    return { data, error }
  },

  async getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    return data
  },

  async deleteFile(bucket, path) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path])
    return { data, error }
  }
}

// Auth state management
export const authState = {
  user: null,
  session: null,
  loading: true
}

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  authState.user = session?.user ?? null
  authState.session = session
  authState.loading = false
  
  // Update localStorage
  if (session) {
    localStorage.setItem('supabase_session', JSON.stringify(session))
    localStorage.setItem('marketplace_token', session.access_token)
  } else {
    localStorage.removeItem('supabase_session')
    localStorage.removeItem('marketplace_token')
  }
})

// Initialize auth state
export const initializeAuth = async () => {
  const { session } = await supabaseHelpers.getSession()
  authState.user = session?.user ?? null
  authState.session = session
  authState.loading = false
}

export default supabase
