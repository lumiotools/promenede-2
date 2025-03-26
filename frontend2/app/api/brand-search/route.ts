import { type NextRequest, NextResponse } from "next/server";

// The API token is now only on the server side
const BRANDFETCH_API_TOKEN = process.env.BRANDFETCH_API_TOKEN;

export async function GET(request: NextRequest) {
  try {
    // Get the search query from the URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Make the request to the Brandfetch API
    const response = await fetch(
      `https://api.brandfetch.io/v2/search/${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRANDFETCH_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Brandfetch API error: ${response.status}`);
    }

    const data = await response.json();

    // Process the data to ensure consistent format
    const processedData = Array.isArray(data)
      ? data
          .map((item: any) => ({
            name: item.name || "",
            domain: item.domain || "",
            logo: item.icon || item.logo || "",
          }))
          .slice(0, 5)
      : [];

    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Brand search API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand data" },
      { status: 500 }
    );
  }
}
