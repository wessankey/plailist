import { NextResponse, NextRequest } from "next/server";
import { requestAccessToken } from "./actions/login";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/playlist")) {
    const artist = request.nextUrl.searchParams.get("artist");

    if (!artist) {
      return NextResponse.rewrite(new URL("/", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/login/callback")) {
    const code = request.nextUrl.searchParams.get("code") as string;
    const sessionData = await requestAccessToken(code);

    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("access_token", sessionData.accessToken);

    return response;
  }
}
