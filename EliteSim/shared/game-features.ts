// Elite Game Features - Comprehensive Feature Set for Desktop/Mobile/iPad

// Asset Classes & Investment Types
export const ASSET_CLASSES = {
  PUBLIC_EQUITY: "Public Equities",
  PRIVATE_EQUITY: "Private Equity",
  VENTURE_CAPITAL: "Venture Capital",
  REAL_ESTATE: "Real Estate",
  COMMODITIES: "Commodities",
  CRYPTO: "Cryptocurrency",
  FIXED_INCOME: "Fixed Income",
  HEDGE_FUNDS: "Hedge Funds",
  ART_COLLECTIBLES: "Art & Collectibles",
  ALTERNATIVE: "Alternative Investments"
};

// Property Types for Real Estate Empire
export const PROPERTY_TYPES = [
  { id: "manhattan-penthouse", name: "Manhattan Penthouse", price: 85000000, category: "Residential", location: "New York", yield: 0.02 },
  { id: "beverly-hills-mansion", name: "Beverly Hills Mansion", price: 125000000, category: "Residential", location: "Los Angeles", yield: 0.015 },
  { id: "london-mayfair", name: "Mayfair Townhouse", price: 95000000, category: "Residential", location: "London", yield: 0.018 },
  { id: "dubai-burj", name: "Burj Khalifa Penthouse", price: 68000000, category: "Residential", location: "Dubai", yield: 0.025 },
  { id: "miami-waterfront", name: "Miami Beach Waterfront", price: 45000000, category: "Residential", location: "Miami", yield: 0.03 },
  { id: "tokyo-shibuya", name: "Shibuya Tower Suite", price: 78000000, category: "Residential", location: "Tokyo", yield: 0.02 },
  { id: "paris-champs", name: "Champs-Élysées Apartment", price: 92000000, category: "Residential", location: "Paris", yield: 0.016 },
  { id: "singapore-marina", name: "Marina Bay Sky Villa", price: 58000000, category: "Residential", location: "Singapore", yield: 0.022 },
  
  // Commercial Properties
  { id: "manhattan-office", name: "Manhattan Office Tower", price: 850000000, category: "Commercial", location: "New York", yield: 0.045 },
  { id: "london-financial", name: "City of London Complex", price: 1200000000, category: "Commercial", location: "London", yield: 0.04 },
  { id: "tokyo-business", name: "Tokyo Business District", price: 750000000, category: "Commercial", location: "Tokyo", yield: 0.038 },
  { id: "data-center-virginia", name: "Northern Virginia Data Center", price: 425000000, category: "Tech", location: "Virginia", yield: 0.055 },
  { id: "warehouse-network", name: "Amazon Fulfillment Network", price: 2300000000, category: "Logistics", location: "Global", yield: 0.048 },
  
  // Luxury Assets
  { id: "private-island", name: "Caribbean Private Island", price: 150000000, category: "Luxury", location: "Caribbean", yield: 0.005 },
  { id: "ski-resort", name: "Swiss Alps Ski Resort", price: 340000000, category: "Hospitality", location: "Switzerland", yield: 0.035 },
  { id: "vineyard-napa", name: "Napa Valley Vineyard", price: 89000000, category: "Agriculture", location: "California", yield: 0.028 },
  { id: "yacht-club", name: "Monaco Yacht Club", price: 185000000, category: "Hospitality", location: "Monaco", yield: 0.025 }
];

