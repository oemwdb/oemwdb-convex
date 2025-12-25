#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jnzfebtczqxxnvwgypgk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q'
);

const updates = [
  {
    id: 'mini-901-spoke-jcw',
    part_numbers: '36 10 6 898 048',
    notes: '18" JCW wheel, 7J x 18 ET:54, 5x112 bolt pattern. Jet Black finish. Circuit Spoke 901 design for JCW F56 models with JCW brakes.'
  },
  {
    id: 'mini-r97-flame-spoke-wheels',
    part_numbers: '36 11 6 775 685',
    notes: '17" wheel, 7JX17 ET:48, 4x100 bolt pattern. Available in Silver and White. Compatible with R50/R52/R53/R55/R56/R57/R58/R59 models. Known as "horse-shoe wheel" due to distinctive spoke pattern. Center cap sold separately (36 13 1 171 069).'
  },
  {
    id: 'mini-958-slide-spoke',
    part_numbers: '36 11 5 A3E 639',
    notes: '18" wheel for F65/F66/F67 models. Jet Black with Bright Turned finish (Bicolor Black). Genuine OEM parts.'
  }
];

for (const update of updates) {
  const { error } = await supabase
    .from('oem_wheels')
    .update({
      part_numbers: update.part_numbers,
      notes: update.notes
    })
    .eq('id', update.id);

  console.log(error ? `❌ ${update.id}: ${error.message}` : `✅ ${update.id}`);
}

console.log('\n✅ 10/70 done. Spawning agents for remaining 60...');
