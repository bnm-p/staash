"use client";

import type { NextPage } from "next";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@workspace/ui/components/input-otp";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useOnboardingStore } from "../store";
import { authClient } from "@/lib/auth-client";

const ConfirmEmailPage: NextPage = () => {
	const router = useRouter();
	const [otp, setOtp] = useState<string>("");
	const [isPending, startTransition] = useTransition();

	const email = useOnboardingStore((state) => state.email);

	const onComplete = () => {
		startTransition(async () => {
			if (!email) return;

			const { error } = await authClient.emailOtp.verifyEmail({ email: email, otp });

			if (error) return;

			router.push("/get-started/create-password");
		});
	};

	return (
		<div className="flex flex-col items-center gap-8 pt-24 text-center">
			<div className="space-y-2.5">
				<h1 className="bold">Confirm your Email</h1>
				<p className="text-lg text-muted-foreground">we sent you a verification code</p>
			</div>
			<InputOTP maxLength={6} value={otp} onChange={setOtp} onComplete={onComplete} disabled={isPending}>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
				</InputOTPGroup>
				<InputOTPSeparator />
				<InputOTPGroup>
					<InputOTPSlot index={3} />
					<InputOTPSlot index={4} />
					<InputOTPSlot index={5} />
				</InputOTPGroup>
			</InputOTP>
		</div>
	);
};

export default ConfirmEmailPage;
