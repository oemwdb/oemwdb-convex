# OEMWDB Agent Rules

## private_blurb Field Usage

The `private_blurb` field serves as an **inter-agent context handoff** for each item (brand, vehicle, or wheel). When working on an item, agents MUST:

1. **Read the existing `private_blurb`** to understand prior work, known issues, or pending tasks
2. **Update the field** with relevant status notes, data quality flags, or context that future agents need

### Example Content:
```
Last audited: 2024-12-24 | Specs verified via alloywheelsdirect.net
Missing: good_pic_url upgrade needed
Note: Part numbers include color variants - verified against BMW catalog
```

### Purpose:
This creates persistent context that survives across separate AI sessions, enabling continuity without requiring full re-investigation of each item's history.