// Art & Collectibles Market
export const ART_COLLECTIBLES = [
  { id: "picasso-blue", name: "Picasso Blue Period Masterpiece", price: 125000000, artist: "Pablo Picasso", year: 1904, category: "Painting" },
  { id: "van-gogh-starry", name: "Van Gogh Starry Night Study", price: 89000000, artist: "Vincent van Gogh", year: 1889, category: "Painting" },
  { id: "monet-waterlilies", name: "Monet Water Lilies Series", price: 67000000, artist: "Claude Monet", year: 1919, category: "Painting" },
  { id: "basquiat-skull", name: "Basquiat Skull Painting", price: 110000000, artist: "Jean-Michel Basquiat", year: 1982, category: "Contemporary" },
  { id: "leonardo-sketch", name: "Leonardo da Vinci Sketch", price: 295000000, artist: "Leonardo da Vinci", year: 1503, category: "Drawing" },
  { id: "ferrari-250gto", name: "1962 Ferrari 250 GTO", price: 48000000, make: "Ferrari", year: 1962, category: "Classic Car" },
  { id: "mclaren-f1", name: "McLaren F1 LM", price: 19500000, make: "McLaren", year: 1996, category: "Supercar" },
  { id: "bugatti-atlantique", name: "Bugatti Type 57SC Atlantic", price: 115000000, make: "Bugatti", year: 1936, category: "Classic Car" },
  { id: "rare-diamond", name: "Pink Star Diamond", price: 71000000, weight: "59.60 carats", category: "Jewelry" },
  { id: "vintage-rolex", name: "Paul Newman Rolex Daytona", price: 17800000, brand: "Rolex", year: 1968, category: "Watch" }
];

// Luxury Vehicles Fleet
export const LUXURY_VEHICLES = [
  { id: "bugatti-chiron", name: "Bugatti Chiron Super Sport", price: 3900000, brand: "Bugatti", type: "Hypercar", topSpeed: 304 },
  { id: "koenigsegg-jesko", name: "Koenigsegg Jesko Absolut", price: 3500000, brand: "Koenigsegg", type: "Hypercar", topSpeed: 330 },
  { id: "pagani-huayra", name: "Pagani Huayra BC Roadster", price: 3500000, brand: "Pagani", type: "Hypercar", topSpeed: 238 },
  { id: "mclaren-speedtail", name: "McLaren Speedtail", price: 2250000, brand: "McLaren", type: "Hypercar", topSpeed: 250 },
  { id: "ferrari-sf90", name: "Ferrari SF90 Stradale", price: 625000, brand: "Ferrari", type: "Supercar", topSpeed: 211 },
  { id: "lamborghini-revuelto", name: "Lamborghini Revuelto", price: 608000, brand: "Lamborghini", type: "Supercar", topSpeed: 217 },
  { id: "rolls-phantom", name: "Rolls-Royce Phantom VIII", price: 460000, brand: "Rolls-Royce", type: "Luxury Sedan", topSpeed: 155 },
  { id: "bentley-mulsanne", name: "Bentley Mulsanne Speed", price: 335000, brand: "Bentley", type: "Luxury Sedan", topSpeed: 190 },
  
  // Private Jets
  { id: "gulfstream-g700", name: "Gulfstream G700", price: 78500000, brand: "Gulfstream", type: "Private Jet", range: 7500 },
  { id: "bombardier-global", name: "Bombardier Global 7500", price: 73000000, brand: "Bombardier", type: "Private Jet", range: 7700 },
  { id: "dassault-falcon", name: "Dassault Falcon 8X", price: 58000000, brand: "Dassault", type: "Private Jet", range: 6450 },
  
  // Superyachts
  { id: "azzam-yacht", name: "Azzam-Class Superyacht", price: 650000000, builder: "Lürssen", type: "Superyacht", length: 180 },
  { id: "eclipse-yacht", name: "Eclipse Superyacht", price: 500000000, builder: "Blohm+Voss", type: "Superyacht", length: 162 },
  { id: "dilbar-yacht", name: "Dilbar Superyacht", price: 256000000, builder: "Lürssen", type: "Superyacht", length: 156 }
];

// Private Equity & Venture Capital Opportunities
export const PRIVATE_INVESTMENTS = [
  { id: "ai-startup", name: "Quantum AI Research Lab", stage: "Series B", valuation: 2400000000, sector: "AI/ML", minInvestment: 50000000 },
  { id: "biotech-unicorn", name: "Gene Therapy Innovations", stage: "Series C", valuation: 8500000000, sector: "Biotech", minInvestment: 100000000 },
  { id: "fintech-leader", name: "Digital Banking Platform", stage: "Pre-IPO", valuation: 15600000000, sector: "FinTech", minInvestment: 250000000 },
  { id: "space-ventures", name: "Commercial Space Mining", stage: "Series A", valuation: 1200000000, sector: "Aerospace", minInvestment: 25000000 },
  { id: "clean-energy", name: "Fusion Energy Systems", stage: "Series B", valuation: 4800000000, sector: "Clean Energy", minInvestment: 75000000 },
  { id: "quantum-computing", name: "Quantum Computing Corp", stage: "Series C", valuation: 6200000000, sector: "Quantum Tech", minInvestment: 150000000 },
  { id: "autonomous-vehicles", name: "Self-Driving Tech Inc", stage: "Pre-IPO", valuation: 12800000000, sector: "Automotive", minInvestment: 200000000 },
  { id: "virtual-reality", name: "Metaverse Platforms Ltd", stage: "Series B", valuation: 3400000000, sector: "VR/AR", minInvestment: 60000000 }
];

