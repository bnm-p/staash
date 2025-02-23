"use client";

import { authClient } from "@/lib/auth-client";
import { client } from "@/lib/client";
import type { OrganizationWithSpaces } from "@/lib/types";
import type { Organization } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface SetActiveOrgParams {
	orgId?: string;
	orgSlug?: string;
}

export const useActiveOrg = () => {
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();

	// Fetch user's organizations
	const {
		data: usersOrganizations,
		isLoading: isLoadingOrgs,
		error: orgsError,
	} = useQuery<OrganizationWithSpaces[]>({
		queryKey: ["organizations"],
		queryFn: async () => {
			const response = await client.api.users.orgs.$get();
			const data = await response.json();

			// Convert string dates to Date objects
			return data.map((org) => ({
				...org,
				createdAt: new Date(org.createdAt),
				spaces: org.spaces.map((space) => ({
					...space,
					createdAt: new Date(space.createdAt),
				})),
			}));
		},
		enabled: !!session, // Only fetch if user is authenticated
		refetchOnMount: false, // Don't refetch on mount
	});

	// Fetch active organization
	const {
		data: activeOrg,
		isLoading: isLoadingActiveOrg,
		error: activeOrgError,
	} = useQuery<Organization | null>({
		queryKey: ["activeOrg"],
		queryFn: async () => {
			const response = await client.api.users.activeOrg.$get();
			const data = await response.json();

			if (!data) return null;

			return {
				...data,
				createdAt: new Date(data?.createdAt || ""),
			};
		},
		enabled: !!session,
		staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
		refetchOnMount: false, // Don't refetch on mount
	});

	// Mutation to set active organization
	const {
		mutate: setActiveOrg,
		isPending: isSettingActiveOrg,
		error: setActiveOrgError,
	} = useMutation({
		mutationFn: async ({ orgId, orgSlug }: SetActiveOrgParams) => {
			console.log("setActiveOrg", orgId, orgSlug);

			const response = await client.api.users.activeOrg.$put({
				json: { orgId, orgSlug },
			});
			const data = await response.json();

			return data;
		},
		onMutate: async (newOrg) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["activeOrg"] });

			// Snapshot the previous value
			const previousOrg = queryClient.getQueryData<Organization>(["activeOrg"]);

			queryClient.setQueryData<Organization>(["activeOrg"], (old) => {
				if (!old) return old;
				return {
					...old,
					id: newOrg.orgId || old.id,
					slug: newOrg.orgSlug || old.slug,
					name: old.name,
				};
			});

			return { previousOrg };
		},
		onError: (err, _, context) => {
			console.log(err);
			queryClient.setQueryData(["activeOrg"], context?.previousOrg);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["activeOrg"] });
		},
	});

	return {
		activeOrg,
		setActiveOrg,
		usersOrganizations,
		isLoading: isLoadingOrgs || isLoadingActiveOrg,
		isSettingActiveOrg,
		error: orgsError || activeOrgError || setActiveOrgError,
	};
};
