import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/"];
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!session && isProtected) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    const current = pathname + (req.nextUrl.search || "");

    loginUrl.searchParams.set("redirect", current);
    return NextResponse.redirect(loginUrl);
  }

  const authPaths = ["/login", "/register"];
  if (session && authPaths.includes(pathname)) {
    const redirect = req.nextUrl.searchParams.get("redirect") || "/";
    const dest = req.nextUrl.clone();
    dest.pathname = redirect;
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  return res;
}

export const config = {
  matcher: ["/", "/login", "/register"],
};
