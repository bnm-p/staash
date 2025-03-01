import { Html, Head, Body, Container, Text, Link, Section, Tailwind } from "@react-email/components";
import * as React from "react";

interface StashVerifyEmailProps {
	validationCode?: string;
}

export const StashVerifyEmail = ({ validationCode }: StashVerifyEmailProps) => (
	<Html>
		<Head />
		<Tailwind>
			<Body className="bg-white font-sans">
				<Container className="bg-white border border-gray-200 rounded shadow-md mt-5 max-w-md mx-auto p-10">
					<div className="flex items-center gap-x-2 justify-center">
						{" "}
						<svg width="46" height="22" viewBox="0 0 46 22" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Staash</title>
							<path d="M25.0909 7.33333H33.4545L29.2727 14.6667L25.0909 7.33333Z" fill="black" /> {/* Changed to black */}
							<path d="M20.9091 14.6667H12.5455L16.7273 7.33333L20.9091 14.6667Z" fill="black" />
							<path d="M37.6364 14.6667H29.2727L33.4545 7.33333L37.6364 14.6667Z" fill="black" />
							<path d="M37.6364 14.6667H29.2727L33.4545 7.33333L37.6364 14.6667Z" fill="black" />
							<path d="M8.36364 7.33333L16.7273 7.33333L12.5455 14.6667L8.36364 7.33333Z" fill="black" />
							<path d="M29.2727 14.6667H37.6364L33.4545 22L29.2727 14.6667Z" fill="black" />
							<path d="M16.7273 7.33333L8.36364 7.33333L12.5455 0L16.7273 7.33333Z" fill="black" />
							<path d="M37.6364 3.66343e-07H46L41.8182 7.33333L37.6364 3.66343e-07Z" fill="black" />
							<path d="M8.36364 22H0L4.18182 14.6667L8.36364 22Z" fill="black" />
							<path d="M33.4545 22H25.0909L29.2727 14.6667L33.4545 22Z" fill="black" />
							<path d="M12.5455 0L20.9091 1.83172e-06L16.7273 7.33333L12.5455 0Z" fill="black" />
							<path d="M41.8182 7.33333H33.4545L37.6364 3.66343e-07L41.8182 7.33333Z" fill="black" />
							<path d="M4.18182 14.6667H12.5455L8.36364 22L4.18182 14.6667Z" fill="black" />
						</svg>
					</div>

					<Text className="text-black text-lg font-medium text-center">
						Enter the following code to finish linking your account.
					</Text>
					<Section className="bg-gray-100 rounded mt-4 mb-3 mx-auto w-72">
						<Text className="text-black text-2xl font-bold tracking-widest text-center py-2">{validationCode}</Text>
					</Section>
					<Text className="text-gray-700 text-sm text-center">Not expecting this email?</Text>
					<Text className="text-gray-700 text-sm text-center">
						Contact{" "}
						<Link href="mailto:support@stash.com" className="underline">
							support@stash.com
						</Link>{" "}
						if you did not request this code.
					</Text>
				</Container>
				<Text className="text-black text-xs font-extrabold uppercase text-center mt-5">Securely powered by Stash.</Text>
			</Body>
		</Tailwind>
	</Html>
);

StashVerifyEmail.PreviewProps = {
	validationCode: "123456",
} as StashVerifyEmailProps;

export default StashVerifyEmail;
