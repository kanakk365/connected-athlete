import { NextRequest, NextResponse } from "next/server";
import { TERRA_BASE, terraHeaders } from "@/lib/terra/config";


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${TERRA_BASE}/auth/deauthenticateUser?user_id=${userId}`,
      {
        method: "DELETE",
        headers: terraHeaders(),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to deauthenticate user", details: data },
        { status: res.status },
      );
    }

    return NextResponse.json({
      status: "success",
      message: `User ${userId} has been disconnected.`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
