"use client";

import type { Organization, Space } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@workspace/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { type FC, memo, useCallback, useEffect, useRef, useState } from "react";
import type { IOrgSwitchProps } from "./org-switch";
import type { OrganizationWithSpaces } from "@/lib/types";
import { useModal } from "@/hooks/use-modal";
import { useActiveOrg } from "@/hooks/use-active-org";

interface IOrgSwitchClientProps extends IOrgSwitchProps {
	organizations: OrganizationWithSpaces[];
}

export const OrgSwitchClient: FC<IOrgSwitchClientProps> = memo(({ className, organizations, ...props }) => {
	const [open, setOpen] = useState<boolean>(false);
	const router = useRouter();
	const pathname = usePathname();
	const modal = useModal();
	const params = useParams<{ orgSlug?: string; spaceSlug?: string }>();

	const { activeOrg, setActiveOrg } = useActiveOrg();

	const [hoveredOrg, setHoveredOrg] = useState<Partial<Organization> | null>(activeOrg || null);
	const [activeOrganizationName, setActiveOrganizationName] = useState<string>(activeOrg?.name || "");
	const [spaces, setSpaces] = useState<Space[]>([]);
	const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

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
		if (!hoveredOrg) return;

		const spaces = organizations.find((org) => org.id === hoveredOrg.id)?.spaces ?? [];

		setSpaces(spaces);
	}, [organizations, hoveredOrg]);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	const handleOrgChange = useCallback(
		async (org: Organization) => {
			if (!org.slug) return;

			if (activeOrg?.id === org.id) return;

			setActiveOrg({ orgSlug: org.slug });

			setSelectedSpace(null);
			setOpen(false);
			router.refresh();
			router.push(`/${org.slug}`);
		},
		[router, setActiveOrg],
	);

	useEffect(() => {
		if (!activeOrg) return;
		setActiveOrganizationName(activeOrg.name);
	}, [activeOrg]);

	useEffect(() => {
		const { orgSlug } = params;
		if (orgSlug && orgSlug !== "create") {
			if (!activeOrg) return;

			setSelectedSpace(null);
			const org = organizations.find((org) => org.slug === orgSlug);
			if (!org) {
				router.push("/");
				return;
			}

			if (activeOrg.id !== org.id) {
				setActiveOrg({ orgId: org.id });
			}
		}
	}, [organizations, router, params, setActiveOrg, activeOrg]);

	useEffect(() => {
		const segments = pathname.split("/").filter(Boolean);
		if (segments.length >= 2) {
			const { orgSlug, spaceSlug } = params;

			if (orgSlug && spaceSlug && orgSlug !== "create" && spaceSlug !== "create") {
				const org = organizations.find((org) => org.slug === orgSlug);
				if (!org) {
					router.push("/");
					return;
				}

				if (!hoveredOrg || hoveredOrg.id !== org.id) {
					setHoveredOrg(org);
				}

				const foundSpace = org.spaces.find((space) => space.slug === spaceSlug);
				if (foundSpace) {
					setSelectedSpace(foundSpace);
				} else {
					router.push(`/${org.slug}`);
				}
			} else {
				setSelectedSpace(null);
			}
		}
	}, [pathname, organizations, router, hoveredOrg, params]);

	const handleSpaceSelect = useCallback(
		(slug: string) => {
			const selectedSpace = spaces.find((space) => space.slug === slug) || null;
			setSelectedSpace(selectedSpace);
			router.refresh();
			router.push(`/${hoveredOrg?.slug}/${slug}`);
		},
		[router, hoveredOrg, spaces],
	);

	const handleCreateOrg = () => {
		setOpen(false);
		router.push("/create");
		router.refresh();
	};

	const handleCreateSpace = () => {
		setOpen(false);
		modal.onOpen("create-space", {
			org: {
				slug: hoveredOrg?.slug,
				id: hoveredOrg?.id,
			},
		});
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-expanded={open}
					aria-label="Select organization and space"
					className="flex items-center gap-4"
					{...props}
				>
					<div className="flex items-center gap-2">
						<Avatar className="size-6">
							<AvatarImage src={activeOrg?.logo || ""} alt={activeOrg?.name} />
							<AvatarFallback className="text-xs">{activeOrg?.name[0]}</AvatarFallback>
						</Avatar>
						<span className="text-sm">
							{activeOrganizationName}
							{selectedSpace ? ` / ${selectedSpace.name}` : ""}
						</span>
					</div>
					<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-[516px] border-none p-0" align="start" alignOffset={-1} sideOffset={0}>
				<div className="grid grid-cols-2 overflow-hidden border bg-background shadow-sm">
					<div className="border-r">
						<Command className="h-full border-none">
							<CommandInput ref={orgsCommandRef} placeholder="Find Organization..." />
							<CommandList>
								<CommandEmpty>No organizations found.</CommandEmpty>
								<CommandGroup heading="Organizations" className="p-0">
									{organizations.map((org) => (
										<CommandItem
											key={org.id}
											onMouseEnter={() => setHoveredOrg(org)}
											onSelect={() => handleOrgChange(org)}
											className="flex items-center gap-2 px-4 py-2 data-[selected=true]:bg-muted"
										>
											<Avatar className="size-6">
												<AvatarImage src={org.logo || ""} alt={org.name} />
												<AvatarFallback className="text-xs">{org.name[0]}</AvatarFallback>
											</Avatar>
											<span>{org.name}</span>
											<Check className={cn("ml-auto h-4 w-4", activeOrg?.id === org.id ? "opacity-100" : "opacity-0")} />
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
							<CommandInput ref={spacesCommandRef} placeholder="Find Space..." />
							<CommandList>
								<CommandGroup heading="Spaces" className="p-0">
									{spaces.map((space) => (
										<CommandItem
											key={space.id}
											onSelect={() => {
												setOpen(false);
												handleSpaceSelect(space.slug);
											}}
											className="flex items-center gap-2 px-4 py-2 data-[selected=true]:bg-muted"
										>
											<Avatar className="size-6">
												{/* <AvatarImage
													src={space?.image || ""}
													alt={space.name}
												/> */}
												<AvatarFallback className="text-xs">{space.name[0]}</AvatarFallback>
											</Avatar>
											<span>{space.name}</span>
											<Check className={cn("ml-auto h-4 w-4", selectedSpace?.id === space.id ? "opacity-100" : "opacity-0")} />
										</CommandItem>
									))}
									<CommandItem
										onSelect={handleCreateSpace}
										className="flex items-center gap-2 px-4 py-2 text-sm data-[selected=true]:bg-muted"
									>
										<div className="flex h-6 w-6 items-center justify-center border border-dashed">
											<Plus className="h-4 w-4" />
										</div>
										Create new Space
									</CommandItem>
								</CommandGroup>
							</CommandList>
						</Command>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
});
