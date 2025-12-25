#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jnzfebtczqxxnvwgypgk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q'
);

const updates = [
  {
    id: 'mini-989-lap-spoke-jcw',
    part_numbers: 'Not found in search results',
    notes: '19" JCW wheel. Black with Bright Turned finish. Genuine JCW OEM parts. Detailed specs not available in search results.'
  },
  {
    id: 'mini-r90-cross-spoke-2pc-wheels',
    part_numbers: '36 11 6 777 969 (Anthracite), 36 11 6 780 983 (Black)',
    notes: '17" BBS 2-piece wheel, 7J x 17 ET:48, 4x100 bolt pattern. Available in Anthracite, Polished Black, and Silver. Compatible with R50/R52/R53/R55/R56/R57/R58/R59 models (2002-2015). Featured on Gen 1 MINI Challenge Series.'
  },
  {
    id: 'mini-534-double-spoke-jcw',
    part_numbers: '36 11 6 855 095, 36 10 6 861 092 (Night Fever Black), 36 10 6 864 388 (Ferric Grey)',
    notes: '18" JCW forged wheel, 7J x 18 ET54, 5x112 bolt pattern. Milled, concave, weight-optimized. Available in Ferric Grey, Matt Black with Bright Turned, Night Fever Black. Compatible with JCW 17" Sport brakes. Requires flared wheel-arch if not fitted ex-works.'
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

console.log('\n✅ Batch complete! 7/70 wheels done.');
