import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jnzfebtczqxxnvwgypgk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q';

const supabase = createClient(supabaseUrl, supabaseKey);

const wheelsToUpdate = [
  {
    id: 'mini-r103-5-star-blaster-wheels',
    wheel_title: 'MINI R103 5 Star Blaster Wheels',
    part_numbers: '36116769409 (Silver), 36116769410 (White)',
    notes: '16" wheels, 6.5JX16 ET:48, 4x100 bolt pattern. Available in Silver and White finishes. Compatible with R50, R52, R53, R55, R56, R57.'
  },
  {
    id: 'mini-948-runway-spoke',
    wheel_title: 'MINI 948 Runway Spoke',
    part_numbers: '',
    notes: 'Web search unavailable - part number information not found'
  },
  {
    id: 'mini-991-star-spoke-jcw',
    wheel_title: 'MINI 991 Star Spoke (JCW)',
    part_numbers: 'Style 991 JCW',
    notes: '17" wheels, 6Jx17 ET:41, Jet Black Uni finish. JCW original parts, snow chain compatible, RDCi tire pressure sensor compatible.'
  },
  {
    id: 'mini-985-slide-spoke',
    wheel_title: 'Mini 985 Slide Spoke',
    part_numbers: '',
    notes: '18" wheels, Jet Black with Bright Turned finish. MINI genuine original parts. Part number information requires MINI dealership lookup.'
  },
  {
    id: 'mini-r100-spooler-spoke-wheels',
    wheel_title: 'MINI R100 Spooler Spoke Wheels',
    part_numbers: '36116768498',
    notes: '15" wheels, 5.5JX15 ET:45, 4x100 bolt pattern. Available in Silver and White. Compatible with R50, R52, R53, R55, R56, R57, R58, R59. For vehicles without 16" or 17" sport brakes.'
  },
  {
    id: 'mini-r86-spider-spoke-wheels',
    wheel_title: 'MINI R86 Spider Spoke Wheels',
    part_numbers: '36116755809',
    notes: '15" wheels, Silver finish. 4x100 bolt pattern, 56.1mm center bore. Designed for R53 Cooper S / Works / GP models (2002-2009).'
  },
  {
    id: 'mini-902-circuit-spoke-jcw',
    wheel_title: 'MINI 902 Circuit Spoke (JCW)',
    part_numbers: '36106898049',
    notes: '18" wheels, 18x7.0 ET:54, 66.5mm hub bore. Jet Black finish. Fits F55/F56/F57 JCW models with Brembo brake systems. Also known as LA MINI Spoke.'
  },
  {
    id: 'mini-r99-double-spoke-wheels',
    wheel_title: 'MINI R99 Double Spoke Wheels',
    part_numbers: '36116777970 (Silver), 36116778426 (Grey Metallic), 36116778427 (Polished Silver)',
    notes: '17" wheels, 17x7J ET:48, 4x100 bolt pattern. Weight 21.9 lbs. Available in Silver, Grey Metallic, Polished Silver. For R50, R52, R53, R55, R56, R57, R58, R59. Not for 17" JCW Sport Brake.'
  },
  {
    id: 'mini-509-cup-spoke-jcw',
    wheel_title: 'MINI 509 Cup Spoke (JCW)',
    part_numbers: '',
    notes: 'Web search unavailable - part number information not found. JCW Cup Spoke design wheel.'
  },
  {
    id: 'mini-r83-5-spider-spoke-wheels',
    wheel_title: 'MINI R83 5 Spider Spoke Wheels',
    part_numbers: '36111512348 (Silver), 36111512349 (alternative)',
    notes: '16" wheels, 16x6.5 ET:50, 4x100 bolt pattern. Available in Silver and White. Compatible with R50, R53, R56 (2002-2013) and R52, R57 (2005-2015).'
  },
  {
    id: 'mini-r93-star-rocket-wheels',
    wheel_title: 'MINI R93 Star Rocket Wheels',
    part_numbers: '36116763295 (Silver), 36116763296 (White)',
    notes: '15" wheels, 5.5JX15 ET:45, 4x100 bolt pattern. Available in Silver and White. For vehicles without 16" sport brake. Standard on Convertible MY 2005-2007.'
  },
  {
    id: 'mini-r82-8-spoke-wheels',
    wheel_title: 'MINI R82 8 Spoke Wheels',
    part_numbers: '36111512347 (Silver), 36116756674 (White)',
    notes: '15" wheels, 5.5JX15 ET:45, 4x100 bolt pattern. Available in Silver and White. Compatible with R50, R52, R53, R55, R56, R57, R58, R59. Not for 16" JCW Sport Brake.'
  },
  {
    id: 'mini-517-revolution-spoke',
    wheel_title: 'MINI 517 Revolution Spoke',
    part_numbers: '36116887935 (Spectre Grey), 36112413557 (winter), 36 11 5 A24 E75 (complete winter wheel)',
    notes: '16" wheels, Style 517 Revolite Spoke. Available in Spectre Grey, Bright Silver, Polished Silver, Silver, Gloss Black. Fits F55/F56 models. Winter set includes Pirelli Winter Sottozero 3 R-F tires.'
  },
  {
    id: 'mini-562-track-spoke-jcw',
    wheel_title: 'MINI 562 Track Spoke (JCW)',
    part_numbers: '36116866366 (Black, F56), 36116858899 (Silver), 36 11 6 866 366, 36 10 6 861 092',
    notes: '17" wheels, 7J x 17, 205/45 R17 tire spec. Available in Jet Black and Silver. Not for JCW Aerodynamics package or JCW 17" Sport brakes. Fits F56/F57 models from 2014 onwards.'
  },
  {
    id: 'mini-830-scissor-spoke',
    wheel_title: 'MINI 830 Scissor Spoke',
    part_numbers: '36106889638',
    notes: '17" wheels, 17x7 ET:54, 5x112 bolt pattern, 66.5mm center bore. 10-spoke design, Black with Bright Turned finish. Fits F55, F56, F57 (2014-2024).'
  }
];

async function updateWheels() {
  let successCount = 0;
  let failureCount = 0;

  for (const wheel of wheelsToUpdate) {
    try {
      const { error } = await supabase
        .from('wheels')
        .update({
          part_numbers: wheel.part_numbers,
          notes: wheel.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', wheel.id);

      if (error) {
        console.error(`Failed to update ${wheel.id}:`, error.message);
        failureCount++;
      } else {
        console.log(`Successfully updated: ${wheel.wheel_title}`);
        successCount++;
      }
    } catch (err) {
      console.error(`Error updating ${wheel.id}:`, err.message);
      failureCount++;
    }
  }

  console.log(`\n===== UPDATE SUMMARY =====`);
  console.log(`Total processed: ${wheelsToUpdate.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failureCount}`);
  console.log(`========================\n`);

  return successCount;
}

updateWheels().then(count => {
  console.log(`\nFinal success count: ${count} wheels updated`);
  process.exit(0);
}).catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
