// Static location dataset: State -> District -> Block -> Metadata & Village details
// Pure data, no runtime logic dependencies.

export const LOCATIONS = {
  "Uttar Pradesh": {
    Lucknow: {
      Malihabad: {
        population: 5200,
        literacy_rate: 68,
        primary_occupation: "Mixed",
        nearest_city_km: 28,
        villages: [
          { name: "Rasoolpur", population: 3200, literacy_rate: 65, primary_occupation: "Agriculture", nearest_city_km: 28 },
          { name: "Amethia", population: 4800, literacy_rate: 70, primary_occupation: "Mixed", nearest_city_km: 26 },
          { name: "Kasmandi Kalan", population: 4100, literacy_rate: 62, primary_occupation: "Agriculture", nearest_city_km: 30 },
        ],
      },
      "Bakshi Ka Talab": {
        population: 4100,
        literacy_rate: 64,
        primary_occupation: "Agriculture",
        nearest_city_km: 22,
        villages: [
          { name: "Kathwara", population: 3800, literacy_rate: 66, primary_occupation: "Agriculture", nearest_city_km: 20 },
          { name: "Bargadi Magath", population: 4500, literacy_rate: 63, primary_occupation: "Labor", nearest_city_km: 24 },
        ],
      },
    },
    Kanpur: {
      Bilhaur: {
        population: 6400,
        literacy_rate: 61,
        primary_occupation: "Agriculture",
        nearest_city_km: 35,
        villages: [
          { name: "Makanpur", population: 5100, literacy_rate: 59, primary_occupation: "Agriculture", nearest_city_km: 36 },
          { name: "Araul", population: 4200, literacy_rate: 64, primary_occupation: "Mixed", nearest_city_km: 34 },
        ],
      },
      Ghatampur: {
        population: 3800,
        literacy_rate: 57,
        primary_occupation: "Labor",
        nearest_city_km: 40,
        villages: [
          { name: "Reona", population: 3600, literacy_rate: 55, primary_occupation: "Labor", nearest_city_km: 42 },
          { name: "Padri", population: 4100, literacy_rate: 58, primary_occupation: "Agriculture", nearest_city_km: 39 },
        ],
      },
    },
    Varanasi: {
      Pindra: {
        population: 4700,
        literacy_rate: 66,
        primary_occupation: "Mixed",
        nearest_city_km: 25,
        villages: [
          { name: "Phoolpur", population: 4900, literacy_rate: 68, primary_occupation: "Mixed", nearest_city_km: 24 },
          { name: "Karoma", population: 3400, literacy_rate: 63, primary_occupation: "Agriculture", nearest_city_km: 27 },
        ],
      },
      Cholapur: {
        population: 5600,
        literacy_rate: 63,
        primary_occupation: "Agriculture",
        nearest_city_km: 18,
        villages: [
          { name: "Dhanapur", population: 5200, literacy_rate: 62, primary_occupation: "Agriculture", nearest_city_km: 19 },
          { name: "Babatpur Khurd", population: 4600, literacy_rate: 65, primary_occupation: "Mixed", nearest_city_km: 17 },
        ],
      },
    },
  },
  "Madhya Pradesh": {
    Bhopal: {
      Berasia: {
        population: 6100,
        literacy_rate: 70,
        primary_occupation: "Mixed",
        nearest_city_km: 32,
        villages: [
          { name: "Nazirabad", population: 4200, literacy_rate: 68, primary_occupation: "Agriculture", nearest_city_km: 35 },
          { name: "Runaha", population: 3900, literacy_rate: 71, primary_occupation: "Mixed", nearest_city_km: 30 },
        ],
      },
      Phanda: {
        population: 7300,
        literacy_rate: 72,
        primary_occupation: "Mixed",
        nearest_city_km: 12,
        villages: [
          { name: "Barkheda", population: 6800, literacy_rate: 74, primary_occupation: "Mixed", nearest_city_km: 10 },
          { name: "Khajuri Sadak", population: 5400, literacy_rate: 70, primary_occupation: "Labor", nearest_city_km: 14 },
        ],
      },
    },
    Indore: {
      Depalpur: {
        population: 5400,
        literacy_rate: 69,
        primary_occupation: "Agriculture",
        nearest_city_km: 38,
        villages: [
          { name: "Gautampura", population: 4700, literacy_rate: 67, primary_occupation: "Agriculture", nearest_city_km: 40 },
          { name: "Betma", population: 5900, literacy_rate: 71, primary_occupation: "Mixed", nearest_city_km: 32 },
        ],
      },
      Sanwer: {
        population: 6800,
        literacy_rate: 71,
        primary_occupation: "Mixed",
        nearest_city_km: 20,
        villages: [
          { name: "Kshipra", population: 5100, literacy_rate: 73, primary_occupation: "Mixed", nearest_city_km: 18 },
          { name: "Baloda", population: 4300, literacy_rate: 68, primary_occupation: "Agriculture", nearest_city_km: 23 },
        ],
      },
    },
    Jabalpur: {
      Patan: {
        population: 3400,
        literacy_rate: 58,
        primary_occupation: "Labor",
        nearest_city_km: 30,
        villages: [
          { name: "Belkheda", population: 3200, literacy_rate: 56, primary_occupation: "Labor", nearest_city_km: 32 },
          { name: "Shahpura", population: 4100, literacy_rate: 60, primary_occupation: "Agriculture", nearest_city_km: 28 },
        ],
      },
      Sihora: {
        population: 4900,
        literacy_rate: 65,
        primary_occupation: "Agriculture",
        nearest_city_km: 27,
        villages: [
          { name: "Majholi", population: 4600, literacy_rate: 64, primary_occupation: "Agriculture", nearest_city_km: 26 },
          { name: "Gosalpur", population: 3800, literacy_rate: 66, primary_occupation: "Mixed", nearest_city_km: 29 },
        ],
      },
    },
  },
  Rajasthan: {
    Jaipur: {
      Amber: {
        population: 5800,
        literacy_rate: 67,
        primary_occupation: "Mixed",
        nearest_city_km: 11,
        villages: [
          { name: "Kukas", population: 4600, literacy_rate: 69, primary_occupation: "Mixed", nearest_city_km: 14 },
          { name: "Chandwaji", population: 5200, literacy_rate: 65, primary_occupation: "Labor", nearest_city_km: 18 },
        ],
      },
      Sanganer: {
        population: 7900,
        literacy_rate: 75,
        primary_occupation: "Mixed",
        nearest_city_km: 5,
        villages: [
          { name: "Muhana", population: 6200, literacy_rate: 76, primary_occupation: "Agriculture", nearest_city_km: 8 },
          { name: "Watika", population: 5400, literacy_rate: 72, primary_occupation: "Mixed", nearest_city_km: 12 },
        ],
      },
    },
    Jodhpur: {
      Bilara: {
        population: 4300,
        literacy_rate: 55,
        primary_occupation: "Agriculture",
        nearest_city_km: 34,
        villages: [
          { name: "Pipar", population: 4800, literacy_rate: 57, primary_occupation: "Mixed", nearest_city_km: 30 },
          { name: "Khejarla", population: 3600, literacy_rate: 53, primary_occupation: "Labor", nearest_city_km: 38 },
        ],
      },
      Osian: {
        population: 2600,
        literacy_rate: 47,
        primary_occupation: "Labor",
        nearest_city_km: 39,
        villages: [
          { name: "Mathania", population: 3100, literacy_rate: 49, primary_occupation: "Agriculture", nearest_city_km: 36 },
          { name: "Tiwari", population: 2800, literacy_rate: 46, primary_occupation: "Labor", nearest_city_km: 41 },
        ],
      },
    },
    Udaipur: {
      Girwa: {
        population: 5100,
        literacy_rate: 62,
        primary_occupation: "Mixed",
        nearest_city_km: 15,
        villages: [
          { name: "Bhuwana", population: 5600, literacy_rate: 66, primary_occupation: "Mixed", nearest_city_km: 12 },
          { name: "Kaya", population: 3700, literacy_rate: 58, primary_occupation: "Agriculture", nearest_city_km: 18 },
        ],
      },
      Gogunda: {
        population: 2200,
        literacy_rate: 45,
        primary_occupation: "Agriculture",
        nearest_city_km: 37,
        villages: [
          { name: "Jaswantgarh", population: 2400, literacy_rate: 46, primary_occupation: "Agriculture", nearest_city_km: 35 },
          { name: "Rawach", population: 2100, literacy_rate: 45, primary_occupation: "Labor", nearest_city_km: 40 },
        ],
      },
    },
  },
  Maharashtra: {
    Mumbai: {
      Andheri: {
        population: 8800,
        literacy_rate: 79,
        primary_occupation: "Mixed",
        nearest_city_km: 4,
        villages: [
          { name: "Versova Village", population: 7200, literacy_rate: 78, primary_occupation: "Fishing", nearest_city_km: 5 },
          { name: "Marol Gaon", population: 6800, literacy_rate: 80, primary_occupation: "Mixed", nearest_city_km: 4 },
        ],
      },
      Kurla: {
        population: 9200,
        literacy_rate: 76,
        primary_occupation: "Labor",
        nearest_city_km: 6,
        villages: [
          { name: "Chunabhatti", population: 7600, literacy_rate: 74, primary_occupation: "Labor", nearest_city_km: 7 },
          { name: "Kasaiwada", population: 6900, literacy_rate: 77, primary_occupation: "Mixed", nearest_city_km: 6 },
        ],
      },
    },
    Pune: {
      Haveli: {
        population: 7600,
        literacy_rate: 78,
        primary_occupation: "Mixed",
        nearest_city_km: 14,
        villages: [
          { name: "Wagholi", population: 8200, literacy_rate: 80, primary_occupation: "Mixed", nearest_city_km: 12 },
          { name: "Uruli Kanchan", population: 6100, literacy_rate: 75, primary_occupation: "Agriculture", nearest_city_km: 18 },
        ],
      },
      Baramati: {
        population: 6400,
        literacy_rate: 74,
        primary_occupation: "Agriculture",
        nearest_city_km: 36,
        villages: [
          { name: "Malegaon Budruk", population: 5300, literacy_rate: 73, primary_occupation: "Agriculture", nearest_city_km: 34 },
          { name: "Katewadi", population: 4800, literacy_rate: 76, primary_occupation: "Agriculture", nearest_city_km: 38 },
        ],
      },
    },
    Nashik: {
      Dindori: {
        population: 5200,
        literacy_rate: 69,
        primary_occupation: "Agriculture",
        nearest_city_km: 26,
        villages: [
          { name: "Vani", population: 4900, literacy_rate: 70, primary_occupation: "Agriculture", nearest_city_km: 28 },
          { name: "Khedgaon", population: 4100, literacy_rate: 67, primary_occupation: "Agriculture", nearest_city_km: 24 },
        ],
      },
      Niphad: {
        population: 6100,
        literacy_rate: 72,
        primary_occupation: "Agriculture",
        nearest_city_km: 32,
        villages: [
          { name: "Pimpalgaon Baswant", population: 6600, literacy_rate: 73, primary_occupation: "Mixed", nearest_city_km: 30 },
          { name: "Lasalgaon", population: 7100, literacy_rate: 71, primary_occupation: "Agriculture", nearest_city_km: 35 },
        ],
      },
    },
  },
  "Tamil Nadu": {
    Chennai: {
      Ambattur: {
        population: 8400,
        literacy_rate: 80,
        primary_occupation: "Mixed",
        nearest_city_km: 8,
        villages: [
          { name: "Padi", population: 7100, literacy_rate: 79, primary_occupation: "Labor", nearest_city_km: 7 },
          { name: "Mogappair", population: 8500, literacy_rate: 80, primary_occupation: "Mixed", nearest_city_km: 9 },
        ],
      },
      Guindy: {
        population: 7800,
        literacy_rate: 80,
        primary_occupation: "Mixed",
        nearest_city_km: 6,
        villages: [
          { name: "Velachery Gramam", population: 7400, literacy_rate: 80, primary_occupation: "Mixed", nearest_city_km: 6 },
          { name: "Madipakkam", population: 6900, literacy_rate: 78, primary_occupation: "Mixed", nearest_city_km: 8 },
        ],
      },
    },
    Madurai: {
      Melur: {
        population: 5800,
        literacy_rate: 71,
        primary_occupation: "Agriculture",
        nearest_city_km: 28,
        villages: [
          { name: "Kottampatti", population: 4300, literacy_rate: 69, primary_occupation: "Agriculture", nearest_city_km: 32 },
          { name: "Vellalur", population: 4900, literacy_rate: 72, primary_occupation: "Agriculture", nearest_city_km: 26 },
        ],
      },
      Vadipatti: {
        population: 4900,
        literacy_rate: 68,
        primary_occupation: "Labor",
        nearest_city_km: 31,
        villages: [
          { name: "Sholavandan", population: 5600, literacy_rate: 70, primary_occupation: "Agriculture", nearest_city_km: 27 },
          { name: "Alanganallur", population: 4200, literacy_rate: 66, primary_occupation: "Mixed", nearest_city_km: 34 },
        ],
      },
    },
    Coimbatore: {
      Pollachi: {
        population: 6600,
        literacy_rate: 77,
        primary_occupation: "Agriculture",
        nearest_city_km: 38,
        villages: [
          { name: "Anaimalai", population: 5100, literacy_rate: 76, primary_occupation: "Agriculture", nearest_city_km: 42 },
          { name: "Kinathukadavu", population: 5900, literacy_rate: 78, primary_occupation: "Mixed", nearest_city_km: 32 },
        ],
      },
      Sulur: {
        population: 7100,
        literacy_rate: 79,
        primary_occupation: "Mixed",
        nearest_city_km: 19,
        villages: [
          { name: "Irugur", population: 6400, literacy_rate: 80, primary_occupation: "Labor", nearest_city_km: 16 },
          { name: "Pallapalayam", population: 5700, literacy_rate: 77, primary_occupation: "Mixed", nearest_city_km: 21 },
        ],
      },
    },
  },
  Karnataka: {
    Bangalore: {
      Anekal: {
        population: 7400,
        literacy_rate: 76,
        primary_occupation: "Mixed",
        nearest_city_km: 28,
        villages: [
          { name: "Attibele", population: 6900, literacy_rate: 75, primary_occupation: "Labor", nearest_city_km: 26 },
          { name: "Jigani", population: 7800, literacy_rate: 78, primary_occupation: "Mixed", nearest_city_km: 24 },
        ],
      },
      Yelahanka: {
        population: 8200,
        literacy_rate: 80,
        primary_occupation: "Mixed",
        nearest_city_km: 16,
        villages: [
          { name: "Bagalur", population: 5900, literacy_rate: 77, primary_occupation: "Mixed", nearest_city_km: 18 },
          { name: "Hunasamaranahalli", population: 6400, literacy_rate: 79, primary_occupation: "Mixed", nearest_city_km: 14 },
        ],
      },
    },
    Mysore: {
      Nanjangud: {
        population: 5900,
        literacy_rate: 70,
        primary_occupation: "Agriculture",
        nearest_city_km: 24,
        villages: [
          { name: "Hullahalli", population: 4200, literacy_rate: 68, primary_occupation: "Agriculture", nearest_city_km: 28 },
          { name: "Debur", population: 3800, literacy_rate: 71, primary_occupation: "Mixed", nearest_city_km: 22 },
        ],
      },
      Hunsur: {
        population: 5200,
        literacy_rate: 68,
        primary_occupation: "Agriculture",
        nearest_city_km: 42,
        villages: [
          { name: "Bilikere", population: 4600, literacy_rate: 69, primary_occupation: "Agriculture", nearest_city_km: 38 },
          { name: "Ratnapuri", population: 3500, literacy_rate: 66, primary_occupation: "Labor", nearest_city_km: 44 },
        ],
      },
    },
    Hubli: {
      Dharwad: {
        population: 6800,
        literacy_rate: 77,
        primary_occupation: "Mixed",
        nearest_city_km: 18,
        villages: [
          { name: "Garag", population: 5100, literacy_rate: 74, primary_occupation: "Agriculture", nearest_city_km: 22 },
          { name: "Mugad", population: 4700, literacy_rate: 76, primary_occupation: "Labor", nearest_city_km: 16 },
        ],
      },
      Kundgol: {
        population: 4600,
        literacy_rate: 64,
        primary_occupation: "Agriculture",
        nearest_city_km: 25,
        villages: [
          { name: "Gudgeri", population: 3900, literacy_rate: 63, primary_occupation: "Agriculture", nearest_city_km: 28 },
          { name: "Saunshi", population: 4400, literacy_rate: 66, primary_occupation: "Labor", nearest_city_km: 22 },
        ],
      },
    },
  },
  Gujarat: {
    Ahmedabad: {
      Daskroi: {
        population: 6700,
        literacy_rate: 77,
        primary_occupation: "Mixed",
        nearest_city_km: 16,
        villages: [
          { name: "Bareja", population: 6100, literacy_rate: 76, primary_occupation: "Mixed", nearest_city_km: 18 },
          { name: "Kuha", population: 5200, literacy_rate: 78, primary_occupation: "Agriculture", nearest_city_km: 14 },
        ],
      },
      Sanand: {
        population: 7400,
        literacy_rate: 75,
        primary_occupation: "Mixed",
        nearest_city_km: 24,
        villages: [
          { name: "Changodar", population: 6800, literacy_rate: 73, primary_occupation: "Labor", nearest_city_km: 22 },
          { name: "Nidhrad", population: 4900, literacy_rate: 76, primary_occupation: "Agriculture", nearest_city_km: 26 },
        ],
      },
    },
    Surat: {
      Olpad: {
        population: 5800,
        literacy_rate: 73,
        primary_occupation: "Agriculture",
        nearest_city_km: 22,
        villages: [
          { name: "Sayan", population: 6300, literacy_rate: 75, primary_occupation: "Mixed", nearest_city_km: 19 },
          { name: "Masma", population: 4200, literacy_rate: 71, primary_occupation: "Agriculture", nearest_city_km: 24 },
        ],
      },
      Bardoli: {
        population: 6900,
        literacy_rate: 78,
        primary_occupation: "Agriculture",
        nearest_city_km: 34,
        villages: [
          { name: "Baben", population: 5500, literacy_rate: 79, primary_occupation: "Mixed", nearest_city_km: 32 },
          { name: "Afwa", population: 4800, literacy_rate: 76, primary_occupation: "Agriculture", nearest_city_km: 36 },
        ],
      },
    },
    Vadodara: {
      Padra: {
        population: 6200,
        literacy_rate: 74,
        primary_occupation: "Agriculture",
        nearest_city_km: 18,
        villages: [
          { name: "Mobha", population: 4800, literacy_rate: 72, primary_occupation: "Agriculture", nearest_city_km: 22 },
          { name: "Mahuvad", population: 5400, literacy_rate: 75, primary_occupation: "Mixed", nearest_city_km: 16 },
        ],
      },
      Waghodia: {
        population: 5500,
        literacy_rate: 71,
        primary_occupation: "Labor",
        nearest_city_km: 26,
        villages: [
          { name: "Limda", population: 5900, literacy_rate: 73, primary_occupation: "Mixed", nearest_city_km: 24 },
          { name: "Jarod", population: 4300, literacy_rate: 69, primary_occupation: "Labor", nearest_city_km: 28 },
        ],
      },
    },
  },
  "West Bengal": {
    Kolkata: {
      Alipore: {
        population: 8300,
        literacy_rate: 80,
        primary_occupation: "Mixed",
        nearest_city_km: 5,
        villages: [
          { name: "Chetla Gram", population: 7100, literacy_rate: 80, primary_occupation: "Labor", nearest_city_km: 5 },
          { name: "Majerhat", population: 6700, literacy_rate: 79, primary_occupation: "Mixed", nearest_city_km: 6 },
        ],
      },
      Behala: {
        population: 8900,
        literacy_rate: 80,
        primary_occupation: "Mixed",
        nearest_city_km: 9,
        villages: [
          { name: "Parnasree", population: 7800, literacy_rate: 80, primary_occupation: "Mixed", nearest_city_km: 8 },
          { name: "Sarsuna", population: 6600, literacy_rate: 78, primary_occupation: "Labor", nearest_city_km: 11 },
        ],
      },
    },
    Howrah: {
      Uluberia: {
        population: 6800,
        literacy_rate: 73,
        primary_occupation: "Labor",
        nearest_city_km: 32,
        villages: [
          { name: "Bauria", population: 6200, literacy_rate: 72, primary_occupation: "Labor", nearest_city_km: 28 },
          { name: "Birshibpur", population: 4900, literacy_rate: 74, primary_occupation: "Mixed", nearest_city_km: 35 },
        ],
      },
      Bagnan: {
        population: 5700,
        literacy_rate: 71,
        primary_occupation: "Agriculture",
        nearest_city_km: 44,
        villages: [
          { name: "Mellock", population: 4300, literacy_rate: 70, primary_occupation: "Agriculture", nearest_city_km: 42 },
          { name: "Deora", population: 3900, literacy_rate: 72, primary_occupation: "Fishing", nearest_city_km: 45 },
        ],
      },
    },
    Siliguri: {
      Matigara: {
        population: 6400,
        literacy_rate: 74,
        primary_occupation: "Mixed",
        nearest_city_km: 10,
        villages: [
          { name: "Shivmandir", population: 5800, literacy_rate: 76, primary_occupation: "Mixed", nearest_city_km: 8 },
          { name: "Khaprail", population: 4500, literacy_rate: 71, primary_occupation: "Agriculture", nearest_city_km: 12 },
        ],
      },
      Naxalbari: {
        population: 4800,
        literacy_rate: 66,
        primary_occupation: "Agriculture",
        nearest_city_km: 24,
        villages: [
          { name: "Hatighisa", population: 3700, literacy_rate: 64, primary_occupation: "Labor", nearest_city_km: 26 },
          { name: "Bagdogra Gaon", population: 5200, literacy_rate: 69, primary_occupation: "Mixed", nearest_city_km: 18 },
        ],
      },
    },
  },
  Bihar: {
    Patna: {
      Danapur: {
        population: 7600,
        literacy_rate: 69,
        primary_occupation: "Mixed",
        nearest_city_km: 12,
        villages: [
          { name: "Shahpur", population: 5600, literacy_rate: 67, primary_occupation: "Labor", nearest_city_km: 14 },
          { name: "Bibiganj", population: 6200, literacy_rate: 71, primary_occupation: "Mixed", nearest_city_km: 10 },
        ],
      },
      "Phulwari Sharif": {
        population: 7100,
        literacy_rate: 67,
        primary_occupation: "Labor",
        nearest_city_km: 10,
        villages: [
          { name: "Nohsa", population: 5300, literacy_rate: 65, primary_occupation: "Labor", nearest_city_km: 11 },
          { name: "Gonpura", population: 4700, literacy_rate: 68, primary_occupation: "Agriculture", nearest_city_km: 13 },
        ],
      },
    },
    Gaya: {
      "Bodh Gaya": {
        population: 5600,
        literacy_rate: 63,
        primary_occupation: "Mixed",
        nearest_city_km: 15,
        villages: [
          { name: "Mastipur", population: 4400, literacy_rate: 65, primary_occupation: "Mixed", nearest_city_km: 14 },
          { name: "Bakraur", population: 3800, literacy_rate: 61, primary_occupation: "Agriculture", nearest_city_km: 17 },
        ],
      },
      Sherghati: {
        population: 4300,
        literacy_rate: 54,
        primary_occupation: "Agriculture",
        nearest_city_km: 35,
        villages: [
          { name: "Hamzapur", population: 3600, literacy_rate: 52, primary_occupation: "Labor", nearest_city_km: 37 },
          { name: "Chhatarpur", population: 3100, literacy_rate: 55, primary_occupation: "Agriculture", nearest_city_km: 33 },
        ],
      },
    },
    Muzaffarpur: {
      Kanti: {
        population: 5900,
        literacy_rate: 59,
        primary_occupation: "Agriculture",
        nearest_city_km: 16,
        villages: [
          { name: "Damodarpur", population: 4900, literacy_rate: 60, primary_occupation: "Agriculture", nearest_city_km: 14 },
          { name: "Kalwari", population: 4100, literacy_rate: 57, primary_occupation: "Labor", nearest_city_km: 18 },
        ],
      },
      Marwan: {
        population: 4700,
        literacy_rate: 56,
        primary_occupation: "Agriculture",
        nearest_city_km: 22,
        villages: [
          { name: "Bhalura", population: 3700, literacy_rate: 55, primary_occupation: "Agriculture", nearest_city_km: 24 },
          { name: "Madhopur", population: 4300, literacy_rate: 58, primary_occupation: "Labor", nearest_city_km: 20 },
        ],
      },
    },
  },
  Telangana: {
    Hyderabad: {
      Charminar: {
        population: 9100,
        literacy_rate: 78,
        primary_occupation: "Mixed",
        nearest_city_km: 4,
        villages: [
          { name: "Bandlaguda", population: 7400, literacy_rate: 76, primary_occupation: "Labor", nearest_city_km: 6 },
          { name: "Falaknuma Basti", population: 8200, literacy_rate: 79, primary_occupation: "Mixed", nearest_city_km: 5 },
        ],
      },
      Golconda: {
        population: 8400,
        literacy_rate: 77,
        primary_occupation: "Labor",
        nearest_city_km: 8,
        villages: [
          { name: "Langer Houz", population: 7600, literacy_rate: 78, primary_occupation: "Mixed", nearest_city_km: 7 },
          { name: "Ibrahim Bagh", population: 5900, literacy_rate: 75, primary_occupation: "Labor", nearest_city_km: 9 },
        ],
      },
    },
    Warangal: {
      Hanamkonda: {
        population: 6800,
        literacy_rate: 76,
        primary_occupation: "Mixed",
        nearest_city_km: 8,
        villages: [
          { name: "Waddepally", population: 5900, literacy_rate: 77, primary_occupation: "Mixed", nearest_city_km: 7 },
          { name: "Gopalpur", population: 4600, literacy_rate: 74, primary_occupation: "Agriculture", nearest_city_km: 11 },
        ],
      },
      Wardhannapet: {
        population: 4700,
        literacy_rate: 64,
        primary_occupation: "Agriculture",
        nearest_city_km: 24,
        villages: [
          { name: "Illanda", population: 3800, literacy_rate: 63, primary_occupation: "Agriculture", nearest_city_km: 26 },
          { name: "Dammannapet", population: 3400, literacy_rate: 65, primary_occupation: "Labor", nearest_city_km: 22 },
        ],
      },
    },
    Karimnagar: {
      Choppadandi: {
        population: 5100,
        literacy_rate: 67,
        primary_occupation: "Agriculture",
        nearest_city_km: 20,
        villages: [
          { name: "Gumlapur", population: 4100, literacy_rate: 66, primary_occupation: "Agriculture", nearest_city_km: 22 },
          { name: "Vedira", population: 3800, literacy_rate: 69, primary_occupation: "Mixed", nearest_city_km: 18 },
        ],
      },
      Manakondur: {
        population: 4600,
        literacy_rate: 65,
        primary_occupation: "Agriculture",
        nearest_city_km: 16,
        villages: [
          { name: "Gattududdenapalli", population: 3600, literacy_rate: 64, primary_occupation: "Agriculture", nearest_city_km: 18 },
          { name: "Chenjarla", population: 4200, literacy_rate: 66, primary_occupation: "Labor", nearest_city_km: 15 },
        ],
      },
    },
  },
  "Andhra Pradesh": {
    Visakhapatnam: {
      Anandapuram: {
        population: 6100,
        literacy_rate: 70,
        primary_occupation: "Mixed",
        nearest_city_km: 22,
        villages: [
          { name: "Gambheeram", population: 4900, literacy_rate: 72, primary_occupation: "Mixed", nearest_city_km: 20 },
          { name: "Vemulavalasa", population: 4300, literacy_rate: 68, primary_occupation: "Agriculture", nearest_city_km: 24 },
        ],
      },
      Bheemunipatnam: {
        population: 6900,
        literacy_rate: 73,
        primary_occupation: "Fishing",
        nearest_city_km: 28,
        villages: [
          { name: "Tagarapuvalasa", population: 6200, literacy_rate: 74, primary_occupation: "Mixed", nearest_city_km: 26 },
          { name: "Chepalauppada", population: 4400, literacy_rate: 69, primary_occupation: "Fishing", nearest_city_km: 30 },
        ],
      },
    },
    Vijayawada: {
      Gannavaram: {
        population: 7200,
        literacy_rate: 75,
        primary_occupation: "Mixed",
        nearest_city_km: 18,
        villages: [
          { name: "Kesarapalli", population: 5600, literacy_rate: 76, primary_occupation: "Mixed", nearest_city_km: 16 },
          { name: "Savaragudem", population: 4700, literacy_rate: 73, primary_occupation: "Agriculture", nearest_city_km: 21 },
        ],
      },
      Penamaluru: {
        population: 7800,
        literacy_rate: 77,
        primary_occupation: "Agriculture",
        nearest_city_km: 12,
        villages: [
          { name: "Poranki", population: 6900, literacy_rate: 78, primary_occupation: "Mixed", nearest_city_km: 10 },
          { name: "Kanuru", population: 7100, literacy_rate: 76, primary_occupation: "Labor", nearest_city_km: 11 },
        ],
      },
    },
    Tirupati: {
      Chandragiri: {
        population: 5800,
        literacy_rate: 71,
        primary_occupation: "Mixed",
        nearest_city_km: 14,
        villages: [
          { name: "Sanambatla", population: 4300, literacy_rate: 70, primary_occupation: "Agriculture", nearest_city_km: 16 },
          { name: "Panakam", population: 3800, literacy_rate: 73, primary_occupation: "Mixed", nearest_city_km: 13 },
        ],
      },
      Renigunta: {
        population: 6500,
        literacy_rate: 74,
        primary_occupation: "Labor",
        nearest_city_km: 11,
        villages: [
          { name: "Karakambadi", population: 5400, literacy_rate: 72, primary_occupation: "Labor", nearest_city_km: 13 },
          { name: "Thandlam", population: 4700, literacy_rate: 75, primary_occupation: "Mixed", nearest_city_km: 10 },
        ],
      },
    },
  },
  Haryana: {
    Gurugram: {
      Sohna: {
        population: 7500,
        literacy_rate: 76,
        primary_occupation: "Mixed",
        nearest_city_km: 25,
        villages: [
          { name: "Damdama", population: 4800, literacy_rate: 74, primary_occupation: "Mixed", nearest_city_km: 26 },
          { name: "Kherla", population: 5200, literacy_rate: 77, primary_occupation: "Agriculture", nearest_city_km: 23 },
        ],
      },
      Pataudi: {
        population: 6200,
        literacy_rate: 73,
        primary_occupation: "Agriculture",
        nearest_city_km: 32,
        villages: [
          { name: "Inchhapuri", population: 4600, literacy_rate: 72, primary_occupation: "Agriculture", nearest_city_km: 30 },
          { name: "Jatauli", population: 5400, literacy_rate: 75, primary_occupation: "Mixed", nearest_city_km: 33 },
        ],
      },
    },
    Faridabad: {
      Ballabgarh: {
        population: 8300,
        literacy_rate: 77,
        primary_occupation: "Labor",
        nearest_city_km: 10,
        villages: [
          { name: "Chhainsa", population: 6100, literacy_rate: 74, primary_occupation: "Agriculture", nearest_city_km: 16 },
          { name: "Dayalpur", population: 5800, literacy_rate: 78, primary_occupation: "Labor", nearest_city_km: 12 },
        ],
      },
      Tigaon: {
        population: 5900,
        literacy_rate: 71,
        primary_occupation: "Agriculture",
        nearest_city_km: 18,
        villages: [
          { name: "Manjhavali", population: 4500, literacy_rate: 70, primary_occupation: "Agriculture", nearest_city_km: 20 },
          { name: "Jasana", population: 4900, literacy_rate: 73, primary_occupation: "Mixed", nearest_city_km: 17 },
        ],
      },
    },
    Panipat: {
      Samalkha: {
        population: 6700,
        literacy_rate: 74,
        primary_occupation: "Mixed",
        nearest_city_km: 19,
        villages: [
          { name: "Patti Kalyana", population: 5300, literacy_rate: 75, primary_occupation: "Mixed", nearest_city_km: 18 },
          { name: "Chulkana", population: 4800, literacy_rate: 72, primary_occupation: "Labor", nearest_city_km: 21 },
        ],
      },
      Madlauda: {
        population: 5400,
        literacy_rate: 69,
        primary_occupation: "Agriculture",
        nearest_city_km: 22,
        villages: [
          { name: "Alupur", population: 4200, literacy_rate: 67, primary_occupation: "Agriculture", nearest_city_km: 24 },
          { name: "Dharamgarh", population: 3900, literacy_rate: 71, primary_occupation: "Agriculture", nearest_city_km: 20 },
        ],
      },
    },
  },
  Punjab: {
    Ludhiana: {
      Khanna: {
        population: 7800,
        literacy_rate: 79,
        primary_occupation: "Agriculture",
        nearest_city_km: 42,
        villages: [
          { name: "Libra", population: 5400, literacy_rate: 80, primary_occupation: "Agriculture", nearest_city_km: 40 },
          { name: "Rahoun", population: 4900, literacy_rate: 77, primary_occupation: "Mixed", nearest_city_km: 44 },
        ],
      },
      Jagraon: {
        population: 6900,
        literacy_rate: 76,
        primary_occupation: "Agriculture",
        nearest_city_km: 38,
        villages: [
          { name: "Sidhwan Bet", population: 5600, literacy_rate: 75, primary_occupation: "Agriculture", nearest_city_km: 41 },
          { name: "Galib Kalan", population: 4300, literacy_rate: 78, primary_occupation: "Mixed", nearest_city_km: 36 },
        ],
      },
    },
    Amritsar: {
      Majitha: {
        population: 5800,
        literacy_rate: 72,
        primary_occupation: "Agriculture",
        nearest_city_km: 19,
        villages: [
          { name: "Kathunangal", population: 4600, literacy_rate: 71, primary_occupation: "Agriculture", nearest_city_km: 21 },
          { name: "Nag Kalan", population: 4100, literacy_rate: 74, primary_occupation: "Mixed", nearest_city_km: 17 },
        ],
      },
      Ajnala: {
        population: 5300,
        literacy_rate: 69,
        primary_occupation: "Agriculture",
        nearest_city_km: 26,
        villages: [
          { name: "Ramdas", population: 4700, literacy_rate: 68, primary_occupation: "Labor", nearest_city_km: 29 },
          { name: "Bhindi Saidan", population: 3600, literacy_rate: 70, primary_occupation: "Agriculture", nearest_city_km: 25 },
        ],
      },
    },
    Jalandhar: {
      Nakodar: {
        population: 6400,
        literacy_rate: 77,
        primary_occupation: "Mixed",
        nearest_city_km: 24,
        villages: [
          { name: "Shankar", population: 5100, literacy_rate: 78, primary_occupation: "Mixed", nearest_city_km: 22 },
          { name: "Uggi", population: 4400, literacy_rate: 76, primary_occupation: "Agriculture", nearest_city_km: 26 },
        ],
      },
      Phillaur: {
        population: 6100,
        literacy_rate: 75,
        primary_occupation: "Labor",
        nearest_city_km: 38,
        villages: [
          { name: "Apra", population: 5200, literacy_rate: 76, primary_occupation: "Mixed", nearest_city_km: 35 },
          { name: "Lasara", population: 4100, literacy_rate: 73, primary_occupation: "Agriculture", nearest_city_km: 40 },
        ],
      },
    },
  },
  Odisha: {
    Bhubaneswar: {
      Jatni: {
        population: 6800,
        literacy_rate: 78,
        primary_occupation: "Mixed",
        nearest_city_km: 18,
        villages: [
          { name: "Kudiary", population: 5400, literacy_rate: 79, primary_occupation: "Mixed", nearest_city_km: 16 },
          { name: "Bachharpatna", population: 4600, literacy_rate: 76, primary_occupation: "Labor", nearest_city_km: 20 },
        ],
      },
      Balianta: {
        population: 5600,
        literacy_rate: 74,
        primary_occupation: "Agriculture",
        nearest_city_km: 12,
        villages: [
          { name: "Bhingarpur", population: 4800, literacy_rate: 75, primary_occupation: "Agriculture", nearest_city_km: 11 },
          { name: "Satyabhamapur", population: 4200, literacy_rate: 73, primary_occupation: "Mixed", nearest_city_km: 14 },
        ],
      },
    },
    Cuttack: {
      Athagarh: {
        population: 5200,
        literacy_rate: 71,
        primary_occupation: "Agriculture",
        nearest_city_km: 34,
        villages: [
          { name: "Radhakishorepur", population: 4300, literacy_rate: 70, primary_occupation: "Agriculture", nearest_city_km: 32 },
          { name: "Khuntuni", population: 4700, literacy_rate: 72, primary_occupation: "Labor", nearest_city_km: 36 },
        ],
      },
      Salepur: {
        population: 5900,
        literacy_rate: 76,
        primary_occupation: "Agriculture",
        nearest_city_km: 24,
        villages: [
          { name: "Machhagaon", population: 4900, literacy_rate: 75, primary_occupation: "Fishing", nearest_city_km: 26 },
          { name: "Lunahar", population: 4100, literacy_rate: 77, primary_occupation: "Mixed", nearest_city_km: 22 },
        ],
      },
    },
    Rourkela: {
      Panposh: {
        population: 7400,
        literacy_rate: 77,
        primary_occupation: "Labor",
        nearest_city_km: 8,
        villages: [
          { name: "Vedvyas", population: 6200, literacy_rate: 78, primary_occupation: "Mixed", nearest_city_km: 7 },
          { name: "Kuarmunda", population: 5100, literacy_rate: 74, primary_occupation: "Labor", nearest_city_km: 12 },
        ],
      },
      Bisra: {
        population: 4900,
        literacy_rate: 66,
        primary_occupation: "Labor",
        nearest_city_km: 20,
        villages: [
          { name: "Bondamunda Gram", population: 4500, literacy_rate: 68, primary_occupation: "Labor", nearest_city_km: 18 },
          { name: "Bhalulata", population: 3600, literacy_rate: 64, primary_occupation: "Agriculture", nearest_city_km: 23 },
        ],
      },
    },
  },
  Jharkhand: {
    Ranchi: {
      Kanke: {
        population: 6900,
        literacy_rate: 72,
        primary_occupation: "Mixed",
        nearest_city_km: 14,
        villages: [
          { name: "Arsande", population: 5600, literacy_rate: 74, primary_occupation: "Mixed", nearest_city_km: 12 },
          { name: "Boreya", population: 4800, literacy_rate: 70, primary_occupation: "Agriculture", nearest_city_km: 16 },
        ],
      },
      Ormanjhi: {
        population: 5400,
        literacy_rate: 66,
        primary_occupation: "Agriculture",
        nearest_city_km: 22,
        villages: [
          { name: "Irba", population: 4700, literacy_rate: 68, primary_occupation: "Labor", nearest_city_km: 20 },
          { name: "Dardag", population: 3800, literacy_rate: 63, primary_occupation: "Agriculture", nearest_city_km: 25 },
        ],
      },
    },
    Jamshedpur: {
      Ghatshila: {
        population: 5700,
        literacy_rate: 70,
        primary_occupation: "Labor",
        nearest_city_km: 42,
        villages: [
          { name: "Moubhandar", population: 4900, literacy_rate: 72, primary_occupation: "Labor", nearest_city_km: 40 },
          { name: "Kashida", population: 4100, literacy_rate: 68, primary_occupation: "Agriculture", nearest_city_km: 44 },
        ],
      },
      Potka: {
        population: 4600,
        literacy_rate: 61,
        primary_occupation: "Agriculture",
        nearest_city_km: 28,
        villages: [
          { name: "Hata", population: 4200, literacy_rate: 63, primary_occupation: "Mixed", nearest_city_km: 26 },
          { name: "Sohada", population: 3400, literacy_rate: 59, primary_occupation: "Agriculture", nearest_city_km: 30 },
        ],
      },
    },
    Dhanbad: {
      Baghmara: {
        population: 7600,
        literacy_rate: 69,
        primary_occupation: "Labor",
        nearest_city_km: 22,
        villages: [
          { name: "Barora", population: 6100, literacy_rate: 70, primary_occupation: "Labor", nearest_city_km: 20 },
          { name: "Mahuda", population: 5300, literacy_rate: 67, primary_occupation: "Mixed", nearest_city_km: 24 },
        ],
      },
      Topchanchi: {
        population: 5100,
        literacy_rate: 65,
        primary_occupation: "Agriculture",
        nearest_city_km: 32,
        villages: [
          { name: "Matari", population: 4300, literacy_rate: 66, primary_occupation: "Agriculture", nearest_city_km: 30 },
          { name: "Ghoratoli", population: 3600, literacy_rate: 62, primary_occupation: "Labor", nearest_city_km: 35 },
        ],
      },
    },
  },
  Chhattisgarh: {
    Raipur: {
      Abhanpur: {
        population: 6300,
        literacy_rate: 71,
        primary_occupation: "Agriculture",
        nearest_city_km: 28,
        villages: [
          { name: "Kendri", population: 5100, literacy_rate: 72, primary_occupation: "Agriculture", nearest_city_km: 26 },
          { name: "Nayapara", population: 4700, literacy_rate: 70, primary_occupation: "Mixed", nearest_city_km: 30 },
        ],
      },
      Arang: {
        population: 5800,
        literacy_rate: 68,
        primary_occupation: "Agriculture",
        nearest_city_km: 35,
        villages: [
          { name: "Mandir Hasaud", population: 5600, literacy_rate: 71, primary_occupation: "Labor", nearest_city_km: 22 },
          { name: "Rasni", population: 3900, literacy_rate: 66, primary_occupation: "Agriculture", nearest_city_km: 38 },
        ],
      },
    },
    Bilaspur: {
      Kota: {
        population: 5100,
        literacy_rate: 67,
        primary_occupation: "Agriculture",
        nearest_city_km: 36,
        villages: [
          { name: "Ratanpur", population: 5400, literacy_rate: 69, primary_occupation: "Mixed", nearest_city_km: 25 },
          { name: "Belgahana", population: 3800, literacy_rate: 64, primary_occupation: "Labor", nearest_city_km: 42 },
        ],
      },
      Takhatpur: {
        population: 5600,
        literacy_rate: 65,
        primary_occupation: "Agriculture",
        nearest_city_km: 30,
        villages: [
          { name: "Sakri", population: 4900, literacy_rate: 68, primary_occupation: "Mixed", nearest_city_km: 18 },
          { name: "Jarhagaon", population: 4200, literacy_rate: 63, primary_occupation: "Agriculture", nearest_city_km: 34 },
        ],
      },
    },
    Durg: {
      Patan: {
        population: 5900,
        literacy_rate: 73,
        primary_occupation: "Agriculture",
        nearest_city_km: 26,
        villages: [
          { name: "Jamgaon", population: 4800, literacy_rate: 74, primary_occupation: "Agriculture", nearest_city_km: 24 },
          { name: "Selud", population: 4300, literacy_rate: 71, primary_occupation: "Mixed", nearest_city_km: 28 },
        ],
      },
      Dhamdha: {
        population: 5200,
        literacy_rate: 70,
        primary_occupation: "Agriculture",
        nearest_city_km: 34,
        villages: [
          { name: "Deokar", population: 4500, literacy_rate: 69, primary_occupation: "Agriculture", nearest_city_km: 36 },
          { name: "Bori", population: 4100, literacy_rate: 72, primary_occupation: "Labor", nearest_city_km: 32 },
        ],
      },
    },
  },
  Assam: {
    Guwahati: {
      Dispur: {
        population: 8200,
        literacy_rate: 80,
        primary_occupation: "Mixed",
        nearest_city_km: 6,
        villages: [
          { name: "Khanapara Gaon", population: 7100, literacy_rate: 80, primary_occupation: "Mixed", nearest_city_km: 8 },
          { name: "Basistha", population: 6400, literacy_rate: 78, primary_occupation: "Labor", nearest_city_km: 7 },
        ],
      },
      Jalukbari: {
        population: 7600,
        literacy_rate: 79,
        primary_occupation: "Mixed",
        nearest_city_km: 12,
        villages: [
          { name: "Pandu", population: 6800, literacy_rate: 80, primary_occupation: "Labor", nearest_city_km: 10 },
          { name: "Azara", population: 5900, literacy_rate: 77, primary_occupation: "Agriculture", nearest_city_km: 15 },
        ],
      },
    },
    Jorhat: {
      Titabar: {
        population: 5400,
        literacy_rate: 74,
        primary_occupation: "Agriculture",
        nearest_city_km: 22,
        villages: [
          { name: "Thengal Gaon", population: 4400, literacy_rate: 76, primary_occupation: "Agriculture", nearest_city_km: 20 },
          { name: "Borholla", population: 4100, literacy_rate: 72, primary_occupation: "Labor", nearest_city_km: 25 },
        ],
      },
      Teok: {
        population: 4900,
        literacy_rate: 72,
        primary_occupation: "Agriculture",
        nearest_city_km: 28,
        villages: [
          { name: "Boloma", population: 3900, literacy_rate: 73, primary_occupation: "Agriculture", nearest_city_km: 27 },
          { name: "Selenghat", population: 4300, literacy_rate: 71, primary_occupation: "Mixed", nearest_city_km: 30 },
        ],
      },
    },
    Dibrugarh: {
      Chabua: {
        population: 5800,
        literacy_rate: 71,
        primary_occupation: "Agriculture",
        nearest_city_km: 26,
        villages: [
          { name: "Jerai Gaon", population: 4600, literacy_rate: 73, primary_occupation: "Agriculture", nearest_city_km: 24 },
          { name: "Dinjoy", population: 3800, literacy_rate: 69, primary_occupation: "Labor", nearest_city_km: 28 },
        ],
      },
      Moran: {
        population: 5300,
        literacy_rate: 70,
        primary_occupation: "Labor",
        nearest_city_km: 38,
        villages: [
          { name: "Khowang", population: 4500, literacy_rate: 72, primary_occupation: "Agriculture", nearest_city_km: 35 },
          { name: "Tiloi", population: 3900, literacy_rate: 68, primary_occupation: "Labor", nearest_city_km: 40 },
        ],
      },
    },
  },
  Kerala: {
    Thiruvananthapuram: {
      Nedumangad: {
        population: 7600,
        literacy_rate: 80,
        primary_occupation: "Agriculture",
        nearest_city_km: 18,
        villages: [
          { name: "Vembayam", population: 6200, literacy_rate: 80, primary_occupation: "Agriculture", nearest_city_km: 16 },
          { name: "Anad", population: 5400, literacy_rate: 80, primary_occupation: "Mixed", nearest_city_km: 20 },
        ],
      },
      Neyyattinkara: {
        population: 7900,
        literacy_rate: 80,
        primary_occupation: "Fishing",
        nearest_city_km: 20,
        villages: [
          { name: "Vizhinjam Gramam", population: 7200, literacy_rate: 79, primary_occupation: "Fishing", nearest_city_km: 15 },
          { name: "Parassala", population: 6100, literacy_rate: 80, primary_occupation: "Labor", nearest_city_km: 24 },
        ],
      },
    },
    Kochi: {
      Aluva: {
        population: 8400,
        literacy_rate: 80,
        primary_occupation: "Mixed",
        nearest_city_km: 14,
        villages: [
          { name: "Angamaly Gram", population: 7300, literacy_rate: 80, primary_occupation: "Mixed", nearest_city_km: 22 },
          { name: "Kalady", population: 6500, literacy_rate: 80, primary_occupation: "Agriculture", nearest_city_km: 18 },
        ],
      },
      Paravur: {
        population: 7200,
        literacy_rate: 80,
        primary_occupation: "Fishing",
        nearest_city_km: 22,
        villages: [
          { name: "Chendamangalam", population: 5900, literacy_rate: 80, primary_occupation: "Labor", nearest_city_km: 24 },
          { name: "Varapuzha", population: 6400, literacy_rate: 80, primary_occupation: "Fishing", nearest_city_km: 16 },
        ],
      },
    },
    Kozhikode: {
      Koyilandy: {
        population: 7100,
        literacy_rate: 80,
        primary_occupation: "Fishing",
        nearest_city_km: 26,
        villages: [
          { name: "Kappad", population: 5800, literacy_rate: 80, primary_occupation: "Fishing", nearest_city_km: 18 },
          { name: "Moodadi", population: 5200, literacy_rate: 80, primary_occupation: "Mixed", nearest_city_km: 28 },
        ],
      },
      Vadakara: {
        population: 7500,
        literacy_rate: 80,
        primary_occupation: "Mixed",
        nearest_city_km: 44,
        villages: [
          { name: "Chombala", population: 6100, literacy_rate: 80, primary_occupation: "Fishing", nearest_city_km: 42 },
          { name: "Onchiam", population: 5600, literacy_rate: 80, primary_occupation: "Agriculture", nearest_city_km: 45 },
        ],
      },
    },
  },
};

