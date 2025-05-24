import Aurora from "@/components/aurora";

export default async function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative">
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
				<Aurora colorStops={["#65a30d", "#a3e635", "#365314"]} speed={0.25} />
			</div>
			<div className="relative flex min-h-screen">
				<main className="container">{children}</main>
			</div>
		</div>
	);
}
