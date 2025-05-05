export const moroccoLocalization = {
  // Contact Information
  contact: {
    phone: "+212 522-123456",
    whatsapp: "+212 661-123456",
    email: "contact@carshare.ma",
    address: "123 Avenue Mohammed V, Casablanca, Maroc",
    businessHours: "Lundi - Vendredi: 9h00 - 18h00",
  },

  // Social Media
  socialMedia: {
    instagram: "https://www.instagram.com/carshare.ma",
    facebook: "https://www.facebook.com/carshare.ma",
    whatsapp: "https://wa.me/212661123456",
  },

  // Pricing
  pricing: {
    currency: "MAD",
    currencySymbol: "د.م.",
    formats: {
      price: (amount: number) => `${amount} د.م.`,
      perDay: (amount: number) => `${amount} د.م./jour`,
      perHour: (amount: number) => `${amount} د.م./heure`,
    },
    ranges: {
      economy: { min: 200, max: 400 },
      standard: { min: 400, max: 800 },
      luxury: { min: 800, max: 2000 },
    },
  },

  // Cities
  cities: [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fès",
    "Tanger",
    "Agadir",
    "Meknès",
    "Oujda",
    "Tétouan",
    "Laâyoune",
  ],

  // Common Moroccan Names
  names: {
    firstNames: [
      "Mohammed",
      "Fatima",
      "Ahmed",
      "Amina",
      "Youssef",
      "Sara",
      "Karim",
      "Laila",
      "Hassan",
      "Nadia",
    ],
    lastNames: [
      "Alaoui",
      "Benali",
      "Chraibi",
      "El Fassi",
      "Hassani",
      "Idrissi",
      "Kabbaj",
      "Lahlou",
      "Mansouri",
      "Naciri",
    ],
  },

  // Moroccan Addresses
  addresses: {
    streets: [
      "Avenue Mohammed V",
      "Boulevard Hassan II",
      "Rue Zerktouni",
      "Avenue des FAR",
      "Boulevard Anfa",
      "Rue Tariq Ibn Ziad",
      "Avenue Hassan I",
      "Boulevard Mohammed V",
      "Rue Al Massira",
      "Avenue des FAR",
    ],
    districts: [
      "Maârif",
      "Ain Diab",
      "Salmia",
      "Derb Sultan",
      "Hay Riad",
      "Agdal",
      "Souissi",
      "L'Océan",
      "Ain Sebaa",
      "Sidi Bernoussi",
    ],
  },

  // Moroccan Phone Numbers
  phoneNumbers: {
    formats: {
      mobile: "+212 6XX-XXXXXX",
      landline: "+212 5XX-XXXXXX",
    },
    prefixes: {
      mobile: ["06", "07"],
      landline: ["05"],
    },
  },

  // Moroccan Dates and Times
  dates: {
    format: "DD/MM/YYYY",
    timeFormat: "HH:mm",
    timezone: "Africa/Casablanca",
  },

  // Moroccan Holidays
  holidays: [
    "Jour de l'An",
    "Fête du Trône",
    "Révolution du Roi et du Peuple",
    "Fête de la Jeunesse",
    "Anniversaire de la Marche Verte",
    "Fête de l'Indépendance",
    "Aïd Al-Fitr",
    "Aïd Al-Adha",
    "Mouloud",
    "1er Moharram",
  ],
} 