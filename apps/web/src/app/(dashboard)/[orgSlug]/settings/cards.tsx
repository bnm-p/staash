"use client";

import { SettingCard } from "@/components/setting-card";
import { client } from "@/lib/client";
import type { Organization } from "@prisma/client";
import { FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { SlugInput } from "@workspace/ui/components/slug-input";
import type { FC } from "react";
import { orgSettings_name, orgSettings_slug } from "./schemas";
import { useMutation } from "@tanstack/react-query";
import type { TOrgUpdateSchema } from "@/validators/orgs.schema";
import { toast } from "sonner";

interface ICardsProps {
	org: Organization;
}

export const Cards: FC<ICardsProps> = ({ org }) => {
	const updateOrgMutation = useMutation({
		mutationFn: async (orgData: TOrgUpdateSchema) => {
			const res = await client.api.orgs[":orgSlug"].$patch({
				json: orgData,
				param: { orgSlug: org.slug },
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message);
			}

			return data;
		},
		onSuccess: async (data, variables, context) => {
			toast.success("Organization updated!");
		},
		onError: (error, variables, context) => {
			console.error("Org updating failed", error);
			toast.error(error.message);
		},
	});

	return (
		<>
			<SettingCard
				title="Name"
				defaultValue={org.name || ""}
				instanceKey="name"
				description="Name of your organization"
				schema={orgSettings_name}
				onSave={async (values) => updateOrgMutation.mutate(values)}
				render={({ form }) => (
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="px-8 py-6">
								<FormControl>
									<Input placeholder="My Organization" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
			/>
			<SettingCard
				title="Slug"
				defaultValue={org.slug || ""}
				instanceKey="slug"
				description="Slug of your organization"
				schema={orgSettings_slug}
				onSave={async (values) => updateOrgMutation.mutate(values)}
				render={({ form }) => (
					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem className="px-8 py-6">
								<FormControl>
									<SlugInput prefix="staash.app/" placeholder="my-organization" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
			/>
		</>
	);
};
