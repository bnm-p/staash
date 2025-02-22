// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// the following code is taken from : https://nextjs.org/docs/advanced-features/middleware#setting-headers
export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	const { url, nextUrl } = request;
	const { pathname } = nextUrl;

	const orgSlug = pathname.split("/")[2];
	if (orgSlug) {
		response.headers.set("x-org-slug", orgSlug);
	}

	const spaceSlug = pathname.split("/")[4];
	if (spaceSlug) {
		response.headers.set("x-space-slug", spaceSlug);
	}

	response.headers.set("x-path", pathname);
	response.headers.set("x-url", url);

	return response;
}

// the following code has been copied from https://nextjs.org/docs/advanced-features/middleware#matcher
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
