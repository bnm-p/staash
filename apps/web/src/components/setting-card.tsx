"use client";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@workspace/ui/components/card";
import { Form } from "@workspace/ui/components/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type DefaultValues, useForm } from "react-hook-form";
import type { z } from "zod";

interface ISettingCardProps<T extends z.ZodRawShape, K extends keyof z.infer<z.ZodObject<T>>> {
	defaultValue: z.infer<z.ZodObject<T>>[K];
	title: string;
	description: string;
	render: (props: {
		form: ReturnType<typeof useForm<z.infer<z.ZodObject<T>>>>;
	}) => React.ReactNode;
	instanceKey: K;
	schema: z.ZodObject<T>;
	onSave: (values: z.infer<z.ZodObject<T>>) => Promise<void>;
}

export const SettingCard = <T extends z.ZodRawShape, K extends keyof z.infer<z.ZodObject<T>>>({
	defaultValue,
	description,
	instanceKey,
	render,
	title,
	onSave,
}: ISettingCardProps<T, K>) => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const form = useForm<z.infer<z.ZodObject<T>>>({
		defaultValues: {
			[instanceKey]: defaultValue,
		} as DefaultValues<z.infer<z.ZodObject<T>>>,
	});

	const handleSubmit = async (values: z.infer<z.ZodObject<T>>) => {
		try {
			setIsSubmitting(true);
			await onSave(values);
			router.refresh();
		} catch (error) {
			console.error("Form submission error", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<div className="grid grid-cols-2 border-border border-b p-6">
						<div className="space-y-3">
							<CardHeader className="p-0 text-xl">{title}</CardHeader>
							<CardDescription className="text-base">{description}</CardDescription>
						</div>
						<CardContent className="p-0">{render({ form })}</CardContent>
					</div>
					<CardFooter className="px-6 py-4">
						<Button disabled={isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
};
