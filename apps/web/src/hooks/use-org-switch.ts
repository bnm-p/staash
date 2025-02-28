import { useState, useEffect, useCallback } from "react";
import type { Organization, Space } from "@prisma/client";
import type { OrganizationWithSpaces } from "@/lib/types";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useActiveOrg } from "./use-active-org";

interface UseOrgSwitchParams {
	organizations: OrganizationWithSpaces[];
	open: boolean;
}

export function useOrgSwitch({ organizations, open }: UseOrgSwitchParams) {
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams<{ orgSlug?: string; spaceSlug?: string }>();

	const { activeOrg, setActiveOrg } = useActiveOrg();

	const [hoveredOrg, setHoveredOrg] = useState<Partial<Organization> | null>(null);
	const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
	const [spaces, setSpaces] = useState<Space[]>([]);
	const [activeOrganizationName, setActiveOrganizationName] = useState<string>(activeOrg?.name || "");
	const [hoveringCreateOrg, setHoveringCreateOrg] = useState(false);

	// Update the org name when activeOrg changes.
	useEffect(() => {
		if (activeOrg) {
			setActiveOrganizationName(activeOrg.name);
		}
	}, [activeOrg]);

	// Sync the active org based on route params.
	useEffect(() => {
		const { orgSlug } = params;
		if (orgSlug && orgSlug !== "create" && activeOrg) {
			const org = organizations.find((org) => org.slug === orgSlug);
			if (!org) {
				router.push("/");
				return;
			}
			if (activeOrg.id !== org.id) {
				setActiveOrg({ orgId: org.id });
			}
			setSelectedSpace(null);
		}
	}, [params, organizations, activeOrg, router, setActiveOrg]);

	// Update hovered org and selected space based on pathname.
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
				setHoveredOrg(org);
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
	}, [pathname, params, organizations, router]);

	// Update spaces list whenever hoveredOrg (or fallback to activeOrg) changes.
	useEffect(() => {
		const currentOrg = hoveredOrg || activeOrg;
		if (!currentOrg) return;
		const orgData = organizations.find((org) => org.id === currentOrg.id);
		setSpaces(orgData?.spaces || []);
	}, [hoveredOrg, activeOrg, organizations]);

	// When popover closes, reset hoveredOrg to activeOrg.
	useEffect(() => {
		if (!open && activeOrg) {
			setHoveredOrg(activeOrg);
		}
	}, [open, activeOrg]);

	const handleOrgChange = useCallback(
		(org: Organization) => {
			if (!org.slug || (activeOrg && activeOrg.id === org.id)) return;
			setActiveOrg({ orgSlug: org.slug });
			setSelectedSpace(null);
			router.refresh();
			router.push(`/${org.slug}`);
		},
		[activeOrg, setActiveOrg, router],
	);

	const handleSpaceSelect = useCallback(
		(slug: string) => {
			const space = spaces.find((s) => s.slug === slug) || null;
			setSelectedSpace(space);
			router.refresh();
			router.push(`/${hoveredOrg?.slug}/${slug}`);
		},
		[spaces, hoveredOrg, router],
	);

	return {
		hoveredOrg,
		setHoveredOrg,
		selectedSpace,
		spaces,
		activeOrganizationName,
		handleOrgChange,
		handleSpaceSelect,
		hoveringCreateOrg,
		setHoveringCreateOrg,
	};
}
