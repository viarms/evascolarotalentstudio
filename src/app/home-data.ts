// src/app/home-data.ts
// Static data for the homepage — imported by both HomeClient (client) and
// page.tsx (server) without pulling in any browser-only dependencies.

// ─── Timetable mock / fallback data ──────────────────────────────────────────

export const MOCK_SCHEDULE: Record<string, { day: string; name: string; time: string; coach: string }[]> = {
  "Sanur Studio": [
    { day: "Monday",    name: "TOTS HIPHOP",          time: "14:30–15:15", coach: "Novie"  },
    { day: "Monday",    name: "JUNIOR HIPHOP",         time: "15:30–16:30", coach: "Novie"  },
    { day: "Monday",    name: "JUNIOR KPOP",           time: "16:30–17:30", coach: "Faith"  },
    { day: "Monday",    name: "TEEN HIPHOP",           time: "16:30–17:30", coach: "Novie"  },
    { day: "Monday",    name: "TEEN KPOP",             time: "17:30–18:30", coach: "Faith"  },
    { day: "Tuesday",   name: "TOTS BALLET 1",         time: "15:00–15:45", coach: "Vivian" },
    { day: "Tuesday",   name: "TOTS BALLET 2",         time: "15:45–16:30", coach: "Vivian" },
    { day: "Tuesday",   name: "JUNIOR TEEN BALLET",    time: "16:30–17:30", coach: "Vivian" },
    { day: "Wednesday", name: "TOTS JAZZ DANCE",       time: "15:00–15:45", coach: "Putri"  },
    { day: "Wednesday", name: "JUNIOR JAZZ DANCE",     time: "15:45–16:45", coach: "Putri"  },
    { day: "Wednesday", name: "TEEN DRAMA",            time: "16:45–17:45", coach: "Andini" },
    { day: "Thursday",  name: "TOTS HIPHOP",           time: "14:30–15:15", coach: "Faith"  },
    { day: "Thursday",  name: "JUNIOR HIPHOP",         time: "15:30–16:30", coach: "Faith"  },
    { day: "Thursday",  name: "TEEN HIPHOP",           time: "16:30–17:30", coach: "Faith"  },
    { day: "Thursday",  name: "JUNIOR DRAMA",          time: "16:30–17:30", coach: "Andini" },
    { day: "Friday",    name: "TOTS SINGING",          time: "14:30–15:15", coach: "Kuna"   },
    { day: "Friday",    name: "TEEN MODELING",         time: "15:30–16:30", coach: "Cintya" },
    { day: "Friday",    name: "JUNIOR SINGING",        time: "15:30–16:30", coach: "Kuna"   },
    { day: "Friday",    name: "JUNIOR TOTS MODELING",  time: "16:30–17:30", coach: "Cintya" },
    { day: "Friday",    name: "TEEN SINGING",          time: "16:30–17:30", coach: "Kuna"   },
  ],
  "Canggu Studio": [
    { day: "Monday",    name: "TOTS SINGING 1",            time: "15:15–16:00", coach: "Kuna"   },
    { day: "Monday",    name: "TOTS SINGING 2",            time: "16:00–16:45", coach: "Kuna"   },
    { day: "Monday",    name: "JUNIOR SINGING",            time: "16:45–17:45", coach: "Kuna"   },
    { day: "Monday",    name: "TEEN SINGING",              time: "17:45–18:45", coach: "Andini" },
    { day: "Tuesday",   name: "TOTS HIPHOP",               time: "15:30–16:15", coach: "Tya"    },
    { day: "Tuesday",   name: "JAZZ DANCE",                time: "16:15–17:15", coach: "Putri"  },
    { day: "Tuesday",   name: "KPOP DANCE",                time: "17:30–18:30", coach: "Faith"  },
    { day: "Wednesday", name: "JUNIOR HIPHOP",             time: "15:30–16:30", coach: "Novie"  },
    { day: "Wednesday", name: "JUNIOR TEEN HIPHOP",        time: "16:30–17:30", coach: "Novie"  },
    { day: "Thursday",  name: "TOTS MODELING",             time: "14:30–15:15", coach: "Cintya" },
    { day: "Thursday",  name: "TOTS HIPHOP",               time: "15:30–16:15", coach: "Tya"    },
    { day: "Thursday",  name: "MUSICAL THEATRE",           time: "16:15–17:15", coach: "Putri"  },
    { day: "Thursday",  name: "JUNIOR TEEN MODELING",      time: "17:30–18:30", coach: "Cintya" },
    { day: "Friday",    name: "TOTS BALLET",               time: "15:30–16:15", coach: "Rahma"  },
    { day: "Friday",    name: "JUNIOR BALLET",             time: "16:15–17:15", coach: "Rahma"  },
    { day: "Friday",    name: "JUNIOR TEEN DRAMA",         time: "17:30–18:30", coach: "Andini" },
    { day: "Saturday",  name: "TOTS BALLET",               time: "10:00–10:45", coach: "Rahma"  },
    { day: "Saturday",  name: "JUNIOR BALLET",             time: "11:00–12:00", coach: "Rahma"  },
    { day: "Saturday",  name: "TOTS HIPHOP",               time: "12:00–12:45", coach: "Faith"  },
    { day: "Saturday",  name: "JUNIOR TEEN BREAKDANCE",    time: "13:00–14:00", coach: "Faith"  },
  ],
  "AIS School CCAs": [
    { day: "Tuesday",  name: "TOTS & JUNIOR KPOP",            time: "14:45–15:30", coach: "Yuda"   },
    { day: "Tuesday",  name: "JUNIOR & TEENS DRAMA",          time: "14:45–15:45", coach: "Andini" },
    { day: "Tuesday",  name: "JUNIOR+ KPOP",                  time: "15:30–16:30", coach: "Yuda"   },
    { day: "Thursday", name: "TOTS & JUNIOR SINGING",         time: "14:45–15:30", coach: "Kuna"   },
    { day: "Thursday", name: "JUNIOR+ SINGING",               time: "14:45–15:45", coach: "Kuna"   },
    { day: "Friday",   name: "TOTS & JUNIOR MUSICAL THEATRE", time: "14:45–15:30", coach: "Putri"  },
    { day: "Friday",   name: "TOTS & JUNIOR HIPHOP",          time: "14:45–15:30", coach: "Faith"  },
    { day: "Friday",   name: "JUNIOR+ MUSICAL THEATRE",       time: "14:45–15:45", coach: "Putri"  },
    { day: "Friday",   name: "JUNIOR+ HIPHOP",                time: "14:45–15:45", coach: "Faith"  },
  ],
  "Dyatmika School ECAs": [
    { day: "Monday",    name: "JUNIOR KPOP",           time: "15:00–16:00", coach: "Yuda"   },
    { day: "Tuesday",   name: "JUNIOR HIPHOP",         time: "15:00–16:00", coach: "Faith"  },
    { day: "Wednesday", name: "TEENS PUBLIC SPEAKING", time: "15:00–16:00", coach: "Andini" },
    { day: "Friday",    name: "TEENS MODELING",        time: "15:00–16:00", coach: "Aura"   },
  ],
  "Toki Hub": [
    { day: "Wednesday", name: "TOTS JUNIOR KPOP",    time: "15:00–16:00", coach: "Faith"    },
    { day: "Wednesday", name: "TOTS JUNIOR SINGING", time: "16:00–17:00", coach: "Kuna"     },
    { day: "Friday",    name: "TOTS JUNIOR HIPHOP",  time: "16:00–17:00", coach: "Saul"     },
    { day: "Saturday",  name: "TOTS JUNIOR BALLET",  time: "16:00–17:00", coach: "Vallerie" },
  ],
};

