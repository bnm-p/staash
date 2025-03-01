import { Html, Head, Body, Container, Text, Link, Section, Tailwind, Img } from "@react-email/components";
import * as React from "react";

interface StashVerifyEmailProps {
	validationCode?: string;
}

export const StashVerifyEmail = ({ validationCode }: StashVerifyEmailProps) => (
	<Html>
		<Head />
		<Tailwind>
			<Body className="bg-white font-sans">
				<Container className="mx-auto mt-5 max-w-md rounded border border-gray-200 bg-white p-10 shadow-md">
					<div className="flex items-center justify-center gap-x-2">
						{/*<Img src="url" alt="Staash Logo" width="46" height="22" />*/}
					</div>

					<Text className="text-center font-medium text-black text-lg">
						Enter the following code to finish linking your account.
					</Text>
					<Section className="mx-auto mt-4 mb-3 w-72 rounded bg-gray-100">
						<Text className="py-2 text-center font-bold text-2xl text-black tracking-widest">{validationCode}</Text>
					</Section>
					<Text className="text-center text-gray-700 text-sm">Not expecting this email?</Text>
					<Text className="text-center text-gray-700 text-sm">
						Contact{" "}
						<Link href="mailto:support@stash.com" className="underline">
							support@stash.com
						</Link>{" "}
						if you did not request this code.
					</Text>
				</Container>
				<Text className="mt-5 text-center font-extrabold text-black text-xs uppercase">Securely powered by Stash.</Text>
			</Body>
		</Tailwind>
	</Html>
);

StashVerifyEmail.PreviewProps = {
	validationCode: "123456",
} as StashVerifyEmailProps;

export default StashVerifyEmail;
