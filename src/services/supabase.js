import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://grtsdcwcfcdzjszrwkdb.supabase.co";

const SUPABASE_API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydHNkY3djZmNkempzenJ3a2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MDczNTAsImV4cCI6MjA0NjM4MzM1MH0.IrunBBHoXDBRZnYgKh3pn7oA8sRUyl9p9fX79yj14bM";

// Create Supabase client with error handling
let supabase;
try {
    supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
} catch (error) {
    console.warn("Failed to initialize Supabase client:", error);
    // Create a mock client for local development
    supabase = {
        from: () => ({
            select: () => ({
                eq: () => Promise.resolve({ data: [], error: null })
            }),
            insert: () => Promise.resolve({ data: null, error: null }),
            update: () => ({
                eq: () => Promise.resolve({ data: null, error: null })
            })
        })
    };
}

export default supabase;
