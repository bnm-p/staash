import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const session = await auth.api.getSession({ headers: request.headers });

	if (pathname.startsWith("/auth")) {
		if (session?.user) {
			return NextResponse.redirect(new URL("/", request.url));
		}
		return NextResponse.next();
	}

	if (!session?.user) {
		return NextResponse.redirect(new URL("/auth/sign-in", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/:orgSlug((?!_next|api|static|favicon.ico).*)*"],
};