// Location order for timetable tabs — matches HOMEPAGE_LOCATION_ORDER in classQueries.ts
export const LOCATION_ORDER = ["Sanur Studio", "Canggu Studio", "AIS School CCAs", "Dyatmika School ECAs"];

export const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ─── Pricing packs ────────────────────────────────────────────────────────────

export const PACKS = [
  {
    name: "Pack 1",
    price: "180K",
    features: ["10 classes / 1 style", "Uniform T-Shirt"],
  },
  {
    name: "Pack 2",
    price: "140K",
    features: ["20 classes / 2 style", "Uniform T-Shirt or Uniform Tutu Ballet"],
  },
  {
    name: "Pack 3",
    price: "110K",
    features: ["30 classes / 3 style", "Tutu + Shoes + Scrunchie + T-Shirt or Leotard + Shortpants + Tshirt"],
  },
];

// ─── Slideshow photos ─────────────────────────────────────────────────────────

export const ABOUT_SLIDES = [
  "/slideshow/evascolarotalentstudio.webp",
  "/slideshow/ballet-tots.webp",
  "/slideshow/drama-musical-theatre.webp",
  "/slideshow/hiphop-junior.webp",
  "/slideshow/jazz-dance.webp",
  "/slideshow/kpop-teen.webp",
  "/slideshow/modeling-junior.webp",
  "/slideshow/singing-junior.webp",
  "/slideshow/singing-teen.webp",
  "/slideshow/singing-tots.webp",
];
