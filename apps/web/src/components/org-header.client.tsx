"use client";

import type { Organization } from "@prisma/client";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";

interface IOrgHeaderClientProps extends React.ComponentProps<"div"> {
	organization: Organization;
	isCreate?: boolean;
}

export const OrgHeaderClient: FC<IOrgHeaderClientProps> = ({ className, organization, isCreate = false, ...props }) => {
	const router = useRouter();

	const handleBack = () => {
		window.history.back();
		router.refresh();
	};

	return (
		<div
			className={cn("background-stripes animate | relative flex h-32 items-end border-border border-b px-8 py-6", className)}
			{...props}
		>
			<div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
			<div className="relative z-10 space-y-1.5">
				{isCreate ? (
					<>
						<button type="button" onClick={handleBack} className="flex items-center gap-x-2 text-muted-foreground">
							<ChevronLeft className="h-4 w-4" />
							{organization.name}
						</button>
						<p className="text-4xl">New space in {organization.name}</p>
					</>
				) : (
					<p className="flex items-center gap-x-2 text-4xl">{organization.name}</p>
				)}
			</div>
		</div>
	);
};
