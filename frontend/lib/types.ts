// MyCarPortal — Domain types (frontend dummy phase)
// בשלב הבא (Module 7-8) הטיפוסים ייבנו על בסיס Supabase schema.

export interface Owner {
  date: string;          // "03/2019"
  type: "פרטי" | "החכר (ליסינג)" | "חברה" | "סוחר" | "השכרה";
  durationMonths?: number;
  current?: boolean;
}

export interface Recall {
  id: string;
  description: string;
  openedAt: string;       // "2024"
  fix?: string;           // אופן תיקון (OFEN_TIKUN)
  importer?: string;      // היבואן המטפל (YEVUAN_TEUR)
  phone?: string;         // טלפון היבואן
  open: boolean;
}

export interface SafetyFeatures {
  airbags: number;
  abs: boolean;
  esp: boolean;            // בקרת יציבות
  laneAssist: boolean;
  collisionWarning: boolean;
  pedestrianDetect: boolean;
  reverseCamera: boolean;
  emergencyBrake: boolean;
  blindSpot: boolean;
  autoLights: boolean;
  safetyScore: number;
  // הרחבות ADAS
  adaptiveCruise?: boolean;        // בקרת שיוט אדפטיבית
  trafficSignRecognition?: boolean; // זיהוי תמרורים
  tirePressure?: boolean;          // חיישני לחץ אוויר בצמיגים
  seatbeltReminder?: boolean;      // חיישני חגורות
  reverseAeb?: boolean;            // בלימת חירום ברוורס
  autoLightsForward?: boolean;     // תאורה אוטומטית בנסיעה קדימה
  equipLevel?: number;             // רמת אבזור בטיחותי 0–8
}

export interface Vehicle {
  // identity
  id: string;
  plate: string;
  manufacturer: string;        // "טויוטה"
  manufacturerSlug: string;    // "toyota" — for logo CDN
  manufacturerCountry: string; // "יפן"
  model: string;               // "COROLLA"
  trim?: string;               // "COMFORT"
  year: number;
  color: string;
  fuelType: string;
  yad: number;                 // מספר יד (חישוב)
  // engine
  engineCC: number;
  horsepower: number;
  drivetrain: string;          // "קדמית"
  gearbox: string;             // "אוטומטית"
  bodyType: string;            // "סדאן"
  doors: number;
  seats: number;
  weightKg: number;
  towingKg: number;
  // history
  firstRegistrationDate: string;
  testLastDate: string;
  testExpiryDate: string;
  testExpired: boolean;     // האם תוקף הרישיון פג (מחושב בשרת)
  kmAtLastTest: number;
  structuralChange: boolean;
  colorChanged: boolean;
  towHook: boolean;
  tireChanged: boolean;
  // ownership
  owners: Owner[];
  // recalls
  recalls: Recall[];
  // safety
  safety: SafetyFeatures;
  // environment
  greenScore: number;          // 0-15
  pollutionGroup: number;
  co2: number;                 // g/km
  nox: number;                 // g/km
  pmWltp?: number;             // g/km
  hcWltp?: number;             // g/km
  coWltp?: number;             // g/km
  emissionStandard?: string;   // sug_tkina_nm — תקן זיהום
  converterType?: string;      // sug_mamir_nm — סוג ממיר
  propulsion?: string;         // technologiat_hanaa_nm
  // ownership / fees / price
  licenseFeeGroup?: number;    // kvuzat_agra_cd
  towingNoBrakes?: number;     // ק"ג ללא בלמים
  originalPrice?: number;      // מחיר מחירון מקורי — חדש מהיבואן בשנת הייצור (₪)
  // comfort equipment (מהמפרט)
  hasAC?: boolean;             // mazgan_ind
  powerSteering?: boolean;     // hege_koah_ind
  electricWindows?: number;    // mispar_halonot_hashmal
  // tires
  tireFront: string;
  tireRear: string;
  loadFront: number;
  loadRear: number;
  speedRating: string;
  speedRatingRear: string;
  // disability tag
  hasDisabilityTag: boolean;
  disabilityTagDate?: string;  // תאריך הנפקת תג (MM/YYYY)
  // public vehicle history (מונית / אוטובוס)
  isPublicVehicle?: boolean;
  publicVehicleType?: string;  // "מונית" וכו'
  // identifiers / status
  chassis?: string;            // misgeret — מספר שלדה (VIN)
  isPersonalImport?: boolean;  // יבוא אישי
  importType?: string;         // sug_yevu
  status?: "active" | "inactive" | "decommissioned";
  // image
  imageUrl?: string;
  // פופולריות ואמינות הדגם (מ-dataset כמויות לפי דגם)
  modelActiveCount?: number;    // כמה מהדגם פעילים על הכביש
  modelInactiveCount?: number;  // כמה ירדו מהכביש
}

// Vehicle — מצב ניהול עבור משתמש מחובר
export interface MyVehicle extends Vehicle {
  nickname?: string;
  insuranceExpiryDate: string;
  daysToTestExpiry: number;
  daysToInsuranceExpiry: number;
}

export interface SearchHistoryItem {
  id: string;
  plate: string;
  manufacturer: string;
  model: string;
  year: number;
  searchedAt: string;     // ISO
}

export interface FavoriteItem extends SearchHistoryItem {
  notes?: string;
  addedAt: string;
}

export interface ServiceRecord {
  id: string;
  type: "oil" | "tires" | "brakes" | "battery" | "ac" | "timing_belt" | "general" | "accident_repair" | "other";
  title: string;
  description?: string;
  garage?: string;
  cost: number;
  kmAtService: number;
  serviceDate: string;     // ISO
}

export interface VehicleDocument {
  id: string;
  type: "license" | "insurance" | "test" | "receipt" | "other";
  name: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Reminder {
  id: string;
  vehicleId: string;
  type: "test" | "insurance" | "custom";
  title: string;
  dueDate: string;         // ISO
  daysLeft: number;
  tone: "good" | "warn" | "high";
}
