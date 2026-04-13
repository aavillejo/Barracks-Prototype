import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("barracks_auth")?.value === "1";

  if (isLoggedIn) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/Display/LoginPage", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/Display/LandingPage/:path*", "/Records/:path*"],
};
