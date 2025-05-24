"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "../components/page-header";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@workspace/ui/components/input-otp";
import { useOnboardingStore } from "../store";
import { authClient } from "@/lib/auth-client";
import { getApiErrorMessage } from "@/lib/utils";

const ConfirmEmailPage = () => {
	const router = useRouter();
	const [otp, setOtp] = useState<string>("");
	const [isPending, startTransition] = useTransition();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const email = useOnboardingStore((state) => state.email);

	const onComplete = () => {
		startTransition(async () => {
			setErrorMessage(null);

			if (!email) {
				setErrorMessage("Missing email from onboarding state");
				return;
			}

			try {
				const { error } = await authClient.emailOtp.verifyEmail({
					email,
					otp,
				});

				if (error) {
					throw error;
				}

				router.push("/auth/get-started/create-password");
			} catch (err) {
				setErrorMessage(getApiErrorMessage(err));
			}
		});
	};

	return (
		<div className="flex h-full items-center">
			<div className="w-full space-y-12">
				<PageHeader title="Confirm your Email" description="We sent you a 6-digit verification code" />

				<div className="max-w-sm space-y-6">
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

					{errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}
				</div>
			</div>
		</div>
	);
};

export default ConfirmEmailPage;
