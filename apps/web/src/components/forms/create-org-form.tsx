"use client";

import { ImageUpload } from "@/components/ui/image-upload";
import { authClient } from "@/lib/auth-client";
import { client } from "@/lib/client";
import { useUploadThing } from "@/lib/uploadthing";
import { slugify } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "@uploadthing/react";
import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2, Sparkle, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FC, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import * as z from "zod";

interface ICreateOrgFormProps extends React.ComponentProps<"form"> {}

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
	logo: z.string().optional(),
});

export const CreateOrgForm: FC<ICreateOrgFormProps> = ({ className, ...props }) => {
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

	const { startUpload, routeConfig } = useUploadThing("imageUploader", {
		onUploadError: () => {
			toast.error("Failed to upload logo");
			setIsSubmitting(false);
		},
	});

	const handleLogoChange = useCallback((file: File) => {
		setPendingLogo(file);
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => {
			if (acceptedFiles[0]) {
				handleLogoChange(acceptedFiles[0]);
			}
		},
		accept: generateClientDropzoneAccept(generatePermittedFileTypes(routeConfig).fileTypes),
		maxFiles: 1,
	});

	const watchName = form.watch("name");
	const watchSlug = form.watch("slug");

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

			// Set active organization
			await authClient.organization.setActive({
				organizationSlug: values.slug,
			});

			toast.success("Organization created");
			router.refresh();
			router.push(`/orgs/${data.slug}`);
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to create organization");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="grid w-full grid-cols-1 md:grid-cols-[1fr_1.5fr]">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn("w-full max-w-lg divide-y divide-border border-border border-r border-b", className)}
					{...props}
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
			<div className="flex items-center justify-center">
				<div className="w-full max-w-md border border-border bg-background p-4">
					<div className="flex items-start gap-4">
						<div className="relative h-12 w-12 overflow-hidden border border-border">
							{pendingLogo ? (
								<Image
									alt="Logo preview"
									src={URL.createObjectURL(pendingLogo)}
									height={48}
									width={48}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center">
									<Sparkle className="h-6 w-6 text-muted-foreground" />
								</div>
							)}
						</div>
						<div className="flex-1 space-y-1">
							<h3 className="font-medium">{watchName || "My Organization"}</h3>
							<p className="text-muted-foreground text-sm">staash.app/{watchSlug || "my-organization"}</p>
						</div>
					</div>

					<div className="mt-6 border-t pt-6">
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<Users className="h-4 w-4" />
							<span>0 members</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
