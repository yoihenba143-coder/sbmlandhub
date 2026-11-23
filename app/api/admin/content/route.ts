import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const contentFilePath = path.join(process.cwd(), "data", "site-content.json");

function getDefaultContent() {
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
      address: "SBM LAND HUB Headquarters, MG Avenue, Imphal, Manipur",
      pincode: "795001",
      workingHours: "Monday - Saturday: 9:00 AM - 7:00 PM (Sunday Closed)",
      whatsapp: "+91 7005316378",
    },
  };
}

export async function GET() {
  try {
    if (!fs.existsSync(contentFilePath)) {
      const defaultContent = getDefaultContent();
      fs.mkdirSync(path.dirname(contentFilePath), { recursive: true });
      fs.writeFileSync(contentFilePath, JSON.stringify(defaultContent, null, 2), "utf-8");
      return NextResponse.json({ success: true, content: defaultContent });
    }

    const data = fs.readFileSync(contentFilePath, "utf-8");
    const parsed = JSON.parse(data);
    return NextResponse.json({ success: true, content: parsed });
  } catch (error) {
    console.error("Error reading site content:", error);
    return NextResponse.json({ success: true, content: getDefaultContent() });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { about, contact } = body;

    let current = getDefaultContent();
    if (fs.existsSync(contentFilePath)) {
      try {
        current = JSON.parse(fs.readFileSync(contentFilePath, "utf-8"));
      } catch {
        // ignore
      }
    }

    const updated = {
      about: {
        ...current.about,
        ...(about || {}),
      },
      contact: {
        ...current.contact,
        ...(contact || {}),
      },
    };

    fs.mkdirSync(path.dirname(contentFilePath), { recursive: true });
    fs.writeFileSync(contentFilePath, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Website content saved successfully!",
      content: updated,
    });
  } catch (error) {
    console.error("Error saving site content:", error);
    return NextResponse.json(
      { error: "Failed to save website content." },
      { status: 500 }
    );
  }
}
