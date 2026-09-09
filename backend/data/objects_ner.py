"""
Culturally familiar object catalog tailored for elderly dementia patients,
with regional items from the North Eastern Region (NER) and everyday familiar objects.

Each item includes:
- id: unique identifier
- label: clear readable English name
- regional_label: local / NER familiar name
- category: visual/semantic category
- emoji: accessible visual symbol
- icon_color: high contrast accent color
- similarity_group: cluster ID for visually/semantically similar items (used in higher difficulty levels)
- visual_distinctiveness: 'high' (easy to tell apart) or 'moderate'/'similar'
"""

CULTURAL_OBJECTS = [
    # --- Everyday Familiar & Distinct (Ideal for Level 1) ---
    {
        "id": "assam_tea_cup",
        "label": "Tea Cup",
        "regional_label": "Chah Cup (Assam Tea)",
        "category": "kitchen",
        "emoji": "☕",
        "icon_color": "#D97706",
        "similarity_group": "vessels",
        "visual_distinctiveness": "high"
    },
    {
        "id": "gamusa_shawl",
        "label": "Traditional Towel / Gamusa",
        "regional_label": "Gamosa / Gamusa",
        "category": "textile",
        "emoji": "🧣",
        "icon_color": "#DC2626",
        "similarity_group": "textiles",
        "visual_distinctiveness": "high"
    },
    {
        "id": "clay_lantern",
        "label": "Clay Lantern / Diya",
        "regional_label": "Chaki / Diya",
        "category": "household",
        "emoji": "🪔",
        "icon_color": "#F59E0B",
        "similarity_group": "light",
        "visual_distinctiveness": "high"
    },
    {
        "id": "temple_bell",
        "label": "Brass Bell",
        "regional_label": "Ghyanta / Bell",
        "category": "household",
        "emoji": "🔔",
        "icon_color": "#EAB308",
        "similarity_group": "metal",
        "visual_distinctiveness": "high"
    },
    {
        "id": "marigold_flower",
        "label": "Marigold Flower",
        "regional_label": "Gendha Phool",
        "category": "nature",
        "emoji": "🌼",
        "icon_color": "#F97316",
        "similarity_group": "nature",
        "visual_distinctiveness": "high"
    },
    {
        "id": "banana_leaf",
        "label": "Banana Leaf",
        "regional_label": "Kola Paat",
        "category": "nature",
        "emoji": "🍃",
        "icon_color": "#16A34A",
        "similarity_group": "nature",
        "visual_distinctiveness": "high"
    },

    # --- Craft, Bamboo & Musical Items (Level 2 & 3) ---
    {
        "id": "jaapi_hat",
        "label": "Bamboo Sun Hat / Jaapi",
        "regional_label": "Assamese Jaapi",
        "category": "craft",
        "emoji": "👒",
        "icon_color": "#CA8A04",
        "similarity_group": "bamboo",
        "visual_distinctiveness": "moderate"
    },
    {
        "id": "bamboo_basket",
        "label": "Bamboo Basket",
        "regional_label": "Dala / Khang",
        "category": "craft",
        "emoji": "🧺",
        "icon_color": "#A16207",
        "similarity_group": "bamboo",
        "visual_distinctiveness": "moderate"
    },
    {
        "id": "bamboo_flute",
        "label": "Bamboo Flute",
        "regional_label": "Bahi / Flute",
        "category": "music",
        "emoji": "🪈",
        "icon_color": "#854D0E",
        "similarity_group": "bamboo",
        "visual_distinctiveness": "moderate"
    },
    {
        "id": "dhol_drum",
        "label": "Folk Drum / Dhol",
        "regional_label": "Bihu Dhol",
        "category": "music",
        "emoji": "🥁",
        "icon_color": "#B91C1C",
        "similarity_group": "music",
        "visual_distinctiveness": "moderate"
    },
    {
        "id": "brass_water_jug",
        "label": "Brass Water Jug",
        "regional_label": "Kalah / Lota",
        "category": "kitchen",
        "emoji": "🫖",
        "icon_color": "#D97706",
        "similarity_group": "vessels",
        "visual_distinctiveness": "moderate"
    },
    {
        "id": "betel_nut_plate",
        "label": "Betel Nut & Leaf (Tamul)",
        "regional_label": "Tamul Paan / Bota",
        "category": "culture",
        "emoji": "🌿",
        "icon_color": "#15803D",
        "similarity_group": "nature",
        "visual_distinctiveness": "moderate"
    },

    # --- Visually / Semantically Similar Pairs (Level 3 & 4 challenges) ---
    {
        "id": "woven_muga_scarf",
        "label": "Golden Silk Scarf",
        "regional_label": "Muga Silk Chador",
        "category": "textile",
        "emoji": "🧣",
        "icon_color": "#EAB308",
        "similarity_group": "textiles",
        "visual_distinctiveness": "similar"
    },
    {
        "id": "clay_water_pot",
        "label": "Clay Water Pot",
        "regional_label": "Matir Patra",
        "category": "kitchen",
        "emoji": "🏺",
        "icon_color": "#B45309",
        "similarity_group": "vessels",
        "visual_distinctiveness": "similar"
    },
    {
        "id": "wooden_mortar",
        "label": "Wooden Mortar & Pestle",
        "regional_label": "Ural / Dhenki Hand",
        "category": "kitchen",
        "emoji": "🪵",
        "icon_color": "#78350F",
        "similarity_group": "wood",
        "visual_distinctiveness": "similar"
    },
    {
        "id": "bamboo_hand_fan",
        "label": "Handwoven Bamboo Fan",
        "regional_label": "Bisoni",
        "category": "craft",
        "emoji": "🪭",
        "icon_color": "#65A30D",
        "similarity_group": "bamboo",
        "visual_distinctiveness": "similar"
    },
    {
        "id": "handheld_mirror",
        "label": "Looking Glass / Mirror",
        "regional_label": "Ayna",
        "category": "household",
        "emoji": "🪞",
        "icon_color": "#38BDF8",
        "similarity_group": "metal",
        "visual_distinctiveness": "high"
    },
    {
        "id": "umbrella",
        "label": "Walking Umbrella",
        "regional_label": "Chhata",
        "category": "household",
        "emoji": "☂️",
        "icon_color": "#4F46E5",
        "similarity_group": "tools",
        "visual_distinctiveness": "high"
    },
    {
        "id": "reading_glasses",
        "label": "Reading Glasses",
        "regional_label": "Choshma",
        "category": "personal",
        "emoji": "👓",
        "icon_color": "#0284C7",
        "similarity_group": "tools",
        "visual_distinctiveness": "high"
    },
    {
        "id": "house_key",
        "label": "Brass House Key",
        "regional_label": "Chabi",
        "category": "personal",
        "emoji": "🔑",
        "icon_color": "#CA8A04",
        "similarity_group": "tools",
        "visual_distinctiveness": "high"
    }
]

