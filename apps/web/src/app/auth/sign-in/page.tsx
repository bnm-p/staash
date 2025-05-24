import type { NextPage } from "next";
import { SignInForm } from "@/components/forms/sign-in-form";

const SignInPage: NextPage = () => {
	return (
		<div className="flex h-full items-center">
			<div className="w-full max-w-sm space-y-12">
				<h1 className="text-4xl tracking-tight">Log in to Staash</h1>
				<SignInForm />
			</div>
		</div>
	);
};

export default SignInPage;
