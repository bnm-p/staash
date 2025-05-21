"use client";

import { useModal } from "@/hooks/use-modal";
import { client } from "@/lib/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { useRouter } from "next/navigation";

import { useState, type FC } from "react";

interface IDeleteSpaceModalProps extends React.ComponentProps<"div"> {}

export const DeleteSpaceModal: FC<IDeleteSpaceModalProps> = ({ className }) => {
	const { isOpen, onClose, type, data: modalData } = useModal();
	const qc = useQueryClient();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const isModalOpen = isOpen && type === "delete-space";

	const handleDelete = async () => {
		try {
			setIsSubmitting(true);

			if (!modalData?.org?.slug || !modalData?.space?.slug) {
				throw new Error("No active space");
			}

			await client.api.orgs[":orgSlug"].spaces[":spaceSlug"].$delete({
				param: {
					orgSlug: modalData?.org?.slug,
					spaceSlug: modalData?.space?.slug,
				},
			});

			router.refresh();
			qc.invalidateQueries({ queryKey: ["org", modalData.org.slug, "spaces"] });
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
					<DialogTitle className="font-bold text-2xl">Delete Space</DialogTitle>
					<DialogDescription className="text-balance text-muted-foreground">
						Are you sure you want to delete this space? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<div className="px-6 py-4">
					<Button disabled={isSubmitting} onClick={handleDelete} variant={"destructive"}>
						Delete Space
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
