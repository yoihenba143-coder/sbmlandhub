import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const propertyId = parseInt(id, 10);

    if (isNaN(propertyId)) {
      return NextResponse.json({ error: "Invalid property ID." }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, property });
  } catch (error) {
    console.error("Property fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch property details." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const propertyId = parseInt(id, 10);

    if (isNaN(propertyId)) {
      return NextResponse.json({ error: "Invalid property ID." }, { status: 400 });
    }

    const data = await request.json();

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.district !== undefined) updateData.district = data.district;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.pincode !== undefined) updateData.pincode = data.pincode;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.listingType !== undefined) updateData.listingType = data.listingType;
    if (data.price !== undefined) updateData.price = parseFloat(data.price);
    if (data.area !== undefined) updateData.area = data.area;
    if (data.areaUnit !== undefined) updateData.areaUnit = data.areaUnit;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.images !== undefined) updateData.images = Array.isArray(data.images) ? data.images : [];
    if (data.video !== undefined) updateData.video = data.video ? data.video.trim() : null;
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
    if (data.status !== undefined) updateData.status = data.status;

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: updateData,
    });

    return NextResponse.json({ success: true, property: updated });
  } catch (error) {
    console.error("Property update error:", error);
    return NextResponse.json(
      { error: "Failed to update property." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const propertyId = parseInt(id, 10);

    if (isNaN(propertyId)) {
      return NextResponse.json({ error: "Invalid property ID." }, { status: 400 });
    }

    await prisma.property.delete({
      where: { id: propertyId },
    });

    return NextResponse.json({ success: true, message: "Property deleted successfully." });
  } catch (error) {
    console.error("Property delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete property." },
      { status: 500 }
    );
  }
}
