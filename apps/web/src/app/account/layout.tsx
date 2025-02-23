import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { PageHeader } from "@/components/page-header";
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
				<main className="container mx-auto">{children}</main>
			</div>
			<Footer />
		</div>
	);
}
