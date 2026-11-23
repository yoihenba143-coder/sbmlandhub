import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
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
      role: user.role,
      isAdmin: user.role === "ADMIN",
      user,
    });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json(
      { error: "Failed to fetch user role." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return handleRoleUpdate(request);
}

export async function PUT(request: Request) {
  return handleRoleUpdate(request);
}

async function handleRoleUpdate(request: Request) {
  try {
    const body = await request.json();
    const { email, role, isAdmin } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Determine target role: ADMIN or USER
    let targetRole: "ADMIN" | "USER" = "ADMIN";
    if (role === "ADMIN" || role === "USER") {
      targetRole = role;
    } else if (isAdmin !== undefined) {
      targetRole = isAdmin ? "ADMIN" : "USER";
    }

    const user = await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        role: targetRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User role successfully updated to ${targetRole}.`,
      isAdmin: user.role === "ADMIN",
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role." },
      { status: 500 }
    );
  }
}
