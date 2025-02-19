import { SignUpForm } from "@/components/forms/sign-up-form";
import type { NextPage } from "next";

const SignUpPage: NextPage = () => {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<SignUpForm />
			</div>
		</div>
	);
};

export default SignUpPage;
