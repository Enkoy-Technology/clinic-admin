import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://demo-oxua.onrender.com/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
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
      ? `${API_BASE_URL}/appointments/${path}/?${queryString}`
      : `${API_BASE_URL}/appointments/${path}/`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers,
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

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join("/");
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      headers["Authorization"] = `JWT ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/appointments/${path}/`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join("/");
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      headers["Authorization"] = `JWT ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/appointments/${path}/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
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

export async function DELETE(
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
      const token = authHeader.replace("Bearer ", "");
      headers["Authorization"] = `JWT ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/appointments/${path}/`, {
      method: "DELETE",
      headers,
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

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

