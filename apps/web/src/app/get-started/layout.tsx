import { Logo } from "@/components/logo";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
