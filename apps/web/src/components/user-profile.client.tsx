"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import type { User } from "better-auth";
import { Cog, EllipsisVertical, LogOut, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import type { IUserProfileProps } from "./user-profile";

interface IUserProfileClientProps extends IUserProfileProps {
	user: User | undefined;
}

export const UserProfileClient: FC<IUserProfileClientProps> = ({ className, user, ...props }) => {
	const router = useRouter();

	const handleLogOut = async () => {
		await authClient.signOut();
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button type="button" className={cn("flex items-center gap-2", className)} {...props}>
					<div className="flex items-center gap-2">
						<Avatar className="size-8">
							<AvatarImage src={user?.image || ""} alt={user?.name} />
							<AvatarFallback>{user?.name[0]}</AvatarFallback>
						</Avatar>
					</div>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[calc(14rem+1px)] p-0" align="end" sideOffset={0} alignOffset={-1}>
				<DropdownMenuItem onClick={() => router.push("/account")}>
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
