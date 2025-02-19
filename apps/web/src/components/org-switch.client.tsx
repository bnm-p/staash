"use client";

import { authClient } from "@/lib/auth-client";
import type { Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useState, type FC } from "react";
import Image from "next/image";
import { ChevronsUpDown, Plus, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { IOrgSwitchProps } from "./org-switch";
import { Button } from "@workspace/ui/components/button";

interface IOrgSwitchClientProps extends IOrgSwitchProps {
	organizations: Organization[];
}

export const OrgSwitchClient: FC<IOrgSwitchClientProps> = ({
	className,
	organizations,
	...props
}) => {
	const [open, setOpen] = useState<boolean>(false);
	const router = useRouter();
	const { data: activeOrganization, isPending } =
		authClient.useActiveOrganization();

	const handleOrgChange = async (org: Organization) => {
		if (!org.slug) return;

		await authClient.organization.setActive({
			organizationSlug: org.slug,
		});
	};

	useEffect(() => {
		if (!activeOrganization) return;
		router.push(`/${activeOrganization.slug}`);
	}, [activeOrganization, router]);

	const handleCreateOrg = () => {
		router.push("/create");
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={"ghost"}
					type="button"
					className={cn("flex items-center justify-between w-44", className)}
					{...props}
				>
					<span className="text-sm font-medium flex items-center gap-2">
						{isPending ? (
							<>
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 w-12" />
							</>
						) : (
							<>
								<div className="relative h-4 w-4 overflow-hidden bg-muted flex items-center justify-center">
									{activeOrganization?.logo ? (
										<Image
											src={activeOrganization?.logo}
											alt={`${activeOrganization?.name}'s logo`}
											fill
											className="object-cover"
										/>
									) : (
										<span className="text-xs text-muted-foreground scale-75">
											{activeOrganization?.name?.[0]}
										</span>
									)}
								</div>
								{activeOrganization?.name}
							</>
						)}
					</span>
					<ChevronsUpDown className="size-3 text-muted-foreground" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0" align="start" sideOffset={10}>
				{organizations?.map((org) => (
					<button
						key={org.id}
						type="button"
						className={cn(
							"flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors",
							org.id === activeOrganization?.id
								? "text-muted-foreground opacity-50"
								: "bg-background text-white hover:bg-muted",
						)}
						onClick={() => {
							if (org.id !== activeOrganization?.id) {
								handleOrgChange(org as Organization);
								setOpen(false);
							}
						}}
					>
						<div className="relative h-4 w-4 overflow-hidden bg-muted flex items-center justify-center">
							{org.logo ? (
								<Image
									src={org.logo}
									alt={`${org.name}'s logo`}
									fill
									className="object-cover"
								/>
							) : (
								<span className="text-xs text-muted-foreground scale-75">
									{org.name?.[0]}
								</span>
							)}
						</div>
						<span>{org.name}</span>
					</button>
				))}
				<button
					type="button"
					className={cn(
						"flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors border-t border-border",
						"bg-background text-white hover:bg-muted",
					)}
					onClick={() => {
						handleCreateOrg();
						setOpen(false);
					}}
				>
					<PlusCircle className="text-primary size-4" />
					<span>Create Organization</span>
				</button>
			</PopoverContent>
		</Popover>
	);
};
