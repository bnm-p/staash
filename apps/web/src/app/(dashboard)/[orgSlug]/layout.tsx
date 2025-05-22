import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

export default async function OrgLayout({
	children,
	subnav,
}: Readonly<{
	children: React.ReactNode;
	subnav: React.ReactNode;
}>) {
	return (
		<div>
			<Nav />
			{subnav}
			<div className="flex min-h-[calc(100svh-3.5rem)] bg-black">
				<main className="container pt-12">{children}</main>
			</div>
			<Footer />
		</div>
	);
}
