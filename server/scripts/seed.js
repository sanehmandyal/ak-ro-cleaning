import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';
import Service from '../models/Service.js';
import FAQ from '../models/FAQ.js';
import Testimonial from '../models/Testimonial.js';
import Gallery from '../models/Gallery.js';
import SEOSettings, { SEO_PAGES } from '../models/SEOSettings.js';
import WebsiteSettings from '../models/WebsiteSettings.js';
import { slugify } from '../utils/helpers.js';

const RO_SERVICES = [
  {
    title: 'RO Water Purifier Deep Cleaning & Tank Sanitization',
    slug: 'ro-water-purifier-cleaning-and-maintenance',
    icon: 'Waves',
    popular: true,
    price: { amount: 0, unit: '', label: '' },
    image: {
      url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
      publicId: 'ro_sanitization',
    },
    short: 'Complete disassembly, food-grade storage tank descaling, internal biofilm sterilization, and calibrated digital TDS test.',
    desc: 'Even the most advanced RO purifier accumulates invisible bacterial biofilm and microscopic slime inside its dark internal water storage tank over time. Our certified RO Deep Cleaning service dismantles the storage unit, flushes all internal tubing, descales the tank with food-grade non-toxic sanitizing compounds, cleans filter housings, and performs dual raw/purified TDS calibration.',
    benefits: [
      'Food-grade anti-bacterial tank sterilization eliminates stagnant odors and bad taste',
      'Digital TDS meter testing before and after service in front of you',
      'Reverse-flush cleansing of sediment bowls and pipe connectors',
      'Inspection of auto-cut float valve, booster pump pressure, and SMPS electricals',
      'Compatible with Kent, Aquaguard, Pureit, Havells, Livpure, AO Smith, and all top brands',
    ],
    process: [
      { title: '1. Inbound Water & TDS Diagnostic', description: 'Testing input raw water pressure and TDS levels; inspecting membrane rejection efficiency.' },
      { title: '2. Tank Disassembly & Descaling', description: 'Internal storage container is emptied, scrubbed free of slimy biofilm, and sanitized with food-grade compounds.' },
      { title: '3. Filter Housing & Line Flush', description: 'Sediment and carbon bowls are cleaned of heavy silt and line connectors checked for leaks.' },
      { title: '4. Reassembly & Purity Sign-off', description: 'System is reassembled, leak-tested under operating pressure, and final output TDS is verified.' },
    ],
    whyChooseUs: [
      'Certified water hygiene technicians equipped with digital TDS meters',
      '100% food-grade, chemical-free sanitization safe for family drinking water',
      'Transparent diagnosis — zero forced part replacements',
      'Same-day service availability across all sectors',
    ],
    faqs: [
      { question: 'Why does my RO water sometimes taste stale or flat?', answer: 'Stale taste is almost always caused by microbial biofilm accumulating inside the internal storage tank or an exhausted post-carbon cartridge. Our deep clean and disinfection completely restores crisp, natural-tasting water.' },
      { question: 'How often should an RO purifier be professionally serviced?', answer: 'Health guidelines recommend servicing and internal tank sanitization every 3 to 4 months to prevent bacterial re-contamination and maintain membrane life.' },
    ],
    seo: {
      title: 'RO Water Purifier Cleaning & Internal Tank Sanitization | Pure Drinking Water',
      description: 'Professional RO purifier cleaning, internal tank sterilization, filter flushing, and digital TDS check for Kent, Aquaguard, Pureit, and all top brands.',
      keywords: 'RO cleaning service, water purifier tank cleaning, RO sanitization, TDS test, RO maintenance, purifier servicing',
    },
  },
  {
    title: 'Mechanized Overhead Water Tank Cleaning',
    slug: 'water-tank-cleaning',
    icon: 'Droplets',
    popular: true,
    price: { amount: 0, unit: '', label: '' },
    image: {
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
      publicId: 'overhead_tank',
    },
    short: '6-stage mechanized cleaning with German slurry vacuum, 150-bar rotary pressure jet, and UV radiation sterilization.',
    desc: 'Uncleaned overhead storage tanks accumulate mud, rust, and algae that directly feed into your home taps and RO purifiers, causing premature filter choke and health hazards. Our certified 6-stage mechanized tank cleaning extracts all heavy bottom sediment and sterilizes the tank walls without toxic chemicals.',
    benefits: [
      'Protects expensive home RO membranes from mud and sediment overload',
      '150-bar rotary jet washes away calcite crust, algae, and bacterial biofilm',
      'German slurry vacuum pumps extract 100% of dissolved bottom mud',
      'Ultraviolet (UV) radiation kills microscopic spores and cysts',
      'Completely food-safe, non-hazardous organic sanitization',
    ],
    process: [
      { title: 'Mechanized Dewatering', description: 'Submersible pumps rapidly evacuate dirty standing water down to floor level.' },
      { title: 'Heavy Slurry Extraction', description: 'German vacuum extraction removes dense mud, sand, and decaying sediment.' },
      { title: 'High-Pressure Rotary Wash', description: '150-bar water jets descale wall calcite without damaging the tank material.' },
      { title: 'UV Radiation Disinfection', description: 'High-intensity ultraviolet lamps sterilize the empty tank to destroy pathogens.' },
    ],
    whyChooseUs: [
      'Zero manual rag-wiping — 100% mechanized German equipment',
      'Technicians wear sterile protective suits and non-marking boots',
      'Zero toxic bleach smell — water remains fresh and safe immediately',
      'Before-and-after digital inspection photos provided',
    ],
    faqs: [
      { question: 'How does cleaning the water tank help my RO purifier?', answer: 'Overhead tanks supply the water entering your RO purifier. When the tank is full of silt and algae, your RO sediment filters clog in weeks and the RO membrane gets fouled. A clean tank extends your RO filter lifespan by up to 300%.' },
      { question: 'How long does overhead tank cleaning take?', answer: 'A standard domestic tank of 500L to 1,500L takes 60 to 90 minutes with our mechanized equipment.' },
    ],
    seo: {
      title: 'Mechanized Overhead Water Tank Cleaning | 6-Stage UV Disinfection',
      description: 'Certified 6-stage mechanized water tank cleaning. High-pressure jet scrub, slurry vacuum extraction, and UV radiation for domestic overhead tanks.',
      keywords: 'water tank cleaning, overhead tank cleaning, Sintex tank cleaning, mechanized tank cleaning, UV water tank sanitization',
    },
  },
  {
    title: 'RO Filter & Membrane Replacement Service',
    slug: 'ro-filter-membrane-replacement',
    icon: 'Layers',
    popular: true,
    price: { amount: 0, unit: '', label: '' },
    image: {
      url: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1200&q=80',
      publicId: 'ro_filters',
    },
    short: 'Replacement of spun sediment filters, activated carbon blocks, genuine 0.0001-micron RO membranes, and alkaline mineral cartridges.',
    desc: 'Filters and semi-permeable membranes have finite adsorption and filtration capacities. When depleted, heavy metals, chlorine, and salts pass into your drinking water. We inspect your existing cartridge health with digital pressure gauges and TDS meters, replacing only the necessary components with authentic, high-grade NSF-certified filter media.',
    benefits: [
      'Certified 75/80/100 GPD genuine thin-film composite (TFC) RO membranes',
      'High-iodine activated carbon blocks remove 99% chlorine and chemical odors',
      '5-micron spun polypropylene sediment cartridges protect downstream stages',
      'Optional Copper / Alkaline / Mineral enrichment cartridges for balanced pH 7.5 - 8.5',
      'Sealed genuine parts opened right in front of the customer',
    ],
    process: [
      { title: 'Cartridge Saturation Test', description: 'Checking pressure drop across pre-filter and measuring membrane salt rejection ratio.' },
      { title: 'Filter Housing Sanitation', description: 'Disinfecting the filter bowls and replacing worn rubber O-rings to prevent leaks.' },
      { title: 'New Cartridge Installation', description: 'Inserting certified genuine cartridges and flushing initial carbon fines thoroughly.' },
      { title: 'Output TDS Calibration', description: 'Adjusting the TDS controller to achieve the ideal 80 - 150 ppm drinking range.' },
    ],
    whyChooseUs: [
      '100% genuine, branded, and sealed filter cartridges',
      'Zero fake generic membranes — verified serial numbers',
      'TDS controller calibrated with digital precision meters',
      'Warranty provided on all replaced membrane and pump parts',
    ],
    faqs: [
      { question: 'How do I know if my RO membrane needs replacement?', answer: 'Key indicators include: (1) Purified water TDS rising above 200 ppm, (2) Exceptionally slow water output or trickle flow, or (3) Significant increase in reject wastewater. Our technician verifies membrane health via rejection ratio calculation.' },
    ],
    seo: {
      title: 'RO Filter & Membrane Replacement Services | Genuine Spares & TDS Check',
      description: 'Expert RO membrane and filter replacement. Genuine 75/100 GPD RO membranes, spun sediment filters, carbon blocks, and alkaline mineral cartridges.',
      keywords: 'RO filter replacement, RO membrane replacement, sediment filter change, alkaline cartridge RO, water purifier spare parts',
    },
  },
  {
    title: 'Underground Water Sump & Reservoir Cleaning',
    slug: 'underground-water-sump-cleaning',
    icon: 'ShieldCheck',
    popular: false,
    price: { amount: 0, unit: '', label: '' },
    image: {
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
      publicId: 'underground_sump',
    },
    short: 'Heavy-duty dewatering, industrial slurry extraction, and antibacterial fogging for large underground RCC concrete reservoirs.',
    desc: 'Underground water sumps receive municipal and tanker water directly from the ground line, catching heavy silt, road dust, and rust flakes. If uncleaned, bottom silt ferments into hazardous black sludge. Our heavy-duty slurry pumps and rotary pressure washers descale deep concrete walls and sterilize the sump thoroughly.',
    benefits: [
      'High-capacity submersible dewatering evacuates large sumps in minutes',
      'Industrial vacuum extraction lifts dense silt, gravel, and mud',
      'Deep chemical-free wall descaling eliminates stubborn algae and calcite',
      'Antibacterial cold fogger mists ceilings, access hatches, and corners',
      'Essential for apartment buildings, builder floors, and bungalows',
    ],
    process: [
      { title: 'High-Flow Dewatering', description: 'Industrial submersible pumps drain existing water rapidly to the sump floor.' },
      { title: 'Heavy Silt Extraction', description: 'German slurry vacuums suction out dense mud, sand, and decayed organic matter.' },
      { title: 'Rotary Pressure Jetting', description: 'High-pressure water jets descale porous concrete walls and floor corners.' },
      { title: 'Anti-Bacterial Fogging', description: 'Sterilizing mist eliminates bacterial spores and fungal colonies completely.' },
    ],
    whyChooseUs: [
      'Equipped for deep underground sumps with confined space safety gear',
      'Heavy-duty industrial machinery handles up to 50,000-liter sumps',
      'Fast turnaround minimizes water supply downtime for residents',
    ],
    faqs: [
      { question: 'Can you clean large sumps in apartment complexes and societies?', answer: 'Yes. We cater to individual residential bungalows as well as multi-story apartment complexes and commercial business parks with sumps ranging from 2,000L to 100,000L.' },
    ],
    seo: {
      title: 'Underground Water Sump Cleaning | Heavy Slurry Extraction & Sanitization',
      description: 'Professional underground concrete sump and water reservoir cleaning. Industrial slurry extraction, high-pressure jet wash, and antibacterial fogging.',
      keywords: 'underground sump cleaning, water reservoir cleaning, RCC sump cleaning, slurry extraction, water tank cleaning service',
    },
  },
  {
    title: 'Commercial & Industrial RO Plant Servicing',
    slug: 'commercial-ro-plant-servicing',
    icon: 'Building2',
    popular: true,
    price: { amount: 0, unit: '', label: '' },
    image: {
      url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80',
      publicId: 'commercial_ro',
    },
    short: 'Comprehensive maintenance for 25 LPH, 50 LPH, 100 LPH to 1000+ LPH commercial RO systems in offices, schools, clinics, and factories.',
    desc: 'Commercial workplaces, restaurants, educational institutes, and manufacturing facilities rely on continuous high-volume purified water. Our commercial RO engineering team provides multi-port valve servicing, antiscalant dosing pump calibration, raw water pump diagnostics, multi-membrane chemical CIP flushing, and sand/carbon media replacement.',
    benefits: [
      'Chemical-in-place (CIP) membrane cleaning restores high-volume flow rate',
      'Multi-port valve backwash and rinse cycle calibration',
      'Antiscalant dosing pump adjustment prevents premature membrane scaling',
      'Micron bag filter and jumbo cartridge replacements',
      'Emergency breakdown support and flexible AMC corporate contracts',
    ],
    process: [
      { title: 'Flow Rate & Pressure Differential Check', description: 'Measuring inlet/outlet pressure across membrane pressure vessels and testing TDS.' },
      { title: 'Pre-Treatment Backwash', description: 'Multi-port valves backwashed to clear trapped particulate matter from sand and carbon vessels.' },
      { title: 'Membrane CIP Flush', description: 'Chemical-in-place flushing with specialized descalers dissolves silica and calcium fouling.' },
      { title: 'Dosing & Electrical Calibration', description: 'Calibrating antiscalant dosing rate, float sensors, and high-pressure cut-off switches.' },
    ],
    whyChooseUs: [
      'Experienced commercial RO engineers with deep industrial water chemistry knowledge',
      'GST billing, formal inspection reports, and preventive AMC packages',
      'Minimal operational downtime — weekend and after-hours servicing available',
    ],
    faqs: [
      { question: 'What commercial RO capacities do you service?', answer: 'We service all commercial capacities: 25 LPH, 50 LPH, 100 LPH, 250 LPH, 500 LPH, and industrial 1,000+ LPH multi-membrane filtration skids.' },
    ],
    seo: {
      title: 'Commercial & Industrial RO Plant Servicing | Membrane CIP & Maintenance',
      description: 'Professional commercial RO plant maintenance. Servicing for 50 LPH to 1000+ LPH commercial water purifiers, membrane CIP flushing, and AMC contracts.',
      keywords: 'commercial RO service, industrial RO plant repair, 50 LPH RO service, membrane CIP cleaning, commercial water purifier maintenance',
    },
  },
  {
    title: 'Water TDS Testing & Complete Quality Analysis',
    slug: 'water-tds-testing-and-analysis',
    icon: 'Activity',
    popular: false,
    price: { amount: 0, unit: '', label: '' },
    image: {
      url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
      publicId: 'tds_testing',
    },
    short: 'Doorstep digital TDS measurement, pH balance check, water hardness diagnostic, and RO membrane rejection ratio calculation.',
    desc: 'Unsure whether your drinking water is truly safe or if your RO purifier is functioning properly? Our technician visits your location with laboratory-calibrated digital testing tools to measure raw tap water vs. purified drinking water. You receive an immediate verbal report with transparent, scientific recommendations.',
    benefits: [
      'Accurate digital parts-per-million (PPM) Total Dissolved Solids measurement',
      'pH scale testing to ensure healthy alkaline/neutral drinking balance',
      'Calcium and magnesium hardness check reveals scaling severity',
      'Calculates exact RO membrane rejection percentage (should exceed 90%)',
      '100% free when paired with any cleaning or repair service',
    ],
    process: [
      { title: 'Raw Water Baseline', description: 'Sampling input tap/borewell water for initial TDS, temperature, and hardness baseline.' },
      { title: 'Purified Water Test', description: 'Sampling water directly from the RO faucet to compare mineral reduction efficiency.' },
      { title: 'Storage Tank Inspection', description: 'Testing water from the internal tank to check for secondary microbial contamination.' },
      { title: 'Hygiene Consultation', description: 'Providing clear recommendations on TDS adjustment and filter health.' },
    ],
    whyChooseUs: [
      'Lab-calibrated digital meters — no subjective chemical drop guesswork',
      'Honest, unbiased evaluation — no fabricated test results to sell unneeded parts',
      'Clear explanation of health standards for infants, adults, and seniors',
    ],
    faqs: [
      { question: 'What is the ideal TDS level for home drinking water?', answer: 'The Bureau of Indian Standards (BIS) and WHO suggest an optimal drinking water TDS of 80 to 150 ppm. Water with TDS below 50 ppm is de-mineralized, while water above 300 ppm often tastes hard and metallic.' },
    ],
    seo: {
      title: 'Doorstep Water TDS Testing & Purity Analysis | Certified Water Quality Check',
      description: 'Accurate digital water TDS testing and purity diagnosis at your doorstep. Compare raw tap vs. RO purified water and check membrane rejection efficiency.',
      keywords: 'TDS testing doorstep, water quality check, check RO TDS, drinking water hardness test, water purity test',
    },
  },
  {
    title: 'RO Booster Pump & Electrical Diagnostic Service',
    slug: 'ro-booster-pump-leak-repair',
    icon: 'Wrench',
    popular: false,
    price: { amount: 0, unit: '', label: '' },
    image: {
      url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1200&q=80',
      publicId: 'ro_repair',
    },
    short: 'Precision diagnostic and repair for booster pump vibration, low water pressure, SMPS adapter faults, and leaking connector fittings.',
    desc: 'A failing booster pump cannot push water through the dense 0.0001-micron RO membrane, resulting in zero water flow or continuous wastewater rejection. Our diagnostic technicians carry testing multimeters, digital pressure gauges, replacement 24V/36V booster pumps, copper SMPS adapters, solenoid valves, and push-fit connectors to solve purifier issues on the spot.',
    benefits: [
      'Solves noisy pump vibrations and grinding sounds',
      'Restores optimal 80 - 120 PSI operating pressure for efficient filtration',
      'Diagnoses electrical dead purifiers (SMPS transformer / adapter checks)',
      'Replaces leaking John Guest / push-fit connectors and solenoid valves',
      'Guaranteed genuine copper-wound heavy-duty replacement pumps',
    ],
    process: [
      { title: 'Electrical Multimeter Check', description: 'Testing power adapter output voltage and verifying solenoid valve response.' },
      { title: 'Hydraulic Pressure Gauge Test', description: 'Connecting in-line pressure gauges to determine pump pressure output under load.' },
      { title: 'Leak-Proof Sealing', description: 'Replacing degraded push-fit elbow joints and Teflon-sealing threaded housings.' },
      { title: 'Continuous Run Test', description: 'Running full filtration cycle to verify automatic float cut-off and silent operation.' },
    ],
    whyChooseUs: [
      'Fully equipped service vans with all common pump and electrical spares on board',
      'Instant on-site repair — no waiting days for spare parts',
      '90-day warranty on all electrical parts and booster pump replacements',
    ],
    faqs: [
      { question: 'Why is wastewater running continuously from my RO purifier?', answer: 'Continuous wastewater flow usually indicates a jammed or faulty Solenoid Valve (SV) or a malfunctioning auto-shutoff valve. Our technician can repair or replace this component in under 20 minutes.' },
    ],
    seo: {
      title: 'RO Booster Pump Repair & Electrical Troubleshooting | Low Pressure Fix',
      description: 'Expert RO purifier booster pump repair, SMPS adapter troubleshooting, and leak fixes. Certified technicians with genuine replacement parts.',
      keywords: 'RO pump repair, RO booster pump troubleshooting, RO purifier not turning on, RO leaking water, water purifier repair service',
    },
  },
  {
    title: 'Annual Maintenance Contract (AMC) for RO Purifiers',
    slug: 'ro-amc-maintenance-plans',
    icon: 'Sparkles',
    popular: true,
    price: { amount: 0, unit: '', label: '' },
    image: {
      url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
      publicId: 'ro_amc',
    },
    short: 'Year-round pure drinking water security with 3 scheduled maintenance visits, free filter replacements, and unlimited breakdown support.',
    desc: 'Protect your family from waterborne diseases all year round without worrying about sudden repair bills or remembering maintenance dates. Our Comprehensive RO AMC plan covers scheduled quarterly servicing, free replacement of sediment and carbon cartridges, emergency breakdown visits, and free labor throughout the 365-day contract.',
    benefits: [
      '3 Scheduled preventive maintenance & internal tank sanitization visits',
      'Free replacement of pre-sediment filters and carbon block cartridges',
      'Unlimited breakdown support visits within 24 hours of calling',
      'Continuous digital TDS testing and purity monitoring log',
      'Substantial savings over pay-per-visit servicing and emergency repairs',
    ],
    process: [
      { title: 'Onboarding System Health Check', description: 'Initial baseline service, TDS calibration, and system sanitization upon signing.' },
      { title: 'Automated Quarterly Reminders', description: 'Our automated system schedules visits every 90 to 120 days at your convenience.' },
      { title: 'Preventive Filter Swaps', description: 'Exhausted pre-filters and carbon blocks are swapped before performance degrades.' },
      { title: 'Priority Emergency Response', description: 'Immediate technician dispatch for any unexpected leak or breakdown.' },
    ],
    whyChooseUs: [
      'True comprehensive peace of mind — genuine certified replacement filters included',
      'Priority scheduling for AMC members with dedicated service helpline',
      'Transparent documentation — digital service history sent to your WhatsApp',
    ],
    faqs: [
      { question: 'What is the difference between Basic and Comprehensive AMC?', answer: 'Basic AMC covers periodic servicing and free labor for all breakdown calls. Comprehensive AMC includes all labor, periodic visits, PLUS free replacement of consumable pre-sediment and carbon filter cartridges throughout the year.' },
    ],
    seo: {
      title: 'RO Purifier AMC Maintenance Plans | Annual Water Purifier Contract',
      description: 'Affordable comprehensive RO purifier Annual Maintenance Contracts (AMC). Scheduled quarterly visits, free filter changes, and unlimited breakdown support.',
      keywords: 'RO AMC plans, water purifier AMC, annual maintenance contract RO, Kent AMC, Aquaguard AMC plan',
    },
  },
];

