import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zudyaawxwrnkprvbmeov.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZHlhYXd4d3Jua3BydmJtZW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjU3NjQsImV4cCI6MjA4MDk0MTc2NH0.wrmWjMpe6culSYIibhwIkae4hqHlaKQ9z7uYw6eO2jI';

export const supabase = createClient(supabaseUrl, supabaseKey);
