import { Nav } from "@/components/nav";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect("/auth/sign-in");
	}

	return (
		<div>
			<div className="flex h-14 border-border border-b">
				<div className="w-72 border-border border-r" />
				<Nav />
				<div className="w-72 border-border border-l" />
			</div>
			<div className="flex min-h-[calc(100svh-3.5rem)] border-border border-b">
				<div className="w-72 border-border border-r" />
				<main className="flex-grow">{children}</main>
				<div className="w-72 border-border border-l" />
			</div>
		</div>
	);
}
