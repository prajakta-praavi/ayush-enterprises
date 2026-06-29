export type ContactPerson = {
  name: string;
  phone: string;
  phoneDigits: string;
};

export type Brand = {
  name: string;
  category: string;
  summary: string;
  details: string[];
};

export type ServiceSection = {
  title: string;
  description: string;
  items: string[];
};

export type MiscProduct = {
  name: string;
  summary: string;
  useCase: string;
};

export type CoreVertical = {
  title: string;
  points: string[];
};

export const company = {
  name: "AAYUSH ENTERPRISES",
  tagline: "PROTECTING LIVES",
  website: "www.aayushenterprises.in",
  established: 2017,
  headquarters:
    "Plot No. NBD/3, Matoshree, New Balaji Nagar, Aurangabad. Pin: 431005",
  manufacturingSites: [
    "Pune Nagar Road, Opp. HDFC Bank, Koregaon Bhima, Tal. Shiuru, Dist. Pune - 412216",
    "ROOGNTA Shopping Hub, Shop No. 4039, Kamod Nagar, Indira Nagar, Nashik, Maharashtra 422009",
  ],
  branchOffices: ["Indore (M.P.)","Mumbai (M.H.)", "Pune (M.H.)", "Nasik (M.H.)", "Chandigarh (P.B.)"],
};

export const contactPersons: ContactPerson[] = [
  {
    name: "",
    phone: "+91 7420846602",
    phoneDigits: "917420846602",
  },
  {
    name: "",
    phone: "+91 8160647924",
    phoneDigits: "918160647924",
  },
  {
    name: "",
    phone: "+91 9423834722",
    phoneDigits: "919423834722",
  },
];

export const emails = [
  "sales@aayushenterprises.in",
  "signages@aayushenterprises.in",
  "ayushenterprisesaurangabad@gmail.com",
];

export const coreVerticals: CoreVertical[] = [
  {
    title: "Our Expertise Solutions",
    points: [
      "End-to-end planning, sourcing, and installation support.",
      "Complete setup and handover for site-wide safety needs.",
      "Single-point execution from planning to completion.",
      "Customised tailormade solutions as per customer needs and expectations.",
    ],
  },
  {
    title: "Capability Building",
    points: [
      "The Reality Check: Skills Gap Analysis.",
      "Mapping Core Competencies.",
      "Measuring Strategic ROI.",
      "The Blended Learning Model.",
    ],
  },
  {
    title: "System Installations",
    points: [
      " Fire safety systems, gas detection, and public announcement solutions.",
      " Support for LOTO and industrial safety system setup.",
      " Made for factory safety and utility operations.",
    ],
  },
  {
    title: "Car Hire Services",
    points: [
      "Customized solutions for your trip with the safest commute.",
      "Special focus towards woman and child safety.",
      "Clean and hygienic vehicles.",
      "Highly trained and experienced chauffeurs.",
    ],
  },
  {
    title: "Consulting Services",
    points: [
      "Enterprise Risk Management.",
      "ESG Audits and compliance including NGRBC / BRSR / RBA Requirements.",
      "Different studies such as Electrical audits & Allied services.",
    ],
  },
];

export const companyValues = [
  "Safety of Employee & Product",
  "Quality of Product & Services Offered",
  "Integrity & Respect",
  "Customer Satisfaction",
  "Continuous Improvement System",
  "Teamwork with Flexible & Agile ways to Handle all Complexities",
];

export const brochureHighlights = [
  {
    label: "Established Since",
    value: "2017",
  },
  {
    label: "Branch Offices",
    value: "3",
  },
  {
    label: "Core Verticals",
    value: "5",
  },
  {
    label: "Business Focus",
    value: "Complete Safety Solutions",
  },
];

