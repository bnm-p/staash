"use client";

import { slugify } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";

import { useEffect, useState, type FC } from "react";
import { Input } from "@workspace/ui/components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import { client } from "@/lib/client";
import { SlugInput } from "@workspace/ui/components/slug-input";
import { icons } from "../icons";
import { useQueryClient } from "@tanstack/react-query";
import { useDrawer } from "@/hooks/use-drawer";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";

interface IEditSpaceDrawerProps extends React.ComponentProps<"div"> {}

const formSchema = z.object({
	name: z.string(),
	slug: z.string(),
	icon: z.string(),
});

export const EditSpaceDrawer: FC<IEditSpaceDrawerProps> = () => {
	const { isOpen, onClose, type, data: drawerData } = useDrawer();
	const isDrawerOpen = isOpen && type === "edit-space";

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const qc = useQueryClient();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	useEffect(() => {
		if (drawerData?.space?.slug) {
			form.setValue("slug", drawerData.space.slug);
		}
		if (drawerData?.space?.name) {
			form.setValue("name", drawerData.space.name);
		}
		if (drawerData?.space?.icon) {
			form.setValue("icon", drawerData.space.icon);
		}
	}, [drawerData, form]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsLoading(true);

			if (!drawerData?.org?.id || !drawerData?.org?.slug || !drawerData?.space?.slug) {
				throw new Error("No active organization");
			}

			const res = await client.api.orgs[":orgSlug"].spaces[":spaceSlug"].$patch({
				json: {
					...values,
				},
				param: {
					orgSlug: drawerData.org.slug,
					spaceSlug: drawerData.space.slug,
				},
			});

			const data = await res.json();

			toast.success("Space updated");
			router.refresh();
			qc.invalidateQueries({ queryKey: ["org", drawerData.org.slug, "spaces", data.body.slug] });
			qc.invalidateQueries({ queryKey: ["org", drawerData.org.slug, "spaces"] });
			form.reset();
			onClose();
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	const handleClose = () => {
		onClose();
		form.reset();
	};

	return (
		<Drawer open={isDrawerOpen} onOpenChange={handleClose}>
			<DrawerContent className="overflow-hidden p-0">
				<DrawerHeader>
					<DrawerTitle>Edit Space</DrawerTitle>
					<DrawerDescription>Edit your space details.</DrawerDescription>
				</DrawerHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 h-full">
						<fieldset disabled={isLoading} className="flex h-full flex-col justify-between">
							<div className="flex flex-col gap-y-8">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
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
										<FormItem>
											<FormLabel>Slug</FormLabel>
											<FormControl className="flex items-stretch">
												<SlugInput prefix={`staash.app/${drawerData?.org?.slug}/`} placeholder="my-space" {...field} />
											</FormControl>
											<FormDescription>URL slug of your space</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="icon"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Icon</FormLabel>
											<FormControl className="flex items-stretch">
												<div className="grid grid-cols-8 gap-4">
													{Object.entries(icons.logos).map(([key, Icon]) => (
														<Button
															key={key}
															type="button"
															onClick={() => field.onChange(key)}
															variant={field.value === key ? "outline" : "ghost"}
														>
															<Icon />
														</Button>
													))}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="flex items-center justify-end gap-x-2">
								<Button type="button" variant={"outline"} onClick={handleClose}>
									Cancel
								</Button>
								<Button type="submit">Save</Button>
							</div>
						</fieldset>
					</form>
				</Form>
			</DrawerContent>
		</Drawer>
	);
};
