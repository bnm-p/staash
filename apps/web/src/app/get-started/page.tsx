"use client";

import { authClient, signIn } from "@/lib/auth-client";
import { client } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { onboardingSchema } from "./schema";
import { useOnboardingStore } from "./store";

const onboardingEmailSchema = onboardingSchema.pick({
	email: true,
});

type OnboardingEmailSchema = z.infer<typeof onboardingEmailSchema>;

const GetStartedPage: NextPage = () => {
	const router = useRouter();

	const setData = useOnboardingStore((state) => state.setData);

	const form = useForm<OnboardingEmailSchema>({
		resolver: zodResolver(onboardingEmailSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: OnboardingEmailSchema) => {
		setData(data);

		try {
			const { error } = await authClient.emailOtp.sendVerificationOtp({
				email: data.email,
				type: "email-verification",
			});

			await client.api.users.$post({
				json: { email: data.email },
			});

			if (error) throw error;

			router.push("/get-started/confirm-email");
		} catch (error) {
			toast.error("Failed to send verification email");
		}
	};

	return (
		<div className="flex flex-col items-center gap-8 pt-24 text-center">
			<div className="space-y-2.5">
				<h1>First enter your Email</h1>
				<p className="text-lg text-muted-foreground">we suggest using your work email</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="name@work-email.com" {...field} />
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
			<div className="flex w-full max-w-sm items-center gap-x-4">
				<span className="h-px w-full flex-grow bg-muted" />
				<span className="text-muted-foreground">or</span>
				<span className="h-px w-full flex-grow bg-muted" />
			</div>
			<div className="w-full max-w-sm space-y-2.5">
				<Button
					variant="outline"
					className="w-full gap-2"
					onClick={async () => {
						await signIn.social({
							provider: "github",
							callbackURL: "/",
						});
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
						<title>Github</title>
						<path
							fill="currentColor"
							d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
						/>
					</svg>
					Sign in with Github
				</Button>
			</div>
		</div>
	);
};

export default GetStartedPage;
