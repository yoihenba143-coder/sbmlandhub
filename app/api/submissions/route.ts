import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const submissions = await prisma.propertySubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Failed to fetch submissions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      type,
      listingType,
      price,
      area,
      areaUnit,
      location,
      district,
      state,
      pincode,
      description,
      ownerName,
      ownerPhone,
      ownerEmail,
      userId,
    } = body;

    if (!title || !price || !location || !ownerName || !ownerPhone) {
      return NextResponse.json(
        { error: "Title, price, location, owner name and phone are required." },
        { status: 400 }
      );
    }

    const submission = await prisma.propertySubmission.create({
      data: {
        title: title.trim(),
        type: type || "LAND",
        listingType: listingType || "SALE",
        price: parseFloat(price),
        area: area?.trim() || "1000",
        areaUnit: areaUnit?.trim() || "sq.ft",
        location: location.trim(),
        district: district?.trim() || null,
        state: state?.trim() || "Manipur",
        pincode: pincode?.trim() || null,
        description: description?.trim() || null,
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone.trim(),
        ownerEmail: ownerEmail?.trim() || null,
        status: "PENDING",
        userId: userId || null,
      },
    });

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json({ error: "Failed to submit property." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, approveToProperty } = body;

    if (!id) {
      return NextResponse.json({ error: "Submission ID is required." }, { status: 400 });
    }

    const submission = await prisma.propertySubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    // If approving to live Property
    if (approveToProperty) {
      const createdProperty = await prisma.property.create({
        data: {
          title: submission.title,
          description: submission.description,
          location: submission.location,
          district: submission.district,
          state: submission.state,
          pincode: submission.pincode,
          type: submission.type,
          listingType: submission.listingType,
          price: submission.price,
          area: submission.area,
          areaUnit: submission.areaUnit,
          image: "/image/land1.avif",
          status: "AVAILABLE",
          userId: submission.userId,
        },
      });

      await prisma.propertySubmission.update({
        where: { id },
        data: { status: "AVAILABLE" },
      });

      return NextResponse.json({
        success: true,
        message: "Submission approved and published as live property!",
        property: createdProperty,
      });
    }

    const updated = await prisma.propertySubmission.update({
      where: { id },
      data: { status: status || "PENDING" },
    });

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json({ error: "Failed to update submission." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Submission ID is required." }, { status: 400 });
    }

    await prisma.propertySubmission.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Submission deleted successfully." });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "Failed to delete submission." }, { status: 500 });
  }
}