// Political & Influence Actions
export const POLITICAL_ACTIONS = [
  { id: "lobby-congress", name: "Congressional Lobbying Campaign", cost: 15000000, influence: "Federal", duration: 6 },
  { id: "fund-super-pac", name: "Super PAC Funding", cost: 50000000, influence: "Electoral", duration: 12 },
  { id: "think-tank", name: "Policy Think Tank", cost: 25000000, influence: "Academic", duration: 24 },
  { id: "media-acquisition", name: "News Network Acquisition", cost: 2500000000, influence: "Media", duration: 60 },
  { id: "university-endowment", name: "University Endowment", cost: 100000000, influence: "Education", duration: 120 },
  { id: "foundation-launch", name: "Philanthropic Foundation", cost: 500000000, influence: "Global", duration: 240 }
];

// Crisis Types & Scenarios
export const CRISIS_SCENARIOS = [
  {
    id: "hostile-takeover",
    title: "Hostile Takeover Attempt",
    severity: "CRITICAL",
    timeLimit: 72,
    description: "Private equity firm BlackStone has launched a $45B hostile bid for your flagship company",
    actions: [
      { id: "poison-pill", label: "Deploy Poison Pill Defense", cost: 500000000, success: 75 },
      { id: "white-knight", label: "Find White Knight Investor", cost: 100000000, success: 60 },
      { id: "counter-offer", label: "Launch Counter-Offer", cost: 2000000000, success: 85 },
      { id: "legal-challenge", label: "Legal Challenge", cost: 50000000, success: 40 }
    ]
  },
  {
    id: "regulatory-investigation",
    title: "SEC Investigation",
    severity: "HIGH",
    timeLimit: 168,
    description: "Securities regulators are investigating potential insider trading violations",
    actions: [
      { id: "legal-team", label: "Hire Top Legal Team", cost: 25000000, success: 70 },
      { id: "settle-quickly", label: "Quick Settlement", cost: 150000000, success: 90 },
      { id: "fight-charges", label: "Fight All Charges", cost: 75000000, success: 45 },
      { id: "transparency", label: "Full Transparency Campaign", cost: 10000000, success: 55 }
    ]
  },
  {
    id: "market-crash",
    title: "Market Crash Response",
    severity: "CRITICAL",
    timeLimit: 24,
    description: "Global markets are crashing, losing 15% in a single day",
    actions: [
      { id: "buy-dip", label: "Buy the Dip Aggressively", cost: 5000000000, success: 60 },
      { id: "hedge-positions", label: "Hedge All Positions", cost: 500000000, success: 80 },
      { id: "cash-out", label: "Convert to Cash", cost: 100000000, success: 95 },
      { id: "diversify", label: "Emergency Diversification", cost: 250000000, success: 70 }
    ]
  },
  {
    id: "personal-scandal",
    title: "Personal Scandal",
    severity: "HIGH",
    timeLimit: 48,
    description: "Leaked documents suggest tax avoidance schemes, media firestorm brewing",
    actions: [
      { id: "pr-blitz", label: "Full PR Counter-Campaign", cost: 75000000, success: 65 },
      { id: "charity-donation", label: "Major Charity Donation", cost: 500000000, success: 80 },
      { id: "legal-action", label: "Sue for Defamation", cost: 25000000, success: 40 },
      { id: "low-profile", label: "Go Low Profile", cost: 5000000, success: 55 }
    ]
  }
];