export const DISTRICT_COORDINATES = {
  // Uttar Pradesh
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Kanpur: { lat: 26.4499, lng: 80.3319 },
  Varanasi: { lat: 25.3176, lng: 82.9739 },

  // Madhya Pradesh
  Bhopal: { lat: 23.2599, lng: 77.4126 },
  Indore: { lat: 22.7196, lng: 75.8577 },
  Jabalpur: { lat: 23.1815, lng: 79.9864 },

  // Rajasthan
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Jodhpur: { lat: 26.2389, lng: 73.0243 },
  Udaipur: { lat: 24.5854, lng: 73.7125 },

  // Maharashtra
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Nashik: { lat: 19.9975, lng: 73.7898 },

  // Tamil Nadu
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Madurai: { lat: 9.9252, lng: 78.1198 },
  Coimbatore: { lat: 11.0168, lng: 76.9558 },

  // Karnataka
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Mysore: { lat: 12.2958, lng: 76.6394 },
  Hubli: { lat: 15.3647, lng: 75.1240 },

  // Gujarat
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Surat: { lat: 21.1702, lng: 72.8311 },
  Vadodara: { lat: 22.3072, lng: 73.1812 },

  // West Bengal
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Howrah: { lat: 22.5958, lng: 88.2636 },
  Siliguri: { lat: 26.7271, lng: 88.3953 },

  // Bihar
  Patna: { lat: 25.5941, lng: 85.1376 },
  Gaya: { lat: 24.7914, lng: 85.0002 },
  Muzaffarpur: { lat: 26.1209, lng: 85.3647 },

  // Telangana
  Hyderabad: { lat: 17.3850, lng: 78.4867 },
  Warangal: { lat: 17.9689, lng: 79.5941 },
  Karimnagar: { lat: 18.4386, lng: 79.1288 },

  // Andhra Pradesh
  Visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  Vijayawada: { lat: 16.5062, lng: 80.6480 },
  Tirupati: { lat: 13.6288, lng: 79.4192 },

  // Haryana
  Gurugram: { lat: 28.4595, lng: 77.0266 },
  Faridabad: { lat: 28.4089, lng: 77.3178 },
  Panipat: { lat: 29.3909, lng: 76.9635 },

  // Punjab
  Ludhiana: { lat: 30.9010, lng: 75.8573 },
  Amritsar: { lat: 31.6340, lng: 74.8723 },
  Jalandhar: { lat: 31.3260, lng: 75.5762 },

  // Odisha
  Bhubaneswar: { lat: 20.2961, lng: 85.8245 },
  Cuttack: { lat: 20.4625, lng: 85.8828 },
  Rourkela: { lat: 22.2604, lng: 84.8536 },

  // Jharkhand
  Ranchi: { lat: 23.3441, lng: 85.3096 },
  Jamshedpur: { lat: 22.8046, lng: 86.2029 },
  Dhanbad: { lat: 23.7957, lng: 86.4304 },

  // Chhattisgarh
  Raipur: { lat: 21.2514, lng: 81.6296 },
  Bilaspur: { lat: 22.0797, lng: 82.1409 },
  Durg: { lat: 21.1904, lng: 81.2849 },

  // Assam
  Guwahati: { lat: 26.1445, lng: 91.7362 },
  Jorhat: { lat: 26.7509, lng: 94.2037 },
  Dibrugarh: { lat: 27.4728, lng: 94.9120 },

  // Kerala
  Thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
  Kozhikode: { lat: 11.2588, lng: 75.7804 },
};

