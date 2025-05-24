"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { PageHeader } from "../components/page-header";
import { onboardingSchema } from "../schema";
import { useOnboardingStore } from "../store";

import { authClient } from "@/lib/auth-client";
import { client } from "@/lib/client";

import { getApiErrorMessage } from "@/lib/utils";
import type { z } from "zod";

const onboardingNameSchema = onboardingSchema.pick({
	name: true,
});

type OnboardingNameSchema = z.infer<typeof onboardingNameSchema>;

const YourNamePage = () => {
	const router = useRouter();

	const email = useOnboardingStore((state) => state.email);
	const password = useOnboardingStore((state) => state.password);
	const repeatPassword = useOnboardingStore((state) => state.repeatPassword);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const form = useForm<OnboardingNameSchema>({
		resolver: zodResolver(onboardingNameSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (data: OnboardingNameSchema) => {
		setErrorMessage(null);

		try {
			if (!email || !password || !repeatPassword) {
				throw new Error("Missing email or password from onboarding state");
			}

			// Create user account
			await client.api.users.account.$post({
				json: {
					email,
					password,
					name: data.name,
				},
			});

			// Automatically sign in
			await authClient.signIn.email({
				email,
				password,
				rememberMe: true,
			});

			router.push("/");
		} catch (err) {
			const message = getApiErrorMessage(err);
			setErrorMessage(message);
		}
	};

	return (
		<div className="flex h-full items-center">
			<div className="w-full space-y-12">
				<PageHeader title="What should we call you?" description="This is how you'll be referred to on Staash." />

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input placeholder="Your name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}

						<Button type="submit" className="w-full">
							Continue
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default YourNamePage;