const RO_TESTIMONIALS = [];

const RO_GALLERY = [
  // 1. Water Tanks (Before & After + Showcases)
  {
    title: 'Overhead Water Tank Sludge Evacuation',
    description: '150-bar rotary pressure jetting and slurry vacuum extraction removing 8 months of thick sediment and algae.',
    category: 'Water Tank Cleaning',
    type: 'before-after',
    beforeImage: {
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80',
      publicId: 'tank_before_1',
    },
    afterImage: {
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
      publicId: 'tank_after_1',
    },
    isPublished: true,
    order: 1,
  },
  {
    title: 'Sterile Underground Concrete Sump Washing',
    description: 'Dewatering, high-pressure jet descaling, and hospital-grade antibacterial UV disinfection.',
    category: 'Water Tank Cleaning',
    type: 'single',
    image: {
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
      publicId: 'tank_showcase_1',
    },
    isPublished: true,
    order: 2,
  },

  // 2. RO Purifiers & Filters (Before & After + Showcases)
  {
    title: 'RO Purifier Internal Tank Biofilm Sanitization',
    description: 'Food-grade descaling eradicates slimy microbial biofilm and stagnant odors inside the dark reservoir.',
    category: 'RO Purifier Servicing',
    type: 'before-after',
    beforeImage: {
      url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1000&q=80',
      publicId: 'ro_tank_before_1',
    },
    afterImage: {
      url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1000&q=80',
      publicId: 'ro_tank_after_1',
    },
    isPublished: true,
    order: 3,
  },
  {
    title: 'Sediment Filter Choke & Genuine Replacement',
    description: 'Heavily mud-encrusted 5-micron pre-filter swapped with genuine high-density spun cartridge.',
    category: 'RO Purifier Servicing',
    type: 'before-after',
    beforeImage: {
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80',
      publicId: 'filter_before_1',
    },
    afterImage: {
      url: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1000&q=80',
      publicId: 'filter_after_1',
    },
    isPublished: true,
    order: 4,
  },
  {
    title: 'Calibrated Digital TDS Purity Testing',
    description: 'Accurate digital measurement verifying 94% mineral rejection and ideal 90 ppm drinking water output.',
    category: 'RO Purifier Servicing',
    type: 'single',
    image: {
      url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1000&q=80',
      publicId: 'tds_test_showcase',
    },
    isPublished: true,
    order: 5,
  },

  // 3. Bathroom Deep Cleaning (Before & After + Showcases)
  {
    title: 'Bathroom Tile Descaling & Limescale Removal',
    description: 'Dissolved stubborn groundwater calcium crust from vitrified wall tiles and shower stall glass.',
    category: 'Bathroom Deep Cleaning',
    type: 'before-after',
    beforeImage: {
      url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1000&q=80',
      publicId: 'bath_before_1',
    },
    afterImage: {
      url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80',
      publicId: 'bath_after_1',
    },
    isPublished: true,
    order: 6,
  },
  {
    title: 'Chrome Hardware & Sanitaryware Sanitization',
    description: 'Rotary brushing and hospital-grade sanitization of faucets, showerheads, and ceramic fittings.',
    category: 'Bathroom Deep Cleaning',
    type: 'single',
    image: {
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
      publicId: 'bath_fixtures_showcase',
    },
    isPublished: true,
    order: 7,
  },

  // 4. Kitchen Deep Cleaning (Before & After + Showcases)
  {
    title: 'Chimney Baffle Filter Grease Degreasing',
    description: 'Immersion citrus degreasing dissolves hardened oil and carbon deposits, restoring full blower suction.',
    category: 'Kitchen Deep Cleaning',
    type: 'before-after',
    beforeImage: {
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
      publicId: 'kitchen_before_1',
    },
    afterImage: {
      url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1000&q=80',
      publicId: 'kitchen_after_1',
    },
    isPublished: true,
    order: 8,
  },
  {
    title: 'Granite Countertop & Backsplash Detailing',
    description: 'Food-safe sanitizing compound removes sticky spice oils, yellowed grout mildew, and sink scale.',
    category: 'Kitchen Deep Cleaning',
    type: 'single',
    image: {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      publicId: 'kitchen_counter_showcase',
    },
    isPublished: true,
    order: 9,
  },

  // 5. Glass & Window Cleaning (Before & After + Showcases)
  {
    title: 'Balcony Sliding Glass Streak-Free Squeegee',
    description: 'Complete removal of rain etchings, hard-water mineral spots, and track dust slurry.',
    category: 'Glass & Window Cleaning',
    type: 'before-after',
    beforeImage: {
      url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=80',
      publicId: 'glass_before_1',
    },
    afterImage: {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      publicId: 'glass_after_1',
    },
    isPublished: true,
    order: 10,
  },
  {
    title: 'High-Transparency Double-Glazed French Windows',
    description: 'Pure water rubber squeegee technique delivers 100% optical clarity without towel lint.',
    category: 'Glass & Window Cleaning',
    type: 'single',
    image: {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      publicId: 'glass_french_showcase',
    },
    isPublished: true,
    order: 11,
  },

  // 6. Commercial RO & Office Cleaning
  {
    title: 'Commercial 250 LPH RO Filtration Skid Service',
    description: 'Multi-port valve backwash, antiscalant pump calibration, and membrane chemical flush.',
    category: 'Commercial RO & Office',
    type: 'single',
    image: {
      url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1000&q=80',
      publicId: 'comm_ro_showcase',
    },
    isPublished: true,
    order: 12,
  },
  {
    title: 'Corporate Cafeteria & Pantry Water Station Hygiene',
    description: 'Preventive quarterly maintenance, chiller sanitization, and certified laboratory water analysis.',
    category: 'Commercial RO & Office',
    type: 'single',
    image: {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      publicId: 'office_pantry_showcase',
    },
    isPublished: true,
    order: 13,
  },

  // 7. Cleaning Team & Professional Equipment
  {
    title: 'Certified Technicians with High-Pressure Jet Kit',
    description: 'Our trained service crew equipped with 150-bar rotary washers, safety harnesses, and UV lamps.',
    category: 'Team & Equipment',
    type: 'single',
    image: {
      url: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1000&q=80',
      publicId: 'team_equipment_1',
    },
    isPublished: true,
    order: 14,
  },
  {
    title: 'Industrial Slurry Vacuum & UV Sterilization Lamp',
    description: 'High-capacity extraction machinery ensuring zero muddy residue is left inside potable water reservoirs.',
    category: 'Team & Equipment',
    type: 'single',
    image: {
      url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80',
      publicId: 'equipment_showcase_1',
    },
    isPublished: true,
    order: 15,
  },
];

