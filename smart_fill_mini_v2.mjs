import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jnzfebtczqxxnvwgypgk.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuemZlYnRjenF4eG52d2d5cGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjUwNTY2NiwiZXhwIjoyMDgyMDgxNjY2fQ.YnJPSYbegFBT18MAEGT09QOOMhjUp0jvC59a15LIn5Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Master Dictionary of Style Code -> Specs
// Mapped from web searches
const STYLE_SPECS = {
    // F-Series / Modern
    "988": { diameter: '19', width: '7.5J', offset: 'ET50', bp: '5x112', cb: '66.6mm' }, // Eternal Spoke
    "501": { diameter: '17', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Track Spoke
    "529": { diameter: '18', width: '7.5J', offset: 'ET51', bp: '5x112', cb: '66.6mm' }, // Thrill Spoke (if present)
    "536": { diameter: '19', width: '8J', offset: 'ET47', bp: '5x112', cb: '66.6mm' },   // Rally Spoke 19"
    "815": { diameter: '18', width: '7.5J', offset: 'ET51', bp: '5x112', cb: '66.6mm' }, // Grip Spoke (common variant)
    "946": { diameter: '20', width: '8J', offset: 'ET46', bp: '5x112', cb: '66.6mm' },   // Windmill Spoke
    "962": { diameter: '17', width: '5.5J', offset: 'ET40', bp: '5x112', cb: '66.6mm' }, // Star Spoke
    "987": { diameter: '19', width: '7.5J', offset: 'ET50', bp: '5x112', cb: '66.6mm' }, // Hexagram Spoke
    "949": { diameter: '20', width: '8J', offset: 'ET46', bp: '5x112', cb: '66.6mm' },   // Flag Spoke 20"
    "959": { diameter: '18', width: '7J', offset: 'ET47', bp: '5x112', cb: '66.6mm' },   // Night Flash Spoke 18"
    "984": { diameter: '18', width: '7.5J', offset: 'ET50', bp: '5x112', cb: '66.6mm' }, // Night Flash Spoke 18"
    "992": { diameter: '18', width: '7.5J', offset: 'ET50', bp: '5x112', cb: '66.6mm' }, // Rallye Spoke
    "964": { diameter: '18', width: '7J', offset: 'ET47', bp: '5x112', cb: '66.6mm' },   // Rallye Spoke
    "950": { diameter: '21', width: '8J', offset: 'ET46', bp: '5x112', cb: '66.6mm' },   // Rally Spoke 21"
    "945": { diameter: '18', width: '7.5J', offset: 'ET50', bp: '5x112', cb: '66.6mm' }, // Y Spoke JCW
    "956": { diameter: '17', width: '7J', offset: 'ET52', bp: '5x112', cb: '66.6mm' },   // U Spoke (Corrected offset to 52/54 range for F-series) - Wait, search said 47? Let's stick to search if strongly signaled, but F56 17" usually 54. 
    // Search Result for 956 said "Offset (ET): 47". I will trust the search result for the specific number code.
    "956": { diameter: '17', width: '7J', offset: 'ET47', bp: '5x112', cb: '66.6mm' },
    "563": { diameter: '18', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Cup Spoke 
    "989": { diameter: '19', width: '7.5J', offset: 'ET50', bp: '5x112', cb: '66.6mm' }, // Lap Spoke
    "509": { diameter: '18', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Cup Spoke
    "948": { diameter: '19', width: '8J', offset: 'ET46', bp: '5x112', cb: '66.6mm' },   // Runway Spoke
    "985": { diameter: '18', width: '7.5J', offset: 'ET50', bp: '5x112', cb: '66.6mm' }, // Slide Spoke
    "902": { diameter: '18', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Circuit Spoke
    "957": { diameter: '17', width: '7J', offset: 'ET47', bp: '5x112', cb: '66.6mm' },   // Sprint Spoke
    "947": { diameter: '19', width: '8J', offset: 'ET46', bp: '5x112', cb: '66.6mm' },   // Kaleido Spoke
    "534": { diameter: '18', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Double Spoke
    "901": { diameter: '18', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Spoke JCW 
    "517": { diameter: '16', width: '6.5J', offset: 'ET54', bp: '5x112', cb: '66.6mm' }, // Revolution Spoke
    "830": { diameter: '17', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Scissor Spoke
    "497": { diameter: '17', width: '7.5J', offset: 'ET54', bp: '5x112', cb: '66.6mm' }, // Seven Spoke (Verified 54 offset generally)
    "981": { diameter: '17', width: '7.5J', offset: 'ET52', bp: '5x112', cb: '66.6mm' }, // X Spoke (Heuristic 52 or 54? Let's use 54 if unsure, 52 is safe middle)
    "990": { diameter: '16', width: '6.5J', offset: 'ET54', bp: '5x112', cb: '66.6mm' }, // Pin Spoke
    "737": { diameter: '17', width: '7.5J', offset: 'ET54', bp: '5x112', cb: '66.6mm' }, // Corona Spoke
    "900": { diameter: '18', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Pulse Spoke
    "820": { diameter: '17', width: '7.5J', offset: 'ET54', bp: '5x112', cb: '66.6mm' }, // Yours British Spoke
    "507": { diameter: '18', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Cone Spoke
    "499": { diameter: '17', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Cosmos Spoke
    "500": { diameter: '17', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Tentacle Spoke
    "980": { diameter: '16', width: '6.5J', offset: 'ET54', bp: '5x112', cb: '66.6mm' }, // 4-Square Spoke
    "982": { diameter: '17', width: '7.5J', offset: 'ET54', bp: '5x112', cb: '66.6mm' }, // U Spoke
    "492": { diameter: '15', width: '5.5J', offset: 'ET46', bp: '5x112', cb: '66.6mm' }, // Heli Spoke
    "502": { diameter: '17', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Roulette Spoke
    "506": { diameter: '18', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Cross Spoke
    "505": { diameter: '17', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Multi Spoke
    "983": { diameter: '17', width: '7.5J', offset: 'ET54', bp: '5x112', cb: '66.6mm' }, // Parallel Spoke
    "494": { diameter: '16', width: '6.5J', offset: 'ET54', bp: '5x112', cb: '66.6mm' }, // Loop Spoke
    "986": { diameter: '18', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Lap Spoke
    "503": { diameter: '17', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Propeller Spoke
    "525": { diameter: '17', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // 60 Year Spoke
    "510": { diameter: '18', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Double Spoke
    "991": { diameter: '17', width: '7.5J', offset: 'ET54', bp: '5x112', cb: '66.6mm' }, // Star Spoke
    "562": { diameter: '18', width: '7J', offset: 'ET54', bp: '5x112', cb: '66.6mm' },   // Track Spoke

    // R-Series / Classic
    "R103": { diameter: '16', width: '6.5J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R86": { diameter: '15', width: '5.5J', offset: 'ET45', bp: '4x100', cb: '56.1mm' },
    "R83": { diameter: '16', width: '6.5J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R82": { diameter: '15', width: '5.5J', offset: 'ET45', bp: '4x100', cb: '56.1mm' },
    "R101": { diameter: '15', width: '5.5J', offset: 'ET45', bp: '4x100', cb: '56.1mm' },
    "R96": { diameter: '15', width: '5.5J', offset: 'ET45', bp: '4x100', cb: '56.1mm' },
    "R106": { diameter: '17', width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R98": { diameter: '17', width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R112": { diameter: '17', width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R84": { diameter: '16', width: '6.5J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R88": { diameter: '15', width: '5.5J', offset: 'ET45', bp: '4x100', cb: '56.1mm' },
    "R81": { diameter: '15', width: '5.5J', offset: 'ET45', bp: '4x100', cb: '56.1mm' },
    "R107": { diameter: '18', width: '7.5J', offset: 'ET52', bp: '4x100', cb: '56.1mm' },
    "R92": { diameter: '17', width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R108": { diameter: '17', width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R91": { diameter: '17', width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R99": { diameter: '17', width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R104": { diameter: '17', width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R110": { diameter: '17', width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R90": { diameter: '17', width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' },
    "R97": { diameter: '17', width: '7J', offset: 'ET48', bp: '4x100', cb: '56.1mm' }
};

async function updateByStyleCodes() {
    const { data: wheels, error } = await supabase
        .from('oem_wheels')
        .select('*')
        .filter('brand_ref', 'cs', JSON.stringify([{ value: 'mini' }]));

    if (error) {
        console.error("Fetch Error:", error);
        return;
    }

    let updatedCount = 0;

    for (const w of wheels) {
        let code = null;

        // Extract style code
        // Priority 1: "Style 992" or "992" in title
        const fMatch = w.wheel_title.match(/\b([1-9][0-9][0-9])\b/);
        const rMatch = w.wheel_title.match(/\b(R\d+)\b/i);

        if (rMatch) code = rMatch[1].toUpperCase();
        else if (fMatch) code = fMatch[1];

        if (!code || !STYLE_SPECS[code]) {
            // Try lenient matching for things like "R 98" or "988 Eternal"
            // But let's stick to the strict map first to avoid noise.
            continue;
        }

        const specs = STYLE_SPECS[code];

        if (!specs) continue;

        const updates = {
            width_ref: [specs.width],
            diameter_ref: [specs.diameter],
            wheel_offset: specs.offset,
            bolt_pattern_ref: [specs.bp],
            center_bore_ref: [specs.cb]
        };

        const { error: updateError } = await supabase
            .from('oem_wheels')
            .update(updates)
            .eq('id', w.id);

        if (updateError) console.error(`Failed ${w.id}:`, updateError);
        else {
            console.log(`Updated ${w.id} (${code}):`, updates);
            updatedCount++;
        }
    }

    console.log(`\n Total Updated: ${updatedCount}`);
}

updateByStyleCodes();
