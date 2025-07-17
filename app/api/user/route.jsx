import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name } = body;

    // Check if required data is present
    if (!email || !name) {
      console.error("Missing name or email:", { email, name });
      return NextResponse.json({ message: "Missing name or email" }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, email));

    // If not, insert new user
    if (existingUsers.length === 0) {
      const result = await db.insert(usersTable)
        .values({ name, email })
        .returning();

      console.log("New user inserted:", result[0]);
      return NextResponse.json(result[0], { status: 201 });
    }

    // If exists, return existing
    console.log("ℹ User already exists:", existingUsers[0]);
    return NextResponse.json(existingUsers[0], { status: 200 });

  } catch (error) {
    console.error(" Server error in /api/user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
