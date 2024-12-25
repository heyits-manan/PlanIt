import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { id, email, name, profilePicture } = await req.json();
  console.log("From API: ", { id, email, name, profilePicture });

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ id });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 200 }
      );
    }

    const newUser = new User({
      id,
      email,
      name,
      profilePicture,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
