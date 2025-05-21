"use client";

import { useModal } from "@/hooks/use-modal";
import { slugify } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@workspace/ui/components/dialog";
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

interface ICreateSpaceModalProps extends React.ComponentProps<"div"> {}

const formSchema = z.object({
	name: z.string(),
	slug: z.string(),
	icon: z.string(),
});

export const CreateSpaceModal: FC<ICreateSpaceModalProps> = ({ className }) => {
	const { isOpen, onClose, type, data: modalData } = useModal();
	const isModalOpen = isOpen && type === "create-space";

	const qc = useQueryClient();
	const router = useRouter();
	const [autoSlug, setAutoSlug] = useState(true);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			slug: "",
			icon: "",
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
			if (!modalData?.org?.id || !modalData?.org?.slug) {
				throw new Error("No active organization");
			}

			const res = await client.api.orgs[":orgSlug"].spaces.$post({
				json: {
					...values,
					orgId: modalData.org.id,
				},
				param: {
					orgSlug: modalData.org.slug,
				},
			});

			const data = await res.json();

			toast.success("Space created");
			router.refresh();
			qc.invalidateQueries({ queryKey: ["org", modalData.org.slug, "spaces"] });
			form.reset();
			onClose();
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		}
	}

	const handleClose = () => {
		onClose();
		form.reset();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="overflow-hidden p-0">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-center font-bold text-2xl">Create Space</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Give your space a name. You can always change it later.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className={cn("w-full max-w-lg divide-y divide-border border-border border-r border-b")}
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
										<SlugInput prefix={`staash.app/${modalData?.org?.slug}/`} placeholder="my-space" {...field} />
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
								<FormItem className="px-8 py-6">
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

						<div className="px-8 py-6">
							<Button type="submit" className="w-full ">
								Create Space
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