export const serviceSections: ServiceSection[] = [
  {
    title: "Various Trainings",
    description: "Training programs delivered from a pool of experts.",
    items: [
      "Safety Fundamental Activities Training",
      "Forklift Safe Driving & Maintenance Training",
      "Lockout / Tag Out Systems",
      "MSDS & Handling Standards Training",
      "KY (Danger Prediction) Training",
      "Risk Assessment Training",
      "5S Training",
      "OSHAS & ISO Internal Auditor Training",
      "Work Standards / Instructions Training",
      "Mock Drill Training (Tabletop & Actual Exercises)",
      "Height Job Simulation Trainings",
      "PPE Trainings",
      "Safety Simulation Training",
      "BSC Awareness Training",
      "Behavior Based Safety (SUSA) Training",
      "Accident Investigation Training",
      "Fire Fighting Trainings",
    ],
  },
  {
    title: "Consulting Services",
    description: "Enterprise risk management, ESG compliance and electrical audit support.",
    items: [
      "Enterprise Risk Management",
      "ESG Audits and compliance including NGRBC / BRSR / RBA Requirements",
      "Different studies such as Electrical audits & Allied services",
    ],
  },
  {
    title: "Digital Printing",
    description: "Industrial signage and branded print solutions.",
    items: [
      "Signages required across Industries",
      "Offset Printing",
      "Color Printing",
      "Print on Tissues / Mugs / Articles etc.",
    ],
  },
  {
    title: "Car Hire",
    description: "Flexible car hire support for business travel, site visits and employee movement.",
    items: [
      "Customized solutions for your trip with the safest commute",
      "Special focus towards woman and child safety",
      "Clean and hygienic vehicles",
      "Highly trained and experienced chauffeurs",
    ],
  },
  {
    title: "Complete System Installations",
    description: "Safety systems, fire systems and utilities installation support.",
    items: [
      "Marking of Pipelines based on NFPA / NBC Standards",
      "LOTO System Implementation for the Site",
      "Public Address System Installation & Maintenance",
      "Fixed Gas Detection System for Confined Spaces & High Risk Areas",
      "Cloud Based Online Systems of Work Permits / LOTO Etc.",
      "Installation and Maintenance of Electrical / AHU / Chiller / UPS Systems",
      "Fire Fighting System Installation & Maintenance",
      "Fire Hydrant System",
      "Fire Sprinkler System",
      "Fire Alarm System",
      "Auto / Manual Flooding Systems",
    ],
  },
];

