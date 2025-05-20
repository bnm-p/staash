import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function OrgLayout({
	children,
	subnav,
}: Readonly<{
	children: React.ReactNode;
	subnav: React.ReactNode;
}>) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect("/auth/sign-in");
	}

	return (
		<div>
			<Nav />
			{subnav}
			<div className="flex min-h-[calc(100svh-3.5rem)] bg-black">
				<main className="container pt-12">
					<Suspense fallback={<div className="h-10 w-full animate-pulse rounded-lg bg-muted" />}>{children}</Suspense>
				</main>
			</div>
			<Footer />
		</div>
	);
}
