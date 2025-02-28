"use client";

import { useActiveOrg } from "@/hooks/use-active-org";
import { useModal } from "@/hooks/use-modal";
import { useOrgSwitch } from "@/hooks/use-org-switch";
import type { OrganizationWithSpaces } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@workspace/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { IOrgSwitchProps } from "./org-switch";

interface IOrgSwitchClientProps extends IOrgSwitchProps {
	organizations: OrganizationWithSpaces[];
}

export const OrgSwitchClient = memo(({ className, organizations, ...props }: IOrgSwitchClientProps) => {
	const [open, setOpen] = useState(false);
	const modal = useModal();
	const { activeOrg } = useActiveOrg();

	// Manage keyboard refs for switching inputs.
	const orgsCommandRef = useRef<HTMLInputElement>(null);
	const spacesCommandRef = useRef<HTMLInputElement>(null);

	// Set up keyboard navigation between the two command inputs.
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

	// Use our custom hook to encapsulate org/space switching logic.
	const {
		hoveredOrg,
		setHoveredOrg,
		selectedSpace,
		spaces,
		activeOrganizationName,
		handleOrgChange,
		handleSpaceSelect,
		hoveringCreateOrg,
		setHoveringCreateOrg,
	} = useOrgSwitch({
		organizations,
		open,
	});

	const handleCreateOrg = () => {
		setOpen(false);
		modal.onOpen("create-org");
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
				<Button
					variant="ghost"
					aria-expanded={open}
					aria-label="Select organization and space"
					className="-translate-x-2 flex items-center gap-4 px-2"
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
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[516px] p-0" align="start" alignOffset={-1} sideOffset={0}>
				<div className="grid grid-cols-2">
					{/* Organizations Column */}
					<div className="border-r">
						<Command className="h-full" defaultValue={activeOrg?.name}>
							<CommandInput ref={orgsCommandRef} placeholder="Find Organization..." />
							<CommandList className="p-1">
								<CommandEmpty>No organizations found.</CommandEmpty>
								{organizations.map((org) => (
									<CommandItem
										key={org.id}
										onMouseEnter={() => {
											if (hoveredOrg?.id !== org.id) {
												setHoveredOrg(org);
											}
										}}
										onFocus={() => {
											if (hoveredOrg?.id !== org.id) {
												setHoveredOrg(org);
											}
										}}
										onSelect={() => handleOrgChange(org)}
										value={org.name}
										className={cn("flex items-center gap-2 px-4 py-2")}
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
									onMouseLeave={() => setHoveringCreateOrg(false)}
									onMouseEnter={() => setHoveringCreateOrg(true)}
									onFocus={() => setHoveringCreateOrg(true)}
									className="flex items-center gap-2 px-4 py-2 text-sm data-[selected=true]:bg-muted"
								>
									<div className="flex size-6 items-center justify-center rounded-sm border border-dashed">
										<Plus className="h-4 w-4" />
									</div>
									Create Organization
								</CommandItem>
							</CommandList>
						</Command>
					</div>
					{/* Spaces Column */}
					<div>
						<Command className="h-full border-none">
							<CommandInput ref={spacesCommandRef} placeholder="Find Space..." />
							{!hoveringCreateOrg ? (
								<CommandList className="p-1">
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
								</CommandList>
							) : (
								<CommandEmpty>No Organization selected.</CommandEmpty>
							)}
						</Command>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
});
