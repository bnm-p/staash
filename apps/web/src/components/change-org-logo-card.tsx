"use client";

import type { FC } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import type { Organization } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";

import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import Image from "next/image";
import { X } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { client } from "@/lib/client";

interface IChangeOrgLogoCardProps {
	organization: Organization;
}

export const ChangeOrgLogoCard: FC<IChangeOrgLogoCardProps> = ({ organization }) => {
	const [preview, setPreview] = useState<string | null>(organization.logo || null);
	const [pendingFile, setPendingFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const router = useRouter();

	const { startUpload, routeConfig } = useUploadThing("imageUploader", {
		onUploadError: () => {
			toast.error("Failed to upload logo");
			setIsSubmitting(false);
		},
	});

	const handleFileChange = useCallback((file: File | null) => {
		setPendingFile(file);

		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setPreview(null);
		}
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => {
			if (acceptedFiles[0]) {
				handleFileChange(acceptedFiles[0]);
			}
		},
		accept: generateClientDropzoneAccept(["image/*"]),
		maxFiles: 1,
	});

	const clearImage = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			handleFileChange(null);
		},
		[handleFileChange],
	);

	const onSave = async () => {
		try {
			setIsSubmitting(true);

			let logoUrl = "";
			if (pendingFile) {
				const uploadResult = await startUpload([pendingFile]);
				if (!uploadResult?.[0]?.ufsUrl) {
					throw new Error("Logo upload failed");
				}
				logoUrl = uploadResult[0].ufsUrl;
			}

			const res = await client.api.orgs[":orgSlug"].logo.$put({
				form: { logo: logoUrl },
				param: { orgSlug: organization.slug },
			});

			const data = await res.json();

			toast.success("Organization updated");
			router.refresh();
			router.push(`/orgs/${data.slug}`);
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to update organization");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card>
			<div className="flex items-center justify-between border-border border-b p-6">
				<div className="space-y-3">
					<CardHeader className="p-0 text-xl">Logo</CardHeader>
					<CardDescription className="text-base">
						This is your organization logo. <br />
						Mostly used to identify your organization.
					</CardDescription>
				</div>
				<CardContent className="p-0">
					<div {...getRootProps()} className={cn("cursor-pointer transition-colors hover:border-muted-foreground/50")}>
						<input {...getInputProps()} />
						<div className="size-20 text-center">
							{preview ? (
								<div className="group relative">
									<button
										type="button"
										onClick={clearImage}
										className="-right-2 -top-2 absolute rounded-sm border bg-background p-1 opacity-0 hover:bg-muted group-hover:opacity-100"
									>
										<X className="h-4 w-4" />
									</button>
									<div className={cn("overflow-hidden")}>
										<Image src={preview} alt="Image preview" width={96} height={96} className="h-full w-full object-cover" />
									</div>
								</div>
							) : (
								<Avatar className="size-20">
									<AvatarImage src={organization.logo || ""} alt={organization.name} />
									<AvatarFallback className="text-4xl">{organization.name[0]}</AvatarFallback>
								</Avatar>
							)}
						</div>
					</div>
				</CardContent>
			</div>
			<CardFooter className="px-6 py-4">
				<Button disabled={isSubmitting} onClick={onSave}>
					Save
				</Button>
			</CardFooter>
		</Card>
	);
};
