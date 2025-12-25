#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jnzfebtczqxxnvwgypgk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q'
);

const updates = [
  {
    id: 'mini-r98-web-spoke-2pc-wheels',
    part_numbers: '36 11 6 767 750, 36 11 6 775 686 (Silver), 36 11 6 787 710 (Black)',
    notes: '17" wheel, 7JX17 ET:48, 4x100 bolt pattern. Two-piece construction with titanium bolts. Compatible with R50-R59 models (2002-2015). Available in Silver and Black finishes. Manufactured by Ronal. Does not fit 5-lug third generation MINIs.'
  },
  {
    id: 'mini-510-double-spoke-jcw',
    part_numbers: '36 11 2 349 710 (complete winter wheel), 36 11 6 855 119',
    notes: '17" JCW wheel, 5.5J x 17 ET45, 5x112 bolt pattern. Jet Black finish. Compatible with JCW 17" Sport brakes. Only snow chain-capable wheel/tyre combination for vehicles with JCW 17" Sport brakes.'
  },
  {
    id: 'mini-956-u-spoke',
    part_numbers: '36 11 5 A3E 637',
    notes: '17" wheel for F65/F66/F67 models from March 2020 onwards. Available in Spectre Grey and Vibrant Silver finishes.'
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
