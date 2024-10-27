import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/playlist")) {
    const artist = request.nextUrl.searchParams.get("artist");

    if (!artist) {
      return NextResponse.rewrite(new URL("/", request.url));
    }
  }
}