# Difficulty configuration parameters
LEVEL_CONFIG = {
    1: {
        "level": 1,
        "name": "Gentle Introduction",
        "objects_count": 4,
        "viewing_seconds": 5,
        "distractors_count": 4, # total selection pool = 8
        "preferred_distinctiveness": ["high"],
        "description": "4 familiar objects, 5 seconds viewing time, visually distinct items."
    },
    2: {
        "level": 2,
        "name": "Comfortable Recall",
        "objects_count": 6,
        "viewing_seconds": 5,
        "distractors_count": 4, # total selection pool = 10
        "preferred_distinctiveness": ["high", "moderate"],
        "description": "6 familiar objects, 5 seconds viewing time."
    },
    3: {
        "level": 3,
        "name": "Focused Challenge",
        "objects_count": 8,
        "viewing_seconds": 4,
        "distractors_count": 4, # total selection pool = 12
        "preferred_distinctiveness": ["moderate", "similar"],
        "description": "8 objects, 4 seconds viewing time, includes visually similar regional crafts."
    },
    4: {
        "level": 4,
        "name": "Advanced Memory Exercise",
        "objects_count": 10,
        "viewing_seconds": 3,
        "distractors_count": 5, # total selection pool = 15
        "preferred_distinctiveness": ["moderate", "similar", "high"],
        "description": "10 objects, 3 seconds viewing time, more challenging selection set."
    }
}
