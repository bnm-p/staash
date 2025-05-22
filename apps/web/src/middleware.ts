import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user) {
		return NextResponse.redirect(new URL("/auth/sign-in", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/:orgSlug((?!_next|api|static|favicon.ico).*)*"],
};
