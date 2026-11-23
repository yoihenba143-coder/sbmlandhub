import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const property = await prisma.property.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!property) {
        return NextResponse.json(
          { error: "Property not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, property });
    }

    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const whereClause: Record<string, unknown> = {};

    if (type && type !== "ALL") {
      whereClause.type = type;
    }

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, properties });
  } catch (error) {
    console.error("Properties fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties from database." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      location,
      district,
      state,
      pincode,
      type,
      listingType,
      price,
      area,
      areaUnit,
      image,
      images,
      video,
      featured,
      status,
      highlights,
      legalVerification,
    } = body;

    if (!title || !price || !location || !type || !area) {
      return NextResponse.json(
        { error: "Title, price, location, type, and area are required." },
        { status: 400 }
      );
    }

    const resolvedImage = image?.trim() || (Array.isArray(images) && images.length > 0 ? images[0] : "/image/land1.avif");
    const resolvedImages = Array.isArray(images) && images.length > 0
      ? images
      : (resolvedImage ? [resolvedImage] : []);

    const resolvedHighlights = Array.isArray(highlights)
      ? highlights.map((h: unknown) => String(h).trim()).filter(Boolean)
      : (typeof highlights === "string" ? highlights.split("\n").map(s => s.trim()).filter(Boolean) : []);

    const resolvedLegalVerification = Array.isArray(legalVerification)
      ? legalVerification.map((l: unknown) => String(l).trim()).filter(Boolean)
      : (typeof legalVerification === "string" ? legalVerification.split("\n").map(s => s.trim()).filter(Boolean) : []);

    const newProperty = await prisma.property.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        location: location.trim(),
        district: district?.trim() || null,
        state: state?.trim() || "Manipur",
        pincode: pincode?.trim() || null,
        type: type,
        listingType: listingType || "SALE",
        price: parseFloat(price),
        area: area.trim(),
        areaUnit: areaUnit?.trim() || "sq.ft",
        image: resolvedImage,
        images: resolvedImages,
        video: video?.trim() || null,
        featured: Boolean(featured),
        status: status || "AVAILABLE",
        highlights: resolvedHighlights,
        legalVerification: resolvedLegalVerification,
      },
    });

    return NextResponse.json({ success: true, property: newProperty }, { status: 201 });
  } catch (error) {
    console.error("Property creation error:", error);
    return NextResponse.json(
      { error: "Failed to create property in database." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required." },
        { status: 400 }
      );
    }

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
    if (data.highlights !== undefined) {
      updateData.highlights = Array.isArray(data.highlights)
        ? data.highlights.map((h: unknown) => String(h).trim()).filter(Boolean)
        : (typeof data.highlights === "string" ? data.highlights.split("\n").map((s: string) => s.trim()).filter(Boolean) : []);
    }
    if (data.legalVerification !== undefined) {
      updateData.legalVerification = Array.isArray(data.legalVerification)
        ? data.legalVerification.map((l: unknown) => String(l).trim()).filter(Boolean)
        : (typeof data.legalVerification === "string" ? data.legalVerification.split("\n").map((s: string) => s.trim()).filter(Boolean) : []);
    }

    const updated = await prisma.property.update({
      where: { id: parseInt(id, 10) },
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Property ID is required." },
        { status: 400 }
      );
    }

    await prisma.property.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true, message: "Property deleted successfully." });
  } catch (error) {
    console.error("Property deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete property." },
      { status: 500 }
    );
  }
}
