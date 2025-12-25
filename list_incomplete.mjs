import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

const SUPABASE_URL = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const { data, error } = await supabase
  .from('oem_wheels')
  .select('id, wheel_title, part_numbers, notes')
  .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

if (error) {
  console.error('Error:', error);
} else {
  const incomplete = data.filter(w => !w.part_numbers || !w.notes);

  writeFileSync('/tmp/incomplete_wheels.json', JSON.stringify(incomplete, null, 2));

  console.log(`Wheels missing data: ${incomplete.length}\n`);
  incomplete.forEach((w, i) => {
    const missing = [];
    if (!w.part_numbers) missing.push('PN');
    if (!w.notes) missing.push('Notes');
    console.log(`${i + 1}. ${w.wheel_title} [${missing.join(', ')}]`);
  });
}
