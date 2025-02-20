"use client";

import { authClient } from "@/lib/auth-client";
import type { Organization } from "@prisma/client";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@workspace/ui/components/avatar";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@workspace/ui/components/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { type FC, useCallback, useEffect, useRef, useState } from "react";
import type { IOrgSwitchProps } from "./org-switch";

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
	const pathname = usePathname();
	const { data: activeOrganization, isPending } =
		authClient.useActiveOrganization();

	const orgsCommandRef = useRef<HTMLInputElement>(null);
	const spacesCommandRef = useRef<HTMLInputElement>(null);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!open) return;
			if (e.key === "ArrowRight") {
				spacesCommandRef.current?.focus();
			} else if (e.key === "ArrowLeft") {
				orgsCommandRef.current?.focus();
			}
		},
		[open],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	const handleOrgChange = useCallback(
		async (org: Organization) => {
			if (!org.slug) return;

			void authClient.organization.setActive({
				organizationSlug: org.slug,
			});

			setOpen(false);
			router.refresh();
			router.push(`/${org.slug}`);
		},
		[router],
	);

	useEffect(() => {
		const segments = pathname.split("/").filter(Boolean);
		const orgSlug = segments[0];
		if (orgSlug && orgSlug !== "create") {
			const org = organizations.find((org) => org.slug === orgSlug);
			if (!org) {
				router.push("/");
				return;
			}
			// Set active organization regardless
			authClient.organization.setActive({ organizationSlug: org.slug });

			// Only redirect if there is no additional path (i.e. only the org slug)
			if (segments.length === 1) {
				router.push(`/${org.slug}`);
			}
		}
	}, [pathname, organizations, router]);

	const handleCreateOrg = () => {
		router.push("/create/org");
	};

	const handleCreateSpace = () => {
		router.push("/create/space");
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-expanded={open}
					aria-label="Select organization and space"
					className="h-full w-[256px] justify-between flex items-center px-8 hover:bg-muted"
					{...props}
				>
					<div className="flex items-center gap-2">
						<Avatar className="size-8">
							<AvatarImage
								src={activeOrganization?.logo || ""}
								alt={activeOrganization?.name}
							/>
							<AvatarFallback>{activeOrganization?.name[0]}</AvatarFallback>
						</Avatar>
						<span className="text-sm">
							{activeOrganization?.name}
							{/* {selectedSpace ? ` / ${selectedSpace.name}` : ""} */}
						</span>
					</div>
					<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[516px] p-0 border-none"
				align="start"
				alignOffset={-1}
				sideOffset={0}
			>
				<div className="grid grid-cols-2 overflow-hidden border bg-background shadow-sm">
					<div className="border-r">
						<Command className="h-full border-none">
							<CommandInput
								ref={orgsCommandRef}
								placeholder="Find Organization..."
							/>
							<CommandList>
								<CommandEmpty>No organizations found.</CommandEmpty>
								<CommandGroup heading="Organizations" className="p-0">
									{organizations.map((org) => (
										<CommandItem
											key={org.id}
											onSelect={() => handleOrgChange(org)}
											className="flex items-center gap-2 px-4 py-2 data-[selected=true]:bg-muted"
										>
											<Avatar className="h-8 w-8">
												<AvatarImage src={org.logo || ""} alt={org.name} />
												<AvatarFallback>{org.name[0]}</AvatarFallback>
											</Avatar>
											<span>{org.name}</span>
											<Check
												className={cn(
													"ml-auto h-4 w-4",
													activeOrganization?.id === org.id
														? "opacity-100"
														: "opacity-0",
												)}
											/>
										</CommandItem>
									))}
									<CommandItem
										onSelect={handleCreateOrg}
										className="flex items-center gap-2 px-4 py-2 text-sm data-[selected=true]:bg-muted"
									>
										<div className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed">
											<Plus className="h-4 w-4" />
										</div>
										Create Team
									</CommandItem>
								</CommandGroup>
							</CommandList>
						</Command>
					</div>
					<div>
						<Command className="h-full border-none">
							<CommandInput
								ref={spacesCommandRef}
								placeholder="Find Space..."
							/>
							<CommandList>
								<CommandEmpty>No spaces found.</CommandEmpty>
								<CommandGroup heading="Spaces" className="p-0">
									{/* {spaces.map((space) => (
										<CommandItem
											key={space.id}
											onSelect={() => {
												setSelectedSpace(space);
												setOpen(false);
											}}
											className="flex items-center gap-2 px-4 py-2 data-[selected=true]:bg-muted"
										>
											<div className="flex h-6 w-6 items-center justify-center border bg-muted">
												{space.icon ? (
													<img
														src={space.icon || "/placeholder.svg"}
														alt=""
														className="h-4 w-4"
													/>
												) : (
													<div className="h-4 w-4" />
												)}
											</div>
											<span>{space.name}</span>
											<Check
												className={cn(
													"ml-auto h-4 w-4",
													selectedSpace?.id === space.id
														? "opacity-100"
														: "opacity-0",
												)}
											/>
										</CommandItem>
									))} */}
									<CommandItem
										onSelect={handleCreateSpace}
										className="flex items-center gap-2 px-4 py-2 text-sm data-[selected=true]:bg-muted"
									>
										<div className="flex h-6 w-6 items-center justify-center border border-dashed">
											<Plus className="h-4 w-4" />
										</div>
										Create Space
									</CommandItem>
								</CommandGroup>
							</CommandList>
						</Command>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