const RO_FAQS = [
  {
    question: 'Why is Aqua Ak Enterprises specifically focused on water purification?',
    answer: 'Unlike general house cleaning agencies, Aqua Ak Enterprises employs specialized water hygiene technicians. Water purification and storage tanks require specific microbiological knowledge, food-grade non-toxic sanitizing compounds, and laboratory-calibrated digital TDS meters to ensure your drinking water is genuinely safe.',
    order: 0,
  },
  {
    question: 'How frequently should an RO water purifier storage tank be sanitized?',
    answer: 'Purifier storage tanks should be descaled and sterilized every 3 to 4 months. In warm climates, microbial biofilms form quickly inside the dark plastic reservoir, re-contaminating water that just passed through the filtration membrane.',
    order: 1,
  },
  {
    question: 'Why should I clean my overhead water tank if I already have an RO purifier?',
    answer: 'Your RO purifier draws its raw water directly from your overhead or underground tank. When the tank is layered with silt, sand, and algae, your RO sediment filters choke within weeks and the RO membrane gets fouled. Keeping your tank clean protects your purifier and extends filter life by 300%.',
    order: 2,
  },
  {
    question: 'What is TDS, and what reading should I expect from my purifier?',
    answer: 'TDS (Total Dissolved Solids) measures dissolved minerals, salts, and metals in ppm (parts per million). Ideal drinking water TDS is 80 to 150 ppm. During every service visit, our technician verifies the exact raw vs. purified TDS in front of you.',
    order: 3,
  },
  {
    question: 'Which brands of RO purifiers do you service?',
    answer: 'We service and stock certified parts for all leading brands including Kent, Eureka Forbes Aquaguard, HUL Pureit, Havells, Livpure, AO Smith, Blue Star, LG, and customized commercial RO filtration plants.',
    order: 4,
  },
];