// Company Creation Options
export const STARTUP_SECTORS = [
  { id: "ai-ml", name: "Artificial Intelligence", funding: 500000000, potential: "Unicorn", timeframe: 36 },
  { id: "biotech", name: "Biotechnology", funding: 750000000, potential: "Mega-Corp", timeframe: 60 },
  { id: "fintech", name: "Financial Technology", funding: 300000000, potential: "IPO Ready", timeframe: 24 },
  { id: "cleantech", name: "Clean Technology", funding: 1000000000, potential: "Industry Leader", timeframe: 48 },
  { id: "aerospace", name: "Aerospace & Defense", funding: 2000000000, potential: "Government Contracts", timeframe: 72 },
  { id: "quantum", name: "Quantum Computing", funding: 1500000000, potential: "Tech Revolution", timeframe: 84 },
  { id: "robotics", name: "Advanced Robotics", funding: 800000000, potential: "Automation Leader", timeframe: 42 },
  { id: "gaming", name: "Gaming & Entertainment", funding: 400000000, potential: "Media Empire", timeframe: 30 }
];

// Lifestyle & Consumption Options
export const LIFESTYLE_PURCHASES = [
  { id: "private-chef", name: "Michelin Star Private Chef", cost: 500000, recurring: "annual" },
  { id: "security-team", name: "24/7 Security Detail", cost: 2000000, recurring: "annual" },
  { id: "personal-trainer", name: "Elite Personal Trainer", cost: 200000, recurring: "annual" },
  { id: "concierge", name: "Luxury Concierge Service", cost: 300000, recurring: "annual" },
  { id: "private-doctor", name: "Personal Physician", cost: 750000, recurring: "annual" },
  { id: "art-curator", name: "Personal Art Curator", cost: 400000, recurring: "annual" },
  { id: "wine-sommelier", name: "Master Sommelier", cost: 250000, recurring: "annual" },
  { id: "fashion-stylist", name: "Celebrity Fashion Stylist", cost: 350000, recurring: "annual" }
];

// Social Events & Networking
export const SOCIAL_EVENTS = [
  { id: "met-gala", name: "Host Met Gala Table", cost: 5000000, prestige: 95, networking: 90 },
  { id: "davos-party", name: "Davos Private Party", cost: 3000000, prestige: 85, networking: 95 },
  { id: "cannes-yacht", name: "Cannes Film Festival Yacht Party", cost: 2500000, prestige: 80, networking: 75 },
  { id: "charity-gala", name: "Charity Gala Sponsorship", cost: 10000000, prestige: 90, networking: 70 },
  { id: "technology-summit", name: "Private Technology Summit", cost: 4000000, prestige: 75, networking: 85 },
  { id: "art-exhibition", name: "Museum Exhibition Sponsorship", cost: 15000000, prestige: 88, networking: 65 }
];

// Device-Specific Features
export const DEVICE_FEATURES = {
  DESKTOP: {
    multiWindow: true,
    advancedCharts: true,
    dayTrading: true,
    complexAnalytics: true,
    multiAssetView: true,
    keyboardShortcuts: true,
    dragAndDrop: true,
    contextMenus: true
  },
  MOBILE: {
    swipeGestures: true,
    pushNotifications: true,
    quickActions: true,
    voiceCommands: true,
    biometricAuth: true,
    mobilePay: true,
    cameraIntegration: true,
    locationServices: true
  },
  TABLET: {
    splitScreen: true,
    applePencilSupport: true,
    gestureNavigation: true,
    landscapeMode: true,
    multitasking: true,
    pinchZoom: true,
    rotationSupport: true,
    enhancedTouch: true
  }
};

// Advanced Game Mechanics
export const GAME_MECHANICS = {
  reputation: {
    categories: ["Business", "Philanthropy", "Innovation", "Political", "Social"],
    scale: [0, 100],
    effects: ["Deal Access", "Media Coverage", "Crisis Response", "Network Growth"]
  },
  influence: {
    types: ["Economic", "Political", "Cultural", "Technological", "Social"],
    measurement: "Influence Points",
    applications: ["Policy Changes", "Market Movements", "Public Opinion", "Industry Standards"]
  },
  legacy: {
    metrics: ["Wealth Created", "Lives Impacted", "Innovations Funded", "Institutions Built"],
    timeframe: "Generational",
    endgame: "Dynasty Evaluation"
  }
};