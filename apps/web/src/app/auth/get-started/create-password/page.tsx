"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { onboardingSchema } from "../schema";
import { useOnboardingStore } from "../store";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { PageHeader } from "../components/page-header";

import type { z } from "zod";
import { getApiErrorMessage } from "@/lib/utils";

const onboardingPasswordSchema = onboardingSchema.pick({
	password: true,
	repeatPassword: true,
});
type OnboardingPasswordSchema = z.infer<typeof onboardingPasswordSchema>;

// Utility: password criteria logic
const getPasswordCriteria = (password: string) => ({
	length: password.length >= 8,
	uppercase: /[A-Z]/.test(password),
	lowercase: /[a-z]/.test(password),
	number: /[0-9]/.test(password),
	special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
});

const getStrengthColor = (score: number): string => {
	const ratio = score / 5;
	if (ratio > 0.8) return "#10b981"; // green
	if (ratio > 0.4) return "#eab308"; // yellow
	return "#e11d48"; // red
};

// UI: Password strength indicator
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
	const criteria = getPasswordCriteria(password);
	const score = Object.values(criteria).filter(Boolean).length;
	const color = getStrengthColor(score);
	const width = (score / 5) * 100;

	const criteriaList = [
		{ label: "At least 8 characters", valid: criteria.length },
		{ label: "Contains uppercase letter", valid: criteria.uppercase },
		{ label: "Contains lowercase letter", valid: criteria.lowercase },
		{ label: "Contains a number", valid: criteria.number },
		{ label: "Contains a special character", valid: criteria.special },
	];

	return (
		<div>
			<div className="relative mb-2 flex h-1 w-full overflow-hidden rounded-sm bg-muted">
				<div
					className="transition-all duration-150 ease-out"
					style={{
						width: `${width}%`,
						background: color,
					}}
				/>
			</div>
			<ul className="space-y-1 text-left text-muted-foreground text-sm">
				{criteriaList.map((item, index) => (
					<li key={`criteria-${item.label}`} className="flex items-center gap-2">
						<span className={`h-2 w-2 rounded-full ${item.valid ? "bg-emerald-500" : "bg-muted"}`} />
						<span>{item.label}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

const CreatePasswordPage = () => {
	const router = useRouter();
	const setData = useOnboardingStore((state) => state.setData);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const form = useForm<OnboardingPasswordSchema>({
		resolver: zodResolver(onboardingPasswordSchema),
		defaultValues: {
			password: "",
			repeatPassword: "",
		},
	});

	const password = form.watch("password");

	const onSubmit = async (data: OnboardingPasswordSchema) => {
		setErrorMessage(null);

		try {
			setData(data);
			router.push("/auth/get-started/your-name");
		} catch (err) {
			setErrorMessage(getApiErrorMessage(err));
		}
	};

	return (
		<div className="flex h-full items-center">
			<div className="w-full space-y-12">
				<PageHeader title="Create a Password" description="We'll use this password to sign in to your account." />

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

						{errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}

						<Button type="submit" className="w-full">
							Next
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default CreatePasswordPage;