export async function seed(disconnectAfter = false) {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }

  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123#';

  await Admin.deleteMany({});
  await Admin.create({
    name: process.env.ADMIN_NAME || 'Aqua Ak Enterprises Admin',
    email,
    password,
    role: 'superadmin',
  });
  console.log(`Created & updated superadmin credentials: ${email}`);

  // Update or replace services
  await Service.deleteMany({});
  await Service.insertMany(
    RO_SERVICES.map((s, i) => ({
      title: s.title,
      slug: s.slug || slugify(s.title),
      icon: s.icon,
      isPopular: Boolean(s.popular),
      order: i,
      shortDescription: s.short,
      description: s.desc,
      benefits: s.benefits,
      process: s.process,
      whyChooseUs: s.whyChooseUs,
      faqs: s.faqs,
      price: s.price,
      image: s.image,
      seo: s.seo,
    }))
  );
  console.log('Seeded specialized RO and Water Hygiene services.');

  // Update or replace FAQs
  await FAQ.deleteMany({});
  await FAQ.insertMany(RO_FAQS);
  console.log('Seeded RO FAQs.');

  // Remove all fake testimonials
  await Testimonial.deleteMany({});

  // Update or replace Gallery
  await Gallery.deleteMany({});
  await Gallery.insertMany(RO_GALLERY);
  console.log('Seeded RO and Water Tank gallery transformations.');

  // Update SEO settings for all pages
  for (const page of SEO_PAGES) {
    await SEOSettings.updateOne(
      { page },
      {
        $setOnInsert: {
          page,
          title: `${page.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} | Aqua Ak Enterprises`,
          description: `Certified RO Water Purifier Servicing, Internal Tank Sanitization, and Mechanized Water Tank Cleaning by Aqua Ak Enterprises in Jankipuram, Lucknow.`,
          canonicalUrl: `https://your-site.vercel.app/${page === 'home' ? '' : page}`,
        },
      },
      { upsert: true }
    );
  }

  // Upsert main Website Settings
  await WebsiteSettings.deleteMany({ key: 'main' });
  await WebsiteSettings.create({
    key: 'main',
    businessName: 'Aqua Ak Enterprises',
    tagline: 'Pure Drinking Water. Certified Tank Sanitization. Healthy Families.',
    logo: {
      url: '',
      publicId: '',
    },
    hero: {
      heading: 'Certified RO Purifier & Water Tank Cleaning Specialists',
      description:
        'Aqua Ak Enterprises in Jankipuram, Lucknow: Dedicated water hygiene engineering, internal RO storage tank sanitization, genuine membrane replacements, digital TDS testing, and 6-stage mechanized water tank disinfection.',
      image: {
        url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1600&q=80',
        publicId: 'hero_water',
      },
    },
    about: {
      intro:
        'Aqua Ak Enterprises is a specialized water purity and reservoir hygiene enterprise based in Jankipuram, Lucknow. Unlike generic cleaning agencies, our certified technicians are trained exclusively in water microbiology, membrane filtration chemistry, and food-grade non-toxic sanitization.',
      mission:
        'To guarantee 100% pure, disease-free drinking and domestic water for every home, school, and workplace in Lucknow through scientific RO maintenance and mechanized reservoir hygiene.',
      vision:
        'To be the most trusted and technologically advanced water purification service partner across Lucknow and Uttar Pradesh.',
      experience:
        'Over 15,000+ domestic RO purifiers serviced and 10,000+ residential water tanks sterilized with zero chemical toxicity and 100% digital TDS verification.',
      image: {
        url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
        publicId: 'about_ro',
      },
      standards: [
        '100% Food-Grade, non-toxic sanitization agents safe for drinking reservoirs',
        'Certified digital TDS testing on every service call with before/after log',
        'Genuine, sealed NSF-certified replacement membranes and filter cartridges',
        'Strict hygiene gear: sterile technician gloves, shoe covers, and sanitized tools',
      ],
      trustPoints: [
        'Transparent Upfront Pricing — Zero Forced Part Replacements',
        'Certified Water Hygiene Specialists with Government ID Verification',
        'Digital TDS Purity Guarantee Signed Off by You',
        'Same-Day Doorstep Service Across Jankipuram & Lucknow',
      ],
    },
    whyChooseUs: [
      {
        title: 'Specialized Water Technicians',
        description: 'Trained exclusively in RO membrane physics, water microbiology, and tank hygiene.',
        icon: 'ShieldCheck',
      },
      {
        title: 'Food-Grade Sanitization',
        description: 'Zero harsh chemicals or chlorine fumes. 100% safe for infants, children, and pets.',
        icon: 'Sparkles',
      },
      {
        title: 'Digital TDS Meter Verification',
        description: 'We test raw tap water vs. purified output in front of you so you see exact purity.',
        icon: 'Activity',
      },
      {
        title: 'Genuine Sealed Spares',
        description: 'Authentic 75/100 GPD membranes and high-iodine carbon filters opened in your presence.',
        icon: 'CheckCircle2',
      },
    ],
    howItWorks: [
      { title: '1. Book Your Visit', description: 'Select your RO service, tank capacity, or AMC plan online or via WhatsApp.' },
      { title: '2. Doorstep Arrival & TDS Diagnostic', description: 'Technician arrives with digital testing meters, testing raw vs purified water.' },
      { title: '3. Deep Clean & Sanitization', description: 'Storage tanks are descaled, filter housings flushed, and membranes serviced.' },
      { title: '4. Final Purity Certification', description: 'Verify crisp water taste, confirm calibrated TDS reading, and receive digital receipt.' },
    ],
    businessHours: [
      { day: 'Monday – Saturday', hours: '8:00 AM – 8:00 PM' },
      { day: 'Sunday', hours: '9:00 AM – 6:00 PM (Emergency slots available)' },
    ],
    contact: {
      phone: '9219254461',
      whatsapp: '9219254461',
      email: 'contact@aquaakenterprises.com',
      address: 'Aqua Ak Enterprises, Jankipuram',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      postalCode: '226021',
      country: 'IN',
      latitude: '26.9158',
      longitude: '80.9427',
      mapEmbedUrl: 'https://www.google.com/maps?q=Jankipuram%2C+Lucknow&output=embed',
      googleBusinessUrl: 'https://maps.google.com/?q=Aqua+Ak+Enterprises+Jankipuram+Lucknow',
    },
    serviceAreas: [
      { name: 'Jankipuram (All Sectors & Ext.)', description: 'Sector A, B, C, D, Jankipuram Extension, Ring Road, and Sahara States.' },
      { name: 'Aliganj & Kapoorthala', description: 'Sector A to Q, Kapoorthala market, Dandiya Bazar, and Purania.' },
      { name: 'Gomti Nagar & Extension', description: 'Vipin Khand, Vijay Khand, Vikas Khand, Shaheed Path, and Gomti Nagar Ext.' },
      { name: 'Indira Nagar & Kalyanpur', description: 'Blocks A to Z, Munshipulia, Ring Road, Polytechnic, and Kalyanpur.' },
      { name: 'Mahanagar & Vikas Nagar', description: 'Gole Market, Tedhi Pulia, Kursi Road, and IT Chauraha.' },
      { name: 'Hazratganj & Central Lucknow', description: 'Ashiyana, Alambagh, Krishna Nagar, and Charbagh.' },
    ],
    stats: [
      { label: 'RO Purifiers Serviced', value: '15,000+' },
      { label: 'Water Tanks Sanitized', value: '10,000+' },
      { label: 'Customer Rating', value: '4.9 ★' },
      { label: 'Certified Technicians', value: '40+' },
    ],
    footer: {
      about:
        'Aqua Ak Enterprises is your trusted water hygiene specialist in Jankipuram, Lucknow. We deliver professional domestic and commercial RO purifier servicing, internal tank sanitization, genuine membrane replacements, and mechanized water tank cleaning. Call 9219254461.',
      copyright: '© 2026 Aqua Ak Enterprises. All rights reserved. Specialized RO & Water Hygiene Services.',
    },
  });

  console.log('Seed complete. Laser-focused RO and Water Cleaning data populated.');
  if (disconnectAfter) {
    await mongoose.disconnect();
  }
}

import { fileURLToPath } from 'url';
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seed(true).catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
