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

			const res = await client.api.org.space.$post({
				form: {
					...values,
					orgId: activeOrganization.id,
				},
			});

			const data = await res.json();

			toast.success("Space created");
			router.refresh();
			router.push(`/${activeOrganization.slug}/${data.slug}`);
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		}
	}

	return (
		<div className={cn("", className)} {...props}>
			<div>
				<h1 className="text-2xl font-semibold">Create Space</h1>
				<p className="text-muted-foreground">Set up your new space in seconds</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8 w-full py-10", className)}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input type="" className="max-w-md" placeholder="My Space" {...field} />
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
							<FormItem>
								<FormLabel>Slug</FormLabel>
								<FormControl className="flex items-stretch">
									<div className="max-w-md">
										<div className="px-4 py-2 bg-muted border border-r-0 border-border text-muted-foreground text-sm flex items-center">
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

					<Button type="submit" className="w-full max-w-md">
						Create Space
					</Button>
				</form>
			</Form>
		</div>
	);
};
