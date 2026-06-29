import helmet from "@/assets/product-helmet.jpg";
import gloves from "@/assets/product-gloves.jpg";
import shoes from "@/assets/product-shoes.jpg";
import jacket from "@/assets/product-jacket.jpg";
import ppe from "@/assets/product-ppe.jpg";
import goggles from "@/assets/product-goggles.jpg";

export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  shortDesc: string;
  description: string;
  specs: { label: string; value: string }[];
};

export const categories = [
  "All",
  "Head Protection",
  "Hand Protection",
  "Foot Protection",
  "Protective Clothing",
  "PPE Kits",
  "Eye Protection",
  "Respiratory Protection",
];

export const products: Product[] = [
  {
    id: "industrial-safety-helmet",
    name: "Industrial Safety Helmet",
    category: "Head Protection",
    image: helmet,
    shortDesc: "ABS shell with 6-point suspension for industrial sites.",
    description:
      "Heavy-duty industrial helmet suited for construction, fabrication and maintenance work. Designed for all-day comfort with a 6-point textile suspension and rapid ratchet harness.",
    specs: [
      { label: "Material", value: "High-density ABS" },
      { label: "Standard", value: "IS 2925 / ANSI Z89.1" },
      { label: "Suspension", value: "6-point ratchet" },
      { label: "Color", value: "Hi-Vis Yellow" },
    ],
  },
  {
    id: "industrial-hand-gloves",
    name: "Industrial Hand Gloves",
    category: "Hand Protection",
    image: gloves,
    shortDesc: "Grip-focused gloves for mechanical and general protection.",
    description:
      "Work gloves for handling, assembly and general industrial activity. Comfortable fit with palm grip that supports mechanical and maintenance work.",
    specs: [
      { label: "Use", value: "Mechanical, maintenance" },
      { label: "Grip", value: "Palm-coated finish" },
      { label: "Sizes", value: "S / M / L / XL" },
      { label: "Protection", value: "General industrial handling" },
    ],
  },
  {
    id: "safety-shoes",
    name: "Safety Shoes",
    category: "Foot Protection",
    image: shoes,
    shortDesc: "Slip-resistant shoes for workplace protection.",
    description:
      "Industrial safety shoes for site, factory and warehouse applications. Built for dependable foot protection, grip and all-day wear comfort.",
    specs: [
      { label: "Sole", value: "PU / Nitrile options" },
      { label: "Standard", value: "Industrial safety footwear" },
      { label: "Toe Cap", value: "Impact-resistant" },
      { label: "Use", value: "General industrial use" },
    ],
  },
  {
    id: "reflective-safety-jacket",
    name: "Reflective Safety Jacket",
    category: "Protective Clothing",
    image: jacket,
    shortDesc: "High-visibility jacket for road and site work.",
    description:
      "Reflective jacket for road work, traffic control, warehouse movement and construction sites. Lightweight, visible and designed for day and night use.",
    specs: [
      { label: "Visibility", value: "Fluorescent with reflective tape" },
      { label: "Fabric", value: "Lightweight polyester" },
      { label: "Use", value: "Road and site safety" },
      { label: "Closure", value: "Zip front" },
    ],
  },
  {
    id: "complete-ppe-kit",
    name: "Complete PPE Safety Kit",
    category: "PPE Kits",
    image: ppe,
    shortDesc: "Head-to-toe protection bundle for work sites.",
    description:
      "Comprehensive PPE kit including helmet, eye protection, hearing protection, gloves, dust mask and visibility wear for complete on-site protection.",
    specs: [
      { label: "Includes", value: "6 protection items" },
      { label: "Use", value: "Construction, factories" },
      { label: "Packaging", value: "Reusable carry bag" },
      { label: "Customizable", value: "Yes - bulk orders" },
    ],
  },
  {
    id: "safety-goggles",
    name: "Safety Goggles",
    category: "Eye Protection",
    image: goggles,
    shortDesc: "Eye protection for dust, splash and debris.",
    description:
      "Wide-vision goggles for dust, splash and debris protection. Designed for industrial use with comfortable sealing and a secure fit.",
    specs: [
      { label: "Lens", value: "Polycarbonate" },
      { label: "Protection", value: "Dust, splash and debris" },
      { label: "Fit", value: "Adjustable strap" },
      { label: "Use", value: "Industrial eye protection" },
    ],
  },
  {
    id: "respiratory-protection-kit",
    name: "Respiratory Protection Kit",
    category: "Respiratory Protection",
    image: ppe,
    shortDesc: "Respiratory gear for dust and vapour exposure.",
    description:
      "Respiratory protection for dusty, chemical and high-risk industrial work areas. Suitable for site-level protection and controlled access environments.",
    specs: [
      { label: "Type", value: "Half / full face options" },
      { label: "Use", value: "Dust and vapour exposure" },
      { label: "Compatibility", value: "PAPR and filters" },
      { label: "Application", value: "Industrial safety" },
    ],
  },
];

