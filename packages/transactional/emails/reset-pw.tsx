import { Html, Head, Body, Container, Text, Link, Section, Tailwind, Button, Img } from "@react-email/components";
import * as React from "react";

interface StaashResetPwEmailProps {
	resetLink?: string;
}

export const StaashResetPwEmail = ({ resetLink }: StaashResetPwEmailProps) => (
	<Html>
		<Head />
		<Tailwind>
			<Body className="bg-white font-sans">
				<Container className="mx-auto mt-5 max-w-md rounded border border-gray-200 bg-white p-10 shadow-md">
					<div className="flex items-center justify-center gap-x-2">
						{/*<Img src="url" alt="Staash Logo" width="46" height="22" />*/}
					</div>

					<Text className="text-center font-medium text-black text-lg">Click the button below to reset your password.</Text>
					<Section className="mx-auto mt-4 mb-3 w-72 text-center">
						<Button href={resetLink} className="rounded bg-black px-4 py-2 font-bold text-white text-xl tracking-widest">
							Reset Password
						</Button>
					</Section>
					<Text className="text-center text-gray-700 text-sm">Not expecting this email?</Text>
					<Text className="text-center text-gray-700 text-sm">
						Contact{" "}
						<Link href="mailto:support@staash.com" className="underline">
							support@stash.com
						</Link>{" "}
						if you did not request this email.
					</Text>
				</Container>
				<Text className="mt-5 text-center font-extrabold text-black text-xs uppercase">Securely powered by Staash.</Text>
			</Body>
		</Tailwind>
	</Html>
);

StaashResetPwEmail.PreviewProps = {
	resetLink: "https://example.com/reset-password",
} as StaashResetPwEmailProps;

export default StaashResetPwEmail;
