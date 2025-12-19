import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://ff-gng8.onrender.com/api";

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join("/");
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/auth/${path}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join("/");
    const authHeader = request.headers.get("authorization");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      // Convert "Bearer token" to "JWT token" format expected by backend
      const token = authHeader.replace("Bearer ", "");
      headers["Authorization"] = `JWT ${token}`;
    }

    // Remove trailing slash for 'me' endpoint
    const endpoint = path === "me"
      ? `${API_BASE_URL}/auth/${path}`
      : `${API_BASE_URL}/auth/${path}/`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

