"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { type FC, useState } from "react";

interface ISignInFormProps extends React.ComponentProps<"div"> {}

export const SignInForm: FC<ISignInFormProps> = ({ className, ...props }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSignInEmail = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) return;

		try {
			setLoading(true);
			await signIn.email({ email, password, rememberMe: true });
		} catch (error) {
			console.error("Failed to sign in", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSignInProvider = async (provider: "github") => {
		try {
			setLoading(true);
			await signIn.social({ provider, callbackURL: "/" });
		} catch (error) {
			console.error("Failed to sign in", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<form onSubmit={handleSignInEmail}>
				<fieldset disabled={loading} className="space-y-8">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							<Link href="#" className="ml-auto inline-block text-sm underline">
								Forgot your password?
							</Link>
						</div>

						<Input
							id="password"
							type="password"
							placeholder="password"
							autoComplete="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<Button type="submit" className="w-full">
						{loading ? <Loader2 size={16} className="animate-spin" /> : "Login"}
					</Button>

					<div className="my-1 h-4">
						<div className="right-0 left-0 flex items-center gap-x-4">
							<div className="h-px w-full bg-muted" />
							<span className="whitespace-nowrap text-muted-foreground text-xs uppercase">or</span>
							<div className="h-px w-full bg-muted" />
						</div>
					</div>

					<div className={cn("flex w-full items-center gap-2", "flex-col justify-between")}>
						<Button variant="outline" className={cn("w-full gap-2")} onClick={() => handleSignInProvider("github")}>
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
				</fieldset>
			</form>
			<p className="mt-8 text-muted-foreground text-xs">
				Don't have an account?{" "}
				<Link href="/auth/get-started" className="text-foreground underline">
					Sign up
				</Link>
				.
			</p>
		</div>
	);
};
