import { SignInForm } from "@/components/forms/sign-in-form";
import type { NextPage } from "next";

const SignInPage: NextPage = () => {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
			<div className="w-full max-w-sm">
				<SignInForm />
			</div>
		</div>
	);
};

export default SignInPage;
