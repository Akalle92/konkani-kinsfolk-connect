import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kzvwbubybsxefkbxxxxq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6dndidWJ5YnN4ZWZrYnh4eHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0NzI5NTUsImV4cCI6MjAyMzA0ODk1NX0.PqkH0u5GDyKqHQXSBXGHJpHVPYD3Qs-Fy8sFQGLFGYE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);