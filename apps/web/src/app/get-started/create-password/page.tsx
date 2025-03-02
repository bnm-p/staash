"use client";

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

// Pick only the password fields from the original schema
const onboardingPasswordSchema = onboardingSchema.pick({
	password: true,
	repeatPassword: true,
});
type OnboardingPasswordSchema = z.infer<typeof onboardingPasswordSchema>;

// Helper function to check password criteria
const getPasswordCriteria = (password: string) => ({
	length: password.length >= 8,
	uppercase: /[A-Z]/.test(password),
	lowercase: /[a-z]/.test(password),
	number: /[0-9]/.test(password),
	special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
});

// Returns a color based on the score (number of criteria met)
const getStrengthColor = (score: number): string => {
	const ratio = score / 5;
	if (ratio > 0.8) return "#10b981"; // green
	if (ratio > 0.4) return "#eab308"; // yellow
	return "#e11d48"; // red
};

// Component for displaying the password strength indicator
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
	const criteria = getPasswordCriteria(password);
	const score = Object.values(criteria).filter(Boolean).length;
	const color = getStrengthColor(score);
	const width = (score / 5) * 100;

	// List of criteria for display
	const criteriaList = [
		{ label: "At least 8 characters", valid: criteria.length },
		{ label: "Contains uppercase letter", valid: criteria.uppercase },
		{ label: "Contains lowercase letter", valid: criteria.lowercase },
		{ label: "Contains a number", valid: criteria.number },
		{ label: "Contains a special character", valid: criteria.special },
	];

	return (
		<div>
			{/* Password strength progress bar */}
			<div className="relative flex h-1 w-full overflow-hidden rounded-sm bg-muted mb-2">
				<div
					className="transition-all ease-out duration-150"
					style={{
						width: `${width}%`,
						background: color,
					}}
				/>
			</div>
			{/* List of criteria */}
			<ul className="space-y-1 text-sm text-muted-foreground text-left">
				{criteriaList.map((item, index) => (
					<li key={index} className="flex items-center gap-2">
						<span className={`h-2 w-2 rounded-full ${item.valid ? "bg-emerald-500" : "bg-muted"}`} />
						<span>{item.label}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

const CreatePasswordPage: NextPage = () => {
	const router = useRouter();
	const setData = useOnboardingStore((state) => state.setData);

	const form = useForm<OnboardingPasswordSchema>({
		resolver: zodResolver(onboardingPasswordSchema),
		defaultValues: {
			password: "",
			repeatPassword: "",
		},
	});

	// Watch the password field to update the strength indicator in real-time
	const password = form.watch("password");

	const onSubmit = (data: OnboardingPasswordSchema) => {
		setData(data);
		router.push("/get-started/your-name");
	};

	return (
		<div className="flex flex-col items-center gap-8 pt-24 text-center">
			<div className="space-y-2.5">
				<h1 className="font-bold text-2xl">Create a Password</h1>
				<p className="text-lg text-muted-foreground">We&apos;ll use this password to sign in to your account.</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-8">
					<div className="space-y-4">
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
						<PasswordStrengthIndicator password={password} />
					</div>
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
					<Button type="submit" className="w-full">
						Next
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default CreatePasswordPage;
