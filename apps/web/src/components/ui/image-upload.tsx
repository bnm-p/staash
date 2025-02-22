"use client";

import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import Image from "next/image";
import { Sparkle, X } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface ImageUploadProps {
	onChange?: (file: File | null) => void;
	value?: string | null;
	className?: string;
	previewSize?: "sm" | "md" | "lg";
	accept?: Record<string, string[]>;
	maxFiles?: number;
	placeholder?: string;
	previewClassName?: string;
}

const sizeMap = {
	sm: "h-16 w-16",
	md: "h-20 w-20",
	lg: "h-24 w-24",
};

export const ImageUpload = ({
	onChange,
	value,
	className,
	previewSize = "md",
	accept,
	maxFiles = 1,
	placeholder = "Click or drag and drop to upload image",
	previewClassName,
}: ImageUploadProps) => {
	const [preview, setPreview] = useState<string | null>(value || null);
	const [pendingFile, setPendingFile] = useState<File | null>(null);

	const handleFileChange = useCallback(
		(file: File | null) => {
			setPendingFile(file);
			onChange?.(file);

			if (file) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreview(reader.result as string);
				};
				reader.readAsDataURL(file);
			} else {
				setPreview(null);
			}
		},
		[onChange],
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => {
			if (acceptedFiles[0]) {
				handleFileChange(acceptedFiles[0]);
			}
		},
		accept: accept || generateClientDropzoneAccept(["image/*"]),
		maxFiles,
	});

	const clearImage = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			handleFileChange(null);
		},
		[handleFileChange],
	);

	return (
		<div
			{...getRootProps()}
			className={cn(
				"cursor-pointer border-2 border-muted-foreground/25 border-dashed px-6 py-10 transition-colors hover:border-muted-foreground/50",
				className,
			)}
		>
			<input {...getInputProps()} />
			<div className="text-center">
				{preview ? (
					<div className="relative">
						<button
							type="button"
							onClick={clearImage}
							className="-right-2 -top-2 absolute border bg-background p-1 hover:bg-muted"
						>
							<X className="h-4 w-4" />
						</button>
						<div className={cn("mx-auto overflow-hidden", sizeMap[previewSize], previewClassName)}>
							<Image src={preview} alt="Image preview" width={96} height={96} className="h-full w-full object-cover" />
						</div>
					</div>
				) : (
					<Sparkle className="mx-auto h-10 w-10 text-muted-foreground/50" />
				)}
				<p className="mt-2 text-muted-foreground text-sm">{preview ? "Click or drag to replace" : placeholder}</p>
			</div>
		</div>
	);
};
