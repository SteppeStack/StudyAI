import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/files",
  "/settings",
  "/assignments",
  "/documents",
  "/exam-prep",
  "/diploma",
  "/subscription",
  "/payment",
  "/ai-tutor",
];

const authPages = ["/login", "/register"];
const authMarkerCookie = "studyai-authenticated";

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthMarker = request.cookies.get(authMarkerCookie)?.value === "1";

  if (matchesRoute(pathname, protectedRoutes) && !hasAuthMarker) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (authPages.includes(pathname) && hasAuthMarker) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";

    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/files/:path*",
    "/settings/:path*",
    "/assignments/:path*",
    "/documents/:path*",
    "/exam-prep/:path*",
    "/diploma/:path*",
    "/subscription/:path*",
    "/payment/:path*",
    "/ai-tutor/:path*",
    "/login",
    "/register",
  ],
};
