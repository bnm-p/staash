"use client";

import { Card, CardHeader, CardDescription, CardContent, CardFooter } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";
import type { FC } from "react";

interface ProfileSettingsCardProps {
	label: string;
	description: string;
	value: string;
	buttonText?: string;
	isReadOnly?: boolean;
	hasSaveButton?: boolean;
	isCopyable?: boolean;
}

const CopyButton = ({ text }: { text: string }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	return (
		<Button variant="ghost" size="icon" onClick={handleCopy}>
			{copied ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
		</Button>
	);
};

export const ProfileSettingsCard: FC<ProfileSettingsCardProps> = ({
	label,
	description,
	value,
	buttonText = "Save",
	isReadOnly = false,
	hasSaveButton = true,
	isCopyable = false,
}) => {
	return (
		<div className="pt-3">
			<Card>
				<div className="flex items-center justify-between border-border border-b p-6">
					<div className="space-y-3">
						<CardHeader className="p-0 text-xl">{label}</CardHeader>
						<CardDescription className="text-base">{description}</CardDescription>
					</div>
					<CardContent className="flex items-center p-0">
						<Input
							className={isCopyable ? "w-80" : "w-96"}
							value={value}
							readOnly={isReadOnly}
							placeholder={`Enter your ${label.toLowerCase()}`}
						/>
						{isCopyable && (
							<div className="pl-6">
								<CopyButton text={value} />
							</div>
						)}
					</CardContent>
				</div>
				{!isReadOnly && hasSaveButton && (
					<CardFooter className="px-6 py-4">
						<Button>{buttonText}</Button>
					</CardFooter>
				)}
			</Card>
		</div>
	);
};