// Populate lat and lng properties on each district in LOCATIONS
for (const state of Object.keys(LOCATIONS)) {
  for (const district of Object.keys(LOCATIONS[state])) {
    const coords = DISTRICT_COORDINATES[district] || { lat: 26.8467, lng: 80.9462 };
    LOCATIONS[state][district].lat = coords.lat;
    LOCATIONS[state][district].lng = coords.lng;
  }
}

export const STATES = Object.keys(LOCATIONS);

export function getStates() {
  return Object.keys(LOCATIONS);
}

export function getDistricts(state) {
  return Object.keys(LOCATIONS[state] ?? {});
}

export function getBlocks(state, district) {
  return Object.keys(LOCATIONS[state]?.[district] ?? {}).filter(
    (key) => key !== "lat" && key !== "lng"
  );
}

export function getBlockMeta(state, district, block) {
  return LOCATIONS[state]?.[district]?.[block] ?? null;
}

export function getVillages(state, district, block) {
  const blockData = LOCATIONS[state]?.[district]?.[block];
  return blockData?.villages ?? [];
}

export function getVillageMeta(state, district, block, villageName) {
  const villages = getVillages(state, district, block);
  if (!villages || villages.length === 0) return null;
  const match = villages.find(
    (v) => v.name.toLowerCase() === (villageName || "").toLowerCase()
  );
  return match ?? villages[0] ?? null;
}

export function getDistrictCoordinates(districtName) {
  if (!districtName) return { lat: 26.8467, lng: 80.9462 };
  return DISTRICT_COORDINATES[districtName] || { lat: 26.8467, lng: 80.9462 };
}
