import fs from "fs";
import path from "path";

const contentFilePath = path.join(process.cwd(), "data", "site-content.json");

export interface SiteContentData {
  about: {
    title: string;
    subtitle: string;
    description: string;
    mission: string;
    experienceYears: string;
    propertiesSold: string;
    happyClients: string;
    verifiedLocations: string;
  };
  contact: {
    title: string;
    phone: string;
    email: string;
    address: string;
    workingHours: string;
    whatsapp: string;
  };
}

export function getSiteContent(): SiteContentData {
  try {
    if (fs.existsSync(contentFilePath)) {
      const raw = fs.readFileSync(contentFilePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading site content:", e);
  }

  return {
    about: {
      title: "Making property decisions simpler.",
      subtitle: "Property & Real Estate Excellence",
      description: "SBM LAND HUB is a premier property and real-estate platform designed to help people discover, buy and sell verified land, residential houses, agricultural fields, shops, and commercial properties.",
      mission: "Our mission is to bring complete transparency, fair pricing, and local trust to every real estate transaction across the region.",
      experienceYears: "12+",
      propertiesSold: "450+",
      happyClients: "1,200+",
      verifiedLocations: "50+",
    },
    contact: {
      title: "Let's talk about your property.",
      phone: "+91 7005316378",
      email: "sbmlandhub@gmail.com",
      address: "SBM LAND HUB Headquarters, MG Avenue, Imphal, Manipur 795001",
      workingHours: "Monday - Saturday: 9:00 AM - 7:00 PM (Sunday Closed)",
      whatsapp: "+91 7005316378",
    },
  };
}
