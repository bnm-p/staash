"use client";

import { authClient, signIn, signUp } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { onboardingSchema } from "../schema";
import { useOnboardingStore } from "../store";
import { toast } from "sonner";
import { auth } from "@/lib/auth";
import { client } from "@/lib/client";
import { useEffect } from "react";

const onboardingNameSchema = onboardingSchema.pick({
	name: true,
});

type OnboardingNameSchema = z.infer<typeof onboardingNameSchema>;

const YourNamePage: NextPage = () => {
	const router = useRouter();

	const email = useOnboardingStore((state) => state.email);
	const password = useOnboardingStore((state) => state.password);
	const repeatPassword = useOnboardingStore((state) => state.repeatPassword);

	const form = useForm<OnboardingNameSchema>({
		resolver: zodResolver(onboardingNameSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (data: OnboardingNameSchema) => {
		try {
			if (!email || !password || !repeatPassword) {
				throw new Error("Missing email or password");
			}

			await client.api.users.account.$post({
				json: {
					email,
					password,
					name: data.name,
				},
			});

			router.push("/");
		} catch (error) {}
	};

	return (
		<div className="flex flex-col items-center gap-8 pt-24 text-center">
			<div className="space-y-2.5">
				<h1 className="bold">First enter your Email</h1>
				<p className="text-lg text-muted-foreground">we suggest using your work email</p>
			</div>
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
					<Button type="submit" className="w-full">
						Continue
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default YourNamePage;
