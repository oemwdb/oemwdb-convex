#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDU2NjYsImV4cCI6MjA4MjA4MTY2Nn0.JHggoRpYAVvPQQ1-M7p0NZ2SpQFxYNwWZKDbsnRvqMc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const { data, error } = await supabase.storage.listBuckets();

if (error) {
  console.error('Error:', error);
} else {
  console.log('Buckets:', data);
}
