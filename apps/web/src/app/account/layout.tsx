import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { PageHeader } from "@/components/page-header";
import { SideNavigation } from "@/components/side-navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountLayout({
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
			<Nav showOrgSwitch={false} />
			<PageHeader title="Account Settings" />
			<div className="flex min-h-[calc(100svh-3.5rem)]">
				<main className="container grid grid-cols-[240px_1fr] gap-8 px-8 pt-20">
					<SideNavigation
						className="-translate-x-3"
						base="/account"
						items={[
							{ path: "/", label: "General" },
							{ path: "/connections", label: "Connections" },
							{ path: "/tokens", label: "Tokens" },
							{ path: "/notifications", label: "Notifications" },
						]}
					/>
					<div className="pt-4">
						<div className="mx-auto max-w-5xl">{children}</div>
					</div>
				</main>
			</div>
			<Footer />
		</div>
	);
}
