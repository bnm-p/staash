"use client";

import { client } from "@/lib/client";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@workspace/ui/components/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useParams, useRouter } from "next/navigation";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

interface ISettingsCardProps {
	schema: z.ZodObject<z.ZodRawShape>;
	defaultValue: string;
	instanceKey: string;
	label: string;
	description: string;
}

export const SettingsCard: FC<ISettingsCardProps> = ({ schema, defaultValue, instanceKey, description, label }) => {
	const params = useParams<{ orgSlug: string }>();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof schema>>({
		defaultValues: { [instanceKey]: defaultValue },
	});

	const handleSubmit = async (values: z.infer<typeof schema>) => {
		try {
			setIsSubmitting(true);

			const res = await client.api.orgs[":orgSlug"].$patch({
				json: { ...values },
				param: { orgSlug: params.orgSlug },
			});

			if (res.ok && values.slug) {
				router.push(`/${values.slug}/settings`);
			}

			router.refresh();
		} catch (error) {
			console.error("Form submission error", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<div className="grid grid-cols-2 border-border border-b p-6">
						<div className="space-y-3">
							<CardHeader className="p-0 text-xl">{label}</CardHeader>
							<CardDescription className="text-base">{description}</CardDescription>
						</div>
						<CardContent className="p-0">
							<FormField
								control={form.control}
								name={instanceKey}
								render={({ field }) => (
									<FormItem className="px-8 py-6">
										<FormControl>
											<Input placeholder="My Organization" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</div>
					<CardFooter className="px-6 py-4">
						<Button disabled={isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
};
