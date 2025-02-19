"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@workspace/ui/lib/utils";
import type { FC } from "react";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
} from "@workspace/ui/components/dropdown-menu";
import { Cog, LogOut, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { IUserProfileProps } from "./user-profile";
import type { InferSessionAPI, Session, User } from "better-auth";

interface IUserProfileClientProps extends IUserProfileProps {
	user: User | undefined;
}

export const UserProfileClient: FC<IUserProfileClientProps> = ({
	className,
	user,
	...props
}) => {
	const router = useRouter();

	const handleLogOut = async () => {
		await authClient.signOut();
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					className={cn(
						"text-sm font-medium flex items-center gap-2",
						className,
					)}
					{...props}
				>
					{user?.name}
					<div className="relative size-6 overflow-hidden bg-muted flex items-center justify-center">
						{user?.image ? (
							<Image
								src={user?.image}
								alt={`${user?.name}'s image`}
								fill
								className="object-cover"
							/>
						) : (
							<span className="text-xs text-muted-foreground scale-75">
								{user?.name?.[0]}
							</span>
						)}
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 p-0" align="end" sideOffset={10}>
				<DropdownMenuItem>
					<UserIcon />
					<span>Profile</span>
					<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Cog />
					<span>Settings</span>
					<DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem className="text-destructive" onClick={handleLogOut}>
					<LogOut />
					<span>Logout</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
