import { createClient } from '@supabase/supabase-js';

const NOTION_TOKEN = "ntn_v62415588612NuNtbkFV65XeTNKuJedxvXY42JSUmzr7QX";
const NOTION_DB_ID = "1b417406-a14d-81cd-97bb-f544af38ecf1";

async function main() {
    console.log("Checking Ferrari wheels in Notion...");

    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
            filter: {
                property: "Brand Relation",
                rich_text: { contains: "Ferrari" }
            },
            page_size: 5
        })
    });

    const data = await response.json();
    console.log(`Found ${data.results.length} Ferrari wheels (ignoring Status).`);

    if (data.results.length > 0) {
        const w = data.results[0];
        console.log(`Sample: ${w.properties["Wheel Name"]?.title[0]?.plain_text}`);
        console.log(`Status: ${w.properties.Status?.status?.name}`);
    }
}

main().catch(console.error);
