"use client";

import { authClient } from "@/lib/auth-client";
import { client } from "@/lib/client";
import { slugify } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { type FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface ICreateOrgFormProps extends React.ComponentProps<"div"> {}

const formSchema = z.object({
	name: z.string(),
	slug: z.string(),
});

export const CreateSpaceForm: FC<ICreateOrgFormProps> = ({ className, ...props }) => {
	const router = useRouter();
	const [autoSlug, setAutoSlug] = useState(true);
	const { data: activeOrganization } = authClient.useActiveOrganization();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			slug: "",
		},
	});

	const watchName = form.watch("name", "");

	useEffect(() => {
		if (autoSlug && watchName) {
			form.setValue("slug", slugify(watchName));
		}
	}, [watchName, autoSlug, form]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			if (!activeOrganization) {
				throw new Error("No active organization");
			}

			const res = await client.api.orgs[":orgSlug"].spaces.$post({
				form: {
					...values,
					orgId: activeOrganization.id,
				},
				param: {
					orgSlug: activeOrganization.slug,
				},
			});

			const data = await res.json();

			toast.success("Space created");
			router.refresh();
			router.push(`/orgs/${activeOrganization.slug}/spaces/${data.slug}`);
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		}
	}

	return (
		<div className={cn("", className)} {...props}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn("w-full max-w-lg divide-y divide-border border-border border-r border-b", className)}
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="px-8 py-6">
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input type="" placeholder="My Space" {...field} />
								</FormControl>
								<FormDescription>Name of your space</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem className="px-8 py-6">
								<FormLabel>Slug</FormLabel>
								<FormControl className="flex items-stretch">
									<div>
										<div className="flex items-center border border-border border-r-0 bg-muted px-4 py-2 text-muted-foreground text-sm">
											staash.app/{activeOrganization?.slug}/
										</div>
										<Input
											type=""
											placeholder="my-space"
											{...field}
											onChange={(e) => {
												setAutoSlug(false);
												field.onChange(e);
											}}
										/>
									</div>
								</FormControl>
								<FormDescription>URL slug of your space</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="px-8 py-6">
						<Button type="submit" className="w-full ">
							Create Space
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
