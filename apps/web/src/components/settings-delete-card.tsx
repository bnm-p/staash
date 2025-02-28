"use client";

import type { FC } from "react";
import { useModal } from "@/hooks/use-modal";
import { Button } from "@workspace/ui/components/button";
import { Card, CardDescription, CardFooter, CardHeader } from "@workspace/ui/components/card";
import { useParams } from "next/navigation";

interface ISettingsDeleteCardProps {
	label: string;
	description: string;
}

export const SettingsDeleteCard: FC<ISettingsDeleteCardProps> = ({ description, label }) => {
	const { onOpen } = useModal();
	const params = useParams<{ orgSlug: string }>();

	const handleDelete = async () => {
		onOpen("delete-org", {
			org: { slug: params.orgSlug },
		});
	};

	return (
		<Card className="border-destructive/50 bg-destructive/10">
			<div className="grid grid-cols-2 border-destructive/50 border-b p-6">
				<div className="space-y-3">
					<CardHeader className="p-0 text-xl">{label}</CardHeader>
					<CardDescription className="text-base">{description}</CardDescription>
				</div>
			</div>
			<CardFooter className="justify-end px-6 py-4">
				<Button variant={"destructive"} onClick={handleDelete}>
					Delete Organization
				</Button>
			</CardFooter>
		</Card>
	);
};
