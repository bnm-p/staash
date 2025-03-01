"use client";

import { SettingCard } from "@/components/setting-card";
import { client } from "@/lib/client";
import type { Organization } from "@prisma/client";
import { FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { SlugInput } from "@workspace/ui/components/slug-input";
import type { FC } from "react";
import { orgSettings_name, orgSettings_slug } from "./schemas";

interface ICardsProps {
	org: Organization;
}

export const Cards: FC<ICardsProps> = ({ org }) => {
	return (
		<>
			<SettingCard
				title="Name"
				defaultValue={org.name || ""}
				instanceKey="name"
				description="Name of your organization"
				schema={orgSettings_name}
				onSave={async (values) => {
					await client.api.orgs[":orgSlug"].$patch({
						json: values,
						param: { orgSlug: org.slug },
					});
				}}
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
				onSave={async (values) => {
					await client.api.orgs[":orgSlug"].$patch({
						json: values,
						param: { orgSlug: org.slug },
					});
				}}
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
