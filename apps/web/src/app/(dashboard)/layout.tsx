import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { OrgSwitch } from "@/components/org-switch";
import { UserProfile } from "@/components/user-profile";

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
			<div className="flex border-b h-14 border-border">
				<div className="w-72 border-r border-border" />
				<div className="flex-grow flex items-center justify-between px-4">
					<div className="flex items-center gap-8">
						<Logo />
						<div className="h-6 w-px bg-border rotate-6" />
						<OrgSwitch />
					</div>
					<div>
						<UserProfile />
					</div>
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
