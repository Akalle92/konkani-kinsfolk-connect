import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kzvwbubybsxefkbxxxxq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6dndidWJ5YnN4ZWZrYnh4eHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczOTc5MzEsImV4cCI6MjA1Mjk3MzkzMX0.j1JVcskrtjKU5lcwdfRYIYnM9ZhzchNdbSpEkrBLhR8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);