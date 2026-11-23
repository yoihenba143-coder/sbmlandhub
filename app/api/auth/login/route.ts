import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, isAdmin } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify user in PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address. Please register or verify your email." },
        { status: 401 }
      );
    }

    let isMatch = false;

    // Check if stored password is a bcrypt hash
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Direct comparison for non-hashed/legacy password in database
      isMatch = user.password === password;
      if (isMatch) {
        // Automatically upgrade to secure bcrypt hash in sbmlandhub
        const hashed = await bcrypt.hash(password, 12);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashed },
        }).catch((err) => console.error("Error migrating password to hash:", err));
      }
    }

    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    // Only administrator accounts are permitted to sign in
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Administrator privileges required." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to sign in. Please try again." },
      { status: 500 }
    );
  }
}
