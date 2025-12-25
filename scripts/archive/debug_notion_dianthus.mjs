import { createClient } from '@supabase/supabase-js';

const NOTION_TOKEN = "ntn_v62415588612NuNtbkFV65XeTNKuJedxvXY42JSUmzr7QX";
const NOTION_DB_ID = "1b417406-a14d-81cd-97bb-f544af38ecf1";

async function main() {
    console.log("Checking Dianthus wheel in Notion...");

    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
            filter: {
                property: "Wheel Name",
                title: { contains: "Cassiopeia" }
            },
            page_size: 1
        })
    });

    const data = await response.json();
    if (data.results.length > 0) {
        const props = data.results[0].properties;
        console.log("Full Props Dump:", JSON.stringify(props, null, 2));
    } else {
        console.log("Wheel not found");
    }
}

main().catch(console.error);