export const brands: Brand[] = [
  {
    name: "JONESCO - UK",
    category: "Environmental Protection",
    summary: "Spill pallets, drum handling and workplace environmental protection products.",
    details: ["Spill Pallets: 1 Drum / 2 Drum / 4 Drum / Work Floor", "Drum Kart, Spill Shack, Drum Rack, IBC Lab Trays"],
  },
  {
    name: "MALLCOM INDIA LTD.",
    category: "PPE",
    summary: "Feet and hand protection range for industrial workers.",
    details: ["Safety Shoes", "Leg Guard (TIGER BRAND)", "Hand Gloves", "Arm Sleeve"],
  },
  {
    name: "ANTI SKID ADHESIVE TAPE",
    category: "Road Safety",
    summary: "Anti-slip tapes for stairs and slippery surfaces.",
    details: ["Suitable for Staircase and slippery areas", "Nightglow variant useful in case of blackout"],
  },
  {
    name: "KNUFFI - GERMANY",
    category: "Environmental Protection",
    summary: "Corner, bump and surface protection for constrained locations.",
    details: ["Corner Protection / Bump Protection / Edge Protection / Surface Protection / Pipe Protection", "Free survey service from an expert with 7 years of MNC safety experience"],
  },
  {
    name: "PROBAN - ARVIND MILL",
    category: "Protective Workwear",
    summary: "Flame-retardant garments for high heat and fire team use.",
    details: ["Shirt / Pant / Jacket / Trouser / Coverall in Cotton Rich or Denim material", "Lifetime flame-retardant properties", "Customizable with logo and reflective strips", "Compliant with ISO 11612, ISO 11611, ISO 14116, NFPA 2112 & 70E"],
  },
  {
    name: "ESP - UK",
    category: "Environmental Protection",
    summary: "Oil and chemical sorbents for spill response.",
    details: ["Pads, Rolls, Socks, Booms", "Pillows and Kits: 10, 15, 30, 50, 120, 240 & 360 Liters"],
  },
  {
    name: "COTRAN - China",
    category: "Electrical Safety",
    summary: "Self-fusing and fireproof tapes for busbar insulation.",
    details: ["LT / HT self fusing tape", "FireProofing tape", "Silicon tape for busbar insulation"],
  },
  {
    name: "BIG WIPES - UK",
    category: "Maintenance",
    summary: "Industrial hand cleaner for fast clean-up on site.",
    details: ["Hand Cleaner"],
  },
  {
    name: "ANSELL",
    category: "PPE",
    summary: "Hand protection solutions for hazardous industrial environments.",
    details: ["Hand Protection for Mechanical, Chemical, Electrical, Thermal applications", "Disposable range for Life Science and Food: Sterile & Non Sterile"],
  },
  {
    name: "DRÄGER",
    category: "Gas Detection & Respiratory",
    summary: "Portable and fixed gas detection plus respiratory protection systems.",
    details: ["Gas Detectors: Portable and Fixed Type, Drager Tubes", "Half and Full Face Masks, Breathing Apparatus Sets, Escape Sets, PAPR, Air Line Apparatus"],
  },
  {
    name: "ALLEGRO INDUSTRIES",
    category: "Confined Space",
    summary: "Blower and confined space access solutions.",
    details: ["Blower and Confined Space Solutions"],
  },
  {
    name: "LESLICO",
    category: "PPE",
    summary: "Head, eye, hearing and height access safety products.",
    details: ["Safety Helmets", "Face Shield", "Goggles", "Muffs", "Plug", "Mask", "Roof Top Safety Ladders", "Rope Ladders etc."],
  },
  {
    name: "KARAM",
    category: "PPE & Height Safety",
    summary: "India's leading PPE and height safety manufacturer.",
    details: ["Helmets, Safety Glasses, Ear Protection, Safety Shoes, Harnesses, Fall Arresters etc.", "Vertical and Horizontal Life Line System for Anchoring"],
  },
  {
    name: "UVEX",
    category: "PPE",
    summary: "Eye wear and hearing protection products.",
    details: ["Eye Wear", "Hearing Protection"],
  },
  {
    name: "SALISBURY by Honeywell",
    category: "Electrical Safety",
    summary: "World-leading electrical safety PPE range.",
    details: ["Electrical Safety PPE"],
  },
  {
    name: "LOTO E-SQUARE",
    category: "Lockout / Tagout",
    summary: "Lockout tagout products and road safety items.",
    details: ["Lockout Tagout Products", "Road Safety Items"],
  },
  {
    name: "MICROGARD",
    category: "Body Protection",
    summary: "Dust and chemical body protection including pressure suits.",
    details: ["Body Protection against Dust & Chemical", "Pressure Suits etc."],
  },
  {
    name: "LIBERTY",
    category: "Foot Protection",
    summary: "Safety shoes with PU and nitrile sole options.",
    details: ["Safety Shoes", "PU Sole", "Nitrile Sole"],
  },
  {
    name: "GLO-LITE",
    category: "Signage",
    summary: "Photoluminescent signage, tapes, posters, stickers and tags.",
    details: ["Photoluminescent Signages", "Tapes and Posters", "Stickers & Tags"],
  },
  {
    name: "NEWAGE",
    category: "Fire Safety",
    summary: "Fire hoses and hydrant fittings for fixed fire systems.",
    details: ["Fire Hoses", "Fire Hydrant Fittings"],
  },
  {
    name: "ESAFE",
    category: "Access & Earthing",
    summary: "FRP ladders and discharge rods for industrial safety.",
    details: ["Manufacturer of FRP Ladders and Discharge Rods"],
  },
  {
    name: "ASKA",
    category: "Safety",
    summary: "Safety brand represented in the brochure range.",
    details: ["Safety brand - display in brands section"],
  },
  {
    name: "JUSTRITE",
    category: "Safety",
    summary: "Safety brand represented in the brochure range.",
    details: ["Safety brand - display in brands section"],
  },
  {
    name: "HONEYWELL",
    category: "Safety",
    summary: "Safety brand represented in the brochure range.",
    details: ["Safety brand - display in brands section"],
  },
];

export const brandCategories = [
  "All",
  "PPE",
  "PPE & Height Safety",
  "Environmental Protection",
  "Fire Safety",
  "Gas Detection & Respiratory",
  "Electrical Safety",
  "Lockout / Tagout",
  "Road Safety",
  "Confined Space",
  "Body Protection",
  "Foot Protection",
  "Signage",
  "Maintenance",
  "Access & Earthing",
  "Safety",
  "Protective Workwear",
];

export const miscProducts: MiscProduct[] = [
  {
    name: "First Aid Items",
    summary: "Site-ready first aid supplies for emergency response.",
    useCase: "Factory floors, warehouses and project sites",
  },
  {
    name: "Pressure Suits",
    summary: "Body protection for specialized chemical and pressure-risk environments.",
    useCase: "Chemical plants and high-risk maintenance work",
  },
  {
    name: "Photoluminescent Signages",
    summary: "Glow-in-the-dark safety signs for visibility during low light or blackout conditions.",
    useCase: "Escape routes, evacuation planning and emergency guidance",
  },
  {
    name: "FRP Ladders",
    summary: "Non-conductive ladders for electrical and industrial maintenance access.",
    useCase: "Electrical rooms, utility corridors and plant access",
  },
  {
    name: "Fire Hydrant Fittings",
    summary: "Reliable fire system fittings to support hydrant infrastructure.",
    useCase: "Fire water network and hydrant line installation",
  },
];
