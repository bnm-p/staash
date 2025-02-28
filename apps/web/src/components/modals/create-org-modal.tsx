"use client";

import { useModal } from "@/hooks/use-modal";
import { slugify } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@workspace/ui/components/dialog";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";

import { useCallback, useEffect, useState, type FC } from "react";
import { Input } from "@workspace/ui/components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import { client } from "@/lib/client";
import { useUploadThing } from "@/lib/uploadthing";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "../ui/image-upload";

interface ICreateOrgModalProps extends React.ComponentProps<"div"> {}

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
	logo: z.string().optional(),
});

export const CreateOrgModal: FC<ICreateOrgModalProps> = ({ className }) => {
	const { isOpen, onClose, type } = useModal();
	const isModalOpen = isOpen && type === "create-org";

	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [pendingLogo, setPendingLogo] = useState<File | null>(null);
	const [autoSlug, setAutoSlug] = useState(true);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			slug: "",
			logo: "",
		},
	});

	const { startUpload } = useUploadThing("imageUploader", {
		onUploadError: () => {
			toast.error("Failed to upload logo");
			setIsSubmitting(false);
		},
	});

	const handleLogoChange = useCallback((file: File) => {
		setPendingLogo(file);
	}, []);

	const watchName = form.watch("name");
	const watchSlug = form.watch("slug");

	useEffect(() => {
		if (autoSlug && watchName) {
			form.setValue("slug", slugify(watchName));
		}
	}, [watchName, autoSlug, form]);

	useEffect(() => {
		if (autoSlug && watchName) {
			form.setValue("slug", slugify(watchName));
		}
	}, [watchName, autoSlug, form]);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setIsSubmitting(true);

			// Upload logo if present
			let logoUrl = "";
			if (pendingLogo) {
				const uploadResult = await startUpload([pendingLogo]);
				if (!uploadResult?.[0]?.ufsUrl) {
					throw new Error("Logo upload failed");
				}
				logoUrl = uploadResult[0].ufsUrl;
			}

			// Create organization
			const res = await client.api.orgs.$post({
				json: {
					...values,
					logo: logoUrl,
				},
			});

			const data = await res.json();

			toast.success("Organization created");
			router.refresh();
			router.push(`/orgs/${data.body.slug}`);
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to create organization");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		onClose();
		form.reset();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="overflow-hidden p-0">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="text-center font-bold text-2xl">Costomize your server</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Give your server a name and an icon. You can always change it later.
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
										<Input placeholder="My Organization" {...field} />
									</FormControl>
									<FormDescription>Name of your organization</FormDescription>
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
									<FormControl>
										<div className="flex items-stretch">
											<div className="flex items-center border border-border border-r-0 bg-muted px-4 py-2 text-muted-foreground text-sm">
												staash.app/
											</div>
											<Input
												placeholder="my-organization"
												{...field}
												onChange={(e) => {
													setAutoSlug(false);
													field.onChange(e);
												}}
											/>
										</div>
									</FormControl>
									<FormDescription>URL slug of your organization</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="px-8 py-6">
							<FormLabel>Logo</FormLabel>
							<ImageUpload onChange={setPendingLogo} className="mt-2" placeholder="Click or drag and drop to upload logo" />
						</div>

						<div className="px-8 py-6">
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating...
									</>
								) : (
									"Create Organization"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
