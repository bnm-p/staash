"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@workspace/ui/components/card";
import type { NextPage } from "next";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const links = [
	{ href: "/account/general", label: "General" },
	{ href: "/account/connections", label: "Connections" },
	{ href: "/account/tokens", label: "Tokens" },
	{ href: "/account/notifications", label: "Notifications" },
];

const AccountPage: NextPage = () => {
	const { data: session } = authClient.useSession();

	return (
		<div className="flex pt-20">
			<div className="w-60">
				{links.map((link) => (
					<div key={link.href} className="rounded-sm py-2 pl-3 hover:bg-muted">
						<Link href={link.href}>
							<div className="text-sm">{link.label}</div>
						</Link>
					</div>
				))}
			</div>
			<div className="space-between w-full">
				<div className="w-full pl-3">
					<div className="space-y-3 pb-10">
						<div className="text-xl">General</div>
						<div className="text-muted-foreground">Basic information you'll share on your account.</div>
					</div>
				</div>

				<div className="pl-3">
					<Card>
						<div className="flex items-center justify-between border-border border-b p-6">
							<div className="space-y-3">
								<CardHeader className="p-0 text-xl">Avatar</CardHeader>
								<CardDescription className="text-base">
									This is your profile picture. <br />
									Mostly used to identify you and your team members more easily.
								</CardDescription>
							</div>
							<CardContent className="p-0">
								<Avatar className="size-12">
									<AvatarImage src={session?.user?.image || ""} alt={session?.user?.name} />
									<AvatarFallback>{session?.user?.name[0]}</AvatarFallback>
								</Avatar>
							</CardContent>
						</div>
						<CardFooter className="px-6 py-4">
							<Button>Save</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default AccountPage;
