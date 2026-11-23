import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    if (!email && !id) {
      return NextResponse.json(
        { error: "Email or User ID is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: id
        ? { id }
        : { email: email!.trim().toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        pincode: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        submissions: {
          orderBy: { createdAt: "desc" },
        },
        inquiries: {
          orderBy: { createdAt: "desc" },
        },
        properties: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to load user profile." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, address, pincode, role, isAdmin, currentPassword, newPassword } = body;

    if (!email) {
      return NextResponse.json(
        { error: "User email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const updateData: {
      name?: string;
      phone?: string | null;
      address?: string | null;
      pincode?: string | null;
      password?: string;
      role?: "USER" | "ADMIN";
    } = {};

    if (name && typeof name === "string") {
      updateData.name = name.trim();
    }

    if (phone !== undefined) {
      updateData.phone = typeof phone === "string" ? phone.trim() : null;
    }

    if (address !== undefined) {
      updateData.address = typeof address === "string" ? address.trim() : null;
    }

    if (pincode !== undefined) {
      updateData.pincode = typeof pincode === "string" ? pincode.trim() : null;
    }

    // Role update: accepts role ("ADMIN" | "USER") or isAdmin (boolean)
    if (role === "ADMIN" || role === "USER") {
      updateData.role = role;
    } else if (isAdmin !== undefined) {
      updateData.role = isAdmin ? "ADMIN" : "USER";
    }

    // Password change request
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters long." },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { email: normalizedEmail },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        pincode: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
