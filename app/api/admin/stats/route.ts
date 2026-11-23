import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [propertiesCount, usersCount, submissionsCount, inquiriesCount] = await Promise.all([
      prisma.property.count(),
      prisma.user.count(),
      prisma.propertySubmission.count(),
      prisma.inquiry.count(),
    ]);

    const recentInquiries = await prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const recentSubmissions = await prisma.propertySubmission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      stats: {
        properties: propertiesCount,
        users: usersCount,
        submissions: submissionsCount,
        inquiries: inquiriesCount,
      },
      recentInquiries,
      recentSubmissions,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard statistics." },
      { status: 500 }
    );
  }
}
