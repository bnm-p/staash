"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { onboardingSchema } from "./schema";
import { useOnboardingStore } from "./store";
import { client } from "@/lib/client";
import { authClient, signIn } from "@/lib/auth-client";
import { PageHeader } from "./components/page-header";
import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { getApiErrorMessage } from "@/lib/utils";

const onboardingEmailSchema = onboardingSchema.pick({ email: true });
type OnboardingEmailSchema = z.infer<typeof onboardingEmailSchema>;

const GetStartedPage = () => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const setData = useOnboardingStore((state) => state.setData);

	const form = useForm<OnboardingEmailSchema>({
		resolver: zodResolver(onboardingEmailSchema),
		defaultValues: {
			email: "",
		},
	});

	const email = form.watch("email");

	// Clear field-level errors when input changes
	useEffect(() => {
		form.clearErrors("email");
	}, [email]);

	const onSubmit = (data: OnboardingEmailSchema) => {
		startTransition(async () => {
			try {
				setData(data);

				const res = await client.api.users.$post({
					json: { email: data.email },
				});

				if (!res.ok) {
					form.setError("email", {
						type: "manual",
						message: "User with this email already exists",
					});
					return;
				}

				const { error } = await authClient.emailOtp.sendVerificationOtp({
					email: data.email,
					type: "email-verification",
				});

				if (error) {
					throw error;
				}

				router.push("/auth/get-started/confirm-email");
			} catch (err) {
				const message = getApiErrorMessage(err);
				toast.error(message);
			}
		});
	};

	return (
		<div className="flex h-full items-center">
			<div className="w-full space-y-12">
				<PageHeader title="First enter your Email" description="We suggest using your work email" />
				<div className="max-w-sm space-y-12">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<fieldset className="w-full space-y-4" disabled={isPending}>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input placeholder="name@work-email.com" {...field} autoComplete="email" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full">
									Continue
								</Button>
							</fieldset>
						</form>
					</Form>

					<div className="flex w-full items-center gap-x-4">
						<span className="h-px w-full flex-grow bg-muted" />
						<span className="text-muted-foreground">or</span>
						<span className="h-px w-full flex-grow bg-muted" />
					</div>

					<div className="w-full space-y-2.5">
						<Button
							disabled={isPending}
							variant="outline"
							className="w-full gap-2"
							onClick={async () => {
								try {
									await signIn.social({ provider: "github", callbackURL: "/" });
								} catch (err) {
									toast.error("GitHub sign-in failed");
								}
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
								<title>Github</title>
								<path
									fill="currentColor"
									d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
								/>
							</svg>
							Sign in with GitHub
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GetStartedPage;
