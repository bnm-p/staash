import { Logo } from "@/components/logo";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (session) {
		redirect("/");
	}

	return (
		<div>
			<div className="flex h-14 border-border border-b">
				<div className="w-72 border-border border-r" />
				<div className="flex flex-grow items-center justify-center px-4">
					<Logo />
				</div>
				<div className="w-72 border-border border-l" />
			</div>
			<div className="flex min-h-[calc(100svh-3.5rem)] border-border border-b">
				<div className="w-72 border-border border-r" />
				<main className="flex-grow px-4 pt-12">{children}</main>
				<div className="w-72 border-border border-l" />
			</div>
		</div>
	);
}
