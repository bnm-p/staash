"use client";

import { useModal } from "@/hooks/use-modal";
import { client } from "@/lib/client";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { useRouter } from "next/navigation";

import { useState, type FC } from "react";
import { z } from "zod";

interface IDeleteOrgModalProps extends React.ComponentProps<"div"> {}

const formSchema = z.object({
	name: z.string(),
	slug: z.string(),
});

export const DeleteOrgModal: FC<IDeleteOrgModalProps> = ({ className }) => {
	const { isOpen, onClose, type, data: modalData } = useModal();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const isModalOpen = isOpen && type === "delete-org";

	const handleDelete = async () => {
		try {
			setIsSubmitting(true);

			if (!modalData?.org?.slug) {
				throw new Error("No active organization");
			}

			await client.api.orgs[":orgSlug"].$delete({
				param: { orgSlug: modalData?.org?.slug },
			});

			router.push("/");
			router.refresh();
			onClose();
		} catch (error) {
			console.error("Form submission error", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className="overflow-hidden p-0">
				<DialogHeader className="px-6 pt-8">
					<DialogTitle className="font-bold text-2xl">Delete Organization</DialogTitle>
					<DialogDescription className="text-balance text-muted-foreground">
						Are you sure you want to delete this organization? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<div className="px-6 py-4">
					<Button disabled={isSubmitting} onClick={handleDelete} variant={"destructive"}>
						Delete Organization
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
