// Dream Home Real Estate - Indore Properties Data
// Stored in localStorage so admin edits, new additions, and deletions persist!

const DEFAULT_PROPERTIES = [
  {
    id: "dh-101",
    title: "Avenue Grandeur - Premium Gated Plots",
    titleHi: "एवेन्यू ग्रैंड्योर - प्रीमियम गेटेड प्लॉट्स",
    category: "plots",
    categoryName: "Residential Plots",
    categoryNameHi: "रेसिडेंशियल प्लॉट्स",
    price: "₹ 38.5 Lakh",
    priceNumeric: 3850000,
    pricePerSqFt: "₹ 3,850 / sq.ft",
    location: "Super Corridor, Near TCS Square, Indore",
    locationHi: "सुपर कॉरिडोर, टीसीएस चौराहे के पास, इंदौर",
    area: "1,000 - 2,400 sq.ft",
    facing: "East / North Facing Available",
    reraNo: "P-IND-24-3829 (RERA Approved)",
    status: "Featured Deal",
    badgeType: "featured",
    image: "assets/images/prop_plots_supercorridor.jpg",
    gallery: [
      "assets/images/prop_plots_supercorridor.jpg",
      "assets/images/category_plots.jpg"
    ],
    description: "IDA approved, prime location residential plots in a fully gated society on Super Corridor Indore. Wide 60ft and 40ft concrete roads, underground electrification, modern clubhouse, 24x7 security, and landscaped gardens. Just 5 minutes from TCS and Infosys campus.",
    descriptionHi: "आईडीए स्वीकृत, सुपर कॉरिडोर इंदौर पर पूरी तरह से गेटेड टाउनशिप में प्राइम लोकेशन आवासीय प्लॉट। 60 फीट व 40 फीट चौड़ी कंक्रीट सड़कें, अंडरग्राउंड बिजली, आधुनिक क्लब हाउस और 24 घंटे सुरक्षा। टीसीएस और इंफोसिस से मात्र 5 मिनट की दूरी।",
    amenities: [
      "Gated Society with Guard",
      "Underground Electricity & Water",
      "60ft Wide Concrete Roads",
      "Landscaped Park & Walking Track",
      "RERA & IDA Approved",
      "Instant Registry & Bank Finance"
    ],
    highlights: ["5 Min to Metro Station", "Near TCS & Infosys", "High Appreciation Zone"]
  },
  {
    id: "dh-102",
    title: "The Imperial Heights - Luxury 3 & 4 BHK Flats",
    titleHi: "द इम्पीरियल हाइट्स - लक्जरी 3 और 4 बीएचके फ्लैट्स",
    category: "flats",
    categoryName: "Flats",
    categoryNameHi: "फ्लैट्स",
    price: "₹ 82 Lakh - 1.45 Cr",
    priceNumeric: 8200000,
    pricePerSqFt: "₹ 5,200 / sq.ft",
    location: "Vijay Nagar, Near Brilliant Convention, Indore",
    locationHi: "विजय नगर, ब्रिलियंट कन्वेंशन के पास, इंदौर",
    area: "1,650 - 2,800 sq.ft",
    facing: "Park Facing Balconies",
    reraNo: "P-IND-23-2910 (RERA Approved)",
    status: "Ready to Move",
    badgeType: "hot",
    image: "assets/images/prop_flats_vijaynagar.jpg",
    gallery: [
      "assets/images/prop_flats_vijaynagar.jpg",
      "assets/images/category_flats.jpg"
    ],
    description: "Ultra-luxury modern apartments located in the heart of Vijay Nagar, Indore. Features Italian marble flooring, 11ft ceilings, panoramic glass balconies, infinity swimming pool, automated 3-tier parking, and rooftop sky lounge.",
    descriptionHi: "इंदौर के पॉश विजय नगर में स्थित अल्ट्रा-लक्जरी आधुनिक अपार्टमेंट। इटैलियन मार्बल फ्लोरिंग, मनोरम ग्लास बालकनी, इन्फिनिटी स्विमिंग पूल, 3-टियर पार्किंग और रूफटॉप क्लब हाउस के साथ।",
    amenities: [
      "Swimming Pool & Kids Pool",
      "Modern Gymnasium & Yoga Studio",
      "Reserved Covered Car Parking",
      "High Speed Automatic Elevators",
      "Power Backup for All Flats",
      "Banquet Hall & Guest Rooms"
    ],
    highlights: ["Vijay Nagar Prime Hub", "Walking to C21 & Malhar Mall", "100% Vastu Compliant"]
  },
  {
    id: "dh-103",
    title: "Aura Luxury Villa - 4 BHK Independent House",
    titleHi: "ऑरा लक्जरी विला - 4 बीएचके स्वतंत्र घर",
    category: "houses",
    categoryName: "Residential Houses",
    categoryNameHi: "रेसिडेंशियल हाउस",
    price: "₹ 1.85 Crore",
    priceNumeric: 18500000,
    pricePerSqFt: "₹ 5,780 / sq.ft",
    location: "Nipania, Near Apollo DB City, Indore",
    locationHi: "निपानिया, अपोलो डीबी सिटी के पास, इंदौर",
    area: "3,200 sq.ft (Built-up)",
    facing: "North-East Facing",
    reraNo: "P-IND-24-4102 (RERA Approved)",
    status: "Brand New Construction",
    badgeType: "featured",
    image: "assets/images/prop_villa_nipania.jpg",
    gallery: [
      "assets/images/prop_villa_nipania.jpg",
      "assets/images/category_houses.jpg"
    ],
    description: "Contemporary architect-designed 4 BHK duplex luxury villa in upscale Nipania. Includes private double-height living room, imported modular kitchen, private lawn garden, master bedroom with walk-in wardrobe, and terrace jacuzzi.",
    descriptionHi: "पॉश निपानिया में आधुनिक वास्तुशिल्प से निर्मित 4 बीएचके डुप्लेक्स स्वतंत्र विला। डबल-हाइट लिविंग रूम, इंपोर्टेड मॉड्यूलर किचन, प्राइवेट लॉन गार्डन, वॉक-इन वार्डरोब और छत पर जकूज़ी के साथ।",
    amenities: [
      "Private Landscaped Lawn",
      "Covered 2-Car Garage",
      "Modular Kitchen with Chimney",
      "Italian Marble & Wooden Flooring",
      "Video Door Phone & CCTV Security",
      "Solar Water Heater Fitted"
    ],
    highlights: ["Posh Nipania Locality", "Top Schools & Hospitals Nearby", "Immediate Registry & Possession"]
  },
  {
    id: "dh-104",
    title: "The Oasis - Scenic Luxury Farmhouse Estate",
    titleHi: "द ओएसिस - मनमोहक लक्जरी फार्महाउस एस्टेट",
    category: "farmhouses",
    categoryName: "Farmhouses",
    categoryNameHi: "फार्महाउस",
    price: "₹ 1.65 Crore",
    priceNumeric: 16500000,
    pricePerSqFt: "₹ 1,500 / sq.ft",
    location: "AB Bypass Road, Near Simrol Hills, Indore",
    locationHi: "एबी बाईपास रोड, सिमरोल हिल्स के पास, इंदौर",
    area: "11,000 sq.ft (1/4 Acre with Villa)",
    facing: "Green Valley Facing",
    reraNo: "Clear Title / T&CP Approved",
    status: "Exclusive Retreat",
    badgeType: "hot",
    image: "assets/images/prop_farmhouse_bypass.jpg",
    gallery: [
      "assets/images/prop_farmhouse_bypass.jpg",
      "assets/images/category_farmhouse.jpg"
    ],
    description: "Escape to peaceful luxury living just 25 minutes from central Indore. Features a built 3 BHK country villa, crystal-clear private swimming pool, wooden party deck, gazebo barbecue zone, 50+ fruit trees, boundary wall, and 24x7 caretaker.",
    descriptionHi: "सेंट्रल इंदौर से सिर्फ 25 मिनट की दूरी पर शांतिपूर्ण और आलीशान जीवन का अनुभव। 3 बीएचके कंट्री विला, प्राइवेट स्विमिंग पूल, लकड़ी का पार्टी डेक, गज़ेबो, 50+ फलदार पेड़ और 24 घंटे सुरक्षा।",
    amenities: [
      "Private Swimming Pool & Deck",
      "Fully Furnished 3 BHK Cottage",
      "Fruit Orchard & Drip Irrigation",
      "Gazebo Barbecue Pavilion",
      "Deep Tubewell with Sweet Water",
      "High Boundary Wall & Iron Gate"
    ],
    highlights: ["Clean Pollution-free Air", "Ideal for Family Weekends & Events", "High Land Capital Growth"]
  },
  {
    id: "dh-105",
    title: "Green Meadows - Premium Township Plots",
    titleHi: "ग्रीन मीडोज - प्रीमियम टाउनशिप प्लॉट्स",
    category: "plots",
    categoryName: "Residential Plots",
    categoryNameHi: "रेसिडेंशियल प्लॉट्स",
    price: "₹ 27.5 Lakh Onwards",
    priceNumeric: 2750000,
    pricePerSqFt: "₹ 2,750 / sq.ft",
    location: "Ujjain Road / Sanwer Road, Indore",
    locationHi: "उज्जैन रोड / सांवेर रोड, इंदौर",
    area: "800, 1000, 1500 sq.ft",
    facing: "All Facing Plots",
    reraNo: "P-IND-24-1180 (RERA Approved)",
    status: "New Launch",
    badgeType: "new",
    image: "assets/images/category_plots.jpg",
    gallery: ["assets/images/category_plots.jpg"],
    description: "Affordable and high-growth residential plots on the fast-expanding Ujjain 4-lane corridor. Ideal for immediate home construction or long-term investment. RERA approved with 80% bank loan available.",
    descriptionHi: "उज्जैन 4-लेन कॉरिडोर पर किफायती और तेजी से बढ़ने वाले आवासीय प्लॉट। तुरंत मकान निर्माण या भविष्य के शानदार निवेश के लिए उपयुक्त। रेरा स्वीकृत एवं 80% तक बैंक लोन उपलब्ध।",
    amenities: [
      "Grand Entry Gate",
      "Children Play Zone",
      "Temple inside Township",
      "Cement Concrete Roads",
      "Street Lighting & Drainage",
      "Clear Title Registry"
    ],
    highlights: ["Low Entry Price", "Connected to Ujjain 4-Lane", "Rapidly Developing Zone"]
  },
  {
    id: "dh-106",
    title: "Royal Enclave - 3 BHK Premium Flat",
    titleHi: "रॉयल एन्क्लेव - 3 बीएचके प्रीमियम फ्लैट",
    category: "flats",
    categoryName: "Flats",
    categoryNameHi: "फ्लैट्स",
    price: "₹ 58 Lakh",
    priceNumeric: 5800000,
    pricePerSqFt: "₹ 4,140 / sq.ft",
    location: "Rau - Bypass Link Road, Indore",
    locationHi: "राऊ - बाईपास लिंक रोड, इंदौर",
    area: "1,400 sq.ft",
    facing: "East Facing Corner Flat",
    reraNo: "P-IND-23-1765 (RERA Approved)",
    status: "Ready to Move",
    badgeType: "hot",
    image: "assets/images/category_flats.jpg",
    gallery: ["assets/images/category_flats.jpg"],
    description: "Spacious 3 BHK apartment with modular fittings, 2 large balconies with open views, dedicated car parking, lifts, and 24x7 security. Close to Rau circle, IIM Indore, and Pithampur industrial corridor.",
    descriptionHi: "विशाल 3 बीएचके फ्लैट, मॉड्यूलर किचन, 2 बड़ी बालकनी, खुली हवादार जगह, कार पार्किंग और लिफ्ट के साथ। राऊ चौराहा, आईआईएम इंदौर और पीथमपुर के नजदीक।",
    amenities: [
      "Covered Stilt Parking",
      "Clubhouse & Gym",
      "CCTV Surveillance",
      "Round-the-clock Water Supply",
      "Intercom Facility"
    ],
    highlights: ["Near IIM Indore & Rau", "Excellent Rental Demand", "Bank Loan from SBI, HDFC"]
  },
  {
    id: "dh-107",
    title: "Signature Grand - 3 BHK Modern Row House",
    titleHi: "सिग्नेचर ग्रैंड - 3 बीएचके मॉडर्न रो हाउस",
    category: "houses",
    categoryName: "Residential Houses",
    categoryNameHi: "रेसिडेंशियल हाउस",
    price: "₹ 75 Lakh",
    priceNumeric: 7500000,
    pricePerSqFt: "₹ 4,680 / sq.ft",
    location: "Bicholi Mardana, Near Bypass, Indore",
    locationHi: "बिचौली मर्दाना, बाईपास के पास, इंदौर",
    area: "1,600 sq.ft Built-up",
    facing: "West Facing",
    reraNo: "P-IND-24-3450 (RERA Approved)",
    status: "Under Construction (Possession Soon)",
    badgeType: "new",
    image: "assets/images/category_houses.jpg",
    gallery: ["assets/images/category_houses.jpg"],
    description: "Modern duplex independent house in a secure gated township. Contemporary elevation with texture paint, false ceiling with LED ambient lights, modular kitchen, and terrace garden space.",
    descriptionHi: "सुरक्षित गेटेड टाउनशिप में आधुनिक 3 बीएचके स्वतंत्र रो हाउस। आकर्षक आधुनिक एलिवेशन, फॉल्स सीलिंग, मॉड्यूलर किचन और टेरेस गार्डन स्पेस।",
    amenities: [
      "Gated Community Security",
      "Internal 30ft CC Roads",
      "Kids Play Area & Garden",
      "Personal Covered Porch",
      "Overhead Water Tank"
    ],
    highlights: ["Direct Bypass Access", "Close to Delhi Public School", "Posh Green Environs"]
  },
  {
    id: "dh-108",
    title: "Pine Valley - Rustic Cottage Farmhouse",
    titleHi: "पाइन वैली - रस्टिक कॉटेज फार्महाउस",
    category: "farmhouses",
    categoryName: "Farmhouses",
    categoryNameHi: "फार्महाउस",
    price: "₹ 95 Lakh",
    priceNumeric: 9500000,
    pricePerSqFt: "₹ 1,350 / sq.ft",
    location: "Khandwa Road / Simrol, Indore",
    locationHi: "खंडवा रोड / सिमरोल, इंदौर",
    area: "7,000 sq.ft Land with 1,200 sq.ft Cottage",
    facing: "North Facing",
    reraNo: "Clear Registry / Mutation Done",
    status: "Immediate Handover",
    badgeType: "featured",
    image: "assets/images/category_farmhouse.jpg",
    gallery: ["assets/images/category_farmhouse.jpg"],
    description: "A cozy stone-and-wood countryside cottage farmhouse surrounded by hills and green trees. Features a stone porch, landscaped flowering lawn, solar lights, organic vegetable patch, and boundary wall.",
    descriptionHi: "पहाड़ियों और हरियाली से घिरा सुंदर स्टोन और वुडन कॉटेज फार्महाउस। स्टोन पोर्च, सजावटी लॉन, सोलर लाइट्स, ऑर्गेनिक सब्जी बगीचा और सुरक्षित बाउंड्री वॉल के साथ।",
    amenities: [
      "Ready Stone Cottage",
      "Boundary Wall with Iron Gate",
      "Electricity & Water Boring",
      "Organic Fruit Trees",
      "Campfire & Outdoor Dining Area"
    ],
    highlights: ["Scenic Hill Views", "IIT Indore & Simrol Vicinity", "Weekend Family Getaway"]
  }
];

const LOCAL_STORAGE_KEY = "dream_home_indore_properties_v1";
const BOOKINGS_STORAGE_KEY = "dream_home_indore_bookings_v1";

// Helper functions for Property Data
function getStoredProperties() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROPERTIES));
      return DEFAULT_PROPERTIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROPERTIES;
  } catch (e) {
    console.error("Error reading localStorage", e);
    return DEFAULT_PROPERTIES;
  }
}

function savePropertiesToStorage(props) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(props));
    return true;
  } catch (e) {
    console.error("Error saving properties", e);
    return false;
  }
}

function resetPropertiesToDefault() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROPERTIES));
  return DEFAULT_PROPERTIES;
}

function getStoredBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveBooking(booking) {
  try {
    const bookings = getStoredBookings();
    bookings.unshift(booking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    return true;
  } catch (e) {
    return false;
  }
}
