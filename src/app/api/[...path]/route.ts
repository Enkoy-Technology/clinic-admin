import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://demo-oxua.onrender.com/api";

// Helper function to handle all HTTP methods
async function handleRequest(
  request: NextRequest,
  method: string,
  params: { path: string[] }
) {
  try {
    const path = params.path.join("/");
    const authHeader = request.headers.get("authorization");
    const searchParams = request.nextUrl.searchParams;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      // Convert "Bearer token" to "JWT token" format expected by backend
      const token = authHeader.replace("Bearer ", "");
      headers["Authorization"] = `JWT ${token}`;
    }

    // Build query string from search params
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${API_BASE_URL}/${path}/?${queryString}`
      : `${API_BASE_URL}/${path}/`;

    // Get request body for POST, PUT, PATCH
    let body: string | undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        const requestBody = await request.json();
        body = JSON.stringify(requestBody);
      } catch {
        // No body or invalid JSON, continue without body
      }
    }

    const response = await fetch(endpoint, {
      method,
      headers,
      ...(body && { body }),
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
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
  return handleRequest(request, "GET", params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, "POST", params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, "PUT", params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, "PATCH", params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, "DELETE", params);
}

