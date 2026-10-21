export const ROOMS_DATA = [
  {
    id: "standard-room",
    name: "Standard Room",
    nameTl: "Standard Kuwarto",
    category: "Standard",
    price: 1200,
    capacity: 2,
    size: "22 m²",
    bed: "1 Queen Bed",
    view: "Street View",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
    description:
      "A cozy and clean room with aircon, private bathroom, free Wi-Fi, and flat screen TV. Perfect for solo or couples.",
    descriptionTl:
      "Komportableng kuwarto na may aircon, sariling banyo, libreng Wi-Fi, at TV. Bagay sa mag-asawa o nag-iisa.",
    amenities: [
      "Air Conditioning",
      "Free Fast Wi-Fi",
      "Private Bathroom",
      "Cable TV",
      "Hot & Cold Shower",
    ],
  },
  {
    id: "deluxe-queen",
    name: "Deluxe Queen Room",
    nameTl: "Deluxe Queen Kuwarto",
    category: "Deluxe",
    price: 1600,
    capacity: 2,
    size: "28 m²",
    bed: "1 Queen Bed + Work Desk",
    view: "Town View",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80",
    description:
      "Spacious air-conditioned room with extra space, work desk, mini fridge, and complimentary bottled water and coffee.",
    descriptionTl:
      "Mas malaking kuwarto na may aircon, lamesa pang-trabaho, maliit na refrigerator, at libreng kape at tubig.",
    amenities: [
      "Aircon",
      "Free Wi-Fi",
      "Mini Refrigerator",
      "Hot Shower",
      "Complimentary Water",
      "Work Table",
    ],
  },
  {
    id: "family-room",
    name: "Family Suite Room",
    nameTl: "Pampamilyang Kuwarto",
    category: "Family",
    price: 2400,
    capacity: 4,
    size: "36 m²",
    bed: "2 Double Queen Beds",
    view: "Plaza & Garden View",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
    description:
      "Designed for families or friends visiting Roxas. Features 2 large beds, spacious bath, and seating area.",
    descriptionTl:
      "Maganda para sa buong pamilya o magbabarkada. May dalawang malalaking kama at maluwag na banyo.",
    amenities: [
      "2 Queen Beds",
      "Air Conditioning",
      "Free Wi-Fi",
      "Large Bathroom",
      "Electric Kettle",
      "Seating Chairs",
    ],
  },

  {
    id: "barkada-dorm",
    name: "Barkada Group Room",
    nameTl: "Barkada Group Kuwarto",
    category: "Group",
    price: 3200,
    capacity: 6,
    size: "45 m²",
    bed: "3 Bunk Beds / Twin Beds",
    view: "Seawall Breeze View",
    image:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=80",
    description:
      "Affordable group stay for up to 6 persons. Great for student trips, events, or island travelers heading to Caticlan port.",
    descriptionTl:
      "Abot-kaya para sa grupo o barkada hanggang 6 katao. Maganda para sa mga bibiyahe o may lakad sa Roxas.",
    amenities: [
      "Good for 6 Persons",
      "Aircon",
      "Free Wi-Fi",
      "Lockers",
      "Hot Shower",
      "Spacious Area",
    ],
  },
];

export const DINING_DATA = [
  {
    id: "breakfast",
    title: "Morning Breakfast & Silog Bar",
    titleTl: "Almusal at Silog Corner",
    tagline: "Simple, Delicious & Affordable",
    taglineTl: "Masarap at Abot-kayang Almusal",
    hours: "6:30 AM - 10:00 AM",
    image:
      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80",
    description:
      "Start your day with hot Filipino breakfast favorites like Tapsilog, Tocilog, hot coffee, and fresh bread.",
  },
  {
    id: "coffee-snack",
    title: "DIVAA Snack & Refreshment Corner",
    titleTl: "DIVAA Snack & Inumin Corner",
    tagline: "Coffee, Cool Drinks & Quick Bites",
    taglineTl: "Masarap na Kape at Meryenda",
    hours: "10:00 AM - 8:00 PM",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    description:
      "Grab cold refreshments, iced coffee, snacks, and treats after walking from the Seawall or Plaza.",
  },
  {
    id: "rooftop",
    title: "Rooftop Chill & Relax Deck",
    titleTl: "Rooftop Pahingahan",
    tagline: "Fresh Sea Breeze & Sunset View",
    taglineTl: "Preskong Hangin mula sa Dagat",
    hours: "4:00 PM - 10:00 PM",
    image:
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80",
    description:
      "An open-air roof deck where guests can sit down, feel the coastal breeze, and watch the Roxas sunset.",
  },
];

export const TRANSLATIONS = {
  en: {
    nav: {
      home: "Home",
      hotel: "The hotel",
      rooms: "Our rooms",
      dining: "Food and drink",
      contact: "Contact",
      booking: "Booking",
    },
    hero: {
      rating: "4.4 (Google reviews)",
      headline: "Spend your moments with DIVAA HOTEL",
      bookNow: "Book now",
      contactUs: "Contact us",
      stat1Number: "5 min",
      stat1Label: "walk to Roxas Seawall",
      stat2Number: "Near",
      stat2Label: "Roxas Municipal Plaza",
      stat3Number: "Bagumbayan",
      stat3Label: "Roxas, Oriental Mindoro",
    },
  },
  tl: {
    nav: {
      home: "Tahanan",
      hotel: "Ang Hotel",
      rooms: "Mga Kuwarto",
      dining: "Pagkain at Inumin",
      contact: "Kontak",
      booking: "Mag-book",
    },
    hero: {
      rating: "4.4 (Google reviews)",
      headline: "Spend your moments with DIVAA HOTEL",
      bookNow: "Mag-book ngayon",
      contactUs: "Makipag-ugnayan",
      stat1Number: "5 min",
      stat1Label: "lakad papuntang Seawall",
      stat2Number: "Malapit sa",
      stat2Label: "Roxas Municipal Plaza",
      stat3Number: "Bagumbayan",
      stat3Label: "Roxas, Oriental Mindoro",
    },
  },
};
