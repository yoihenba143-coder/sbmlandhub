import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, enquiryType, propertyType, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Name, phone number and message are required." },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        enquiryType: enquiryType || "GENERAL",
        propertyType: propertyType || null,
        message: message.trim(),
      },
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    console.error("Error creating inquiry in database:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json({ success: false, inquiries: [] });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isRead } = body;

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required." }, { status: 400 });
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { isRead: Boolean(isRead) },
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json({ error: "Failed to update inquiry." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required." }, { status: 400 });
    }

    await prisma.inquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Inquiry deleted successfully." });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json({ error: "Failed to delete inquiry." }, { status: 500 });
  }
}
