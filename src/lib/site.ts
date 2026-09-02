export const SITE = {
  name: "Morani International",
  tagline: "Health • Food • Nature",
  strapline: "A Sunnah Superfood for Health & Nourishment",
  whatsapp: "923020162224",
  phoneDisplay: "+92 302 0162224",
  email: "info@moraniinternational.com",
  address: "Plot A-17, SITE Industrial Area, Karachi, Pakistan",
  social: {
    instagram: "https://instagram.com/moraniinternational",
    facebook: "https://facebook.com/moraniinternational",
    tiktok: "https://tiktok.com/@moraniinternational",
    youtube: "https://youtube.com/@moraniinternational",
  },
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function formatPKR(amount: number) {
  return `Rs ${new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(amount)}`;
}

export const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Hyderabad",
  "Sialkot",
  "Gujranwala",
  "Other",
];
