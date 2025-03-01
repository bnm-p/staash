"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { onboardingSchema } from "../schema";
import { useOnboardingStore } from "../store";

const onboardingPasswordSchema = onboardingSchema.pick({
	password: true,
	repeatPassword: true,
});

type OnboardingPasswordSchema = z.infer<typeof onboardingPasswordSchema>;

const CreatePasswordPage: NextPage = () => {
	const router = useRouter();

	const email = useOnboardingStore((state) => state.email);

	const setData = useOnboardingStore((state) => state.setData);

	const form = useForm<OnboardingPasswordSchema>({
		resolver: zodResolver(onboardingPasswordSchema),
		defaultValues: {
			password: "",
			repeatPassword: "",
		},
	});

	const onSubmit = (data: OnboardingPasswordSchema) => {
		setData(data);
		router.push("/get-started/your-name");
	};

	return (
		<div className="flex flex-col items-center gap-8 pt-24 text-center">
			<div className="space-y-2.5">
				<h1 className="bold">Create a Password</h1>
				<p className="text-lg text-muted-foreground">We&apos;ll use this password to sign in to your account.</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-[300px] space-y-8">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input autoComplete="new-password" placeholder="********" type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="repeatPassword"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="********" type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Next</Button>
				</form>
			</Form>
		</div>
	);
};

export default CreatePasswordPage;
