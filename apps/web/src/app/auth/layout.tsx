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
			<div className="flex border-b h-14 border-border">
				<div className="w-72 border-r border-border" />
				<div className="flex-grow flex items-center justify-center px-4">
					<Logo />
				</div>
				<div className="w-72 border-l border-border" />
			</div>
			<div className="flex border-b min-h-[calc(100svh-3.5rem)] border-border">
				<div className="w-72 border-r border-border" />
				<main className="flex-grow px-4 pt-12">{children}</main>
				<div className="w-72 border-l border-border" />
			</div>
		</div>
	);
}
