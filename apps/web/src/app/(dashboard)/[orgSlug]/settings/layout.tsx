import { Footer } from "@/components/footer";
import { SideNavigation } from "@/components/side-navigation";
import { orgsService } from "@/queries/orgs.service";

export default async function AccountLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ orgSlug: string }>;
}>) {
	const { orgSlug } = await params;
	const org = await orgsService.getOrgBySlug(orgSlug);

	return (
		<div>
			<div className="flex min-h-[calc(100svh-3.5rem)]">
				<main className="container grid grid-cols-[240px_1fr] gap-8 px-8 pt-20">
					<SideNavigation
						className="-translate-x-3"
						base={`/${org.slug}`}
						items={[
							{ path: "/settings", label: "General" },
							{ path: "/settings/tokens", label: "Tokens" },
						]}
					/>
					<div className="pt-4">
						<div className="mx-auto max-w-5xl">{children}</div>
					</div>
				</main>
			</div>
		</div>
	);
}
