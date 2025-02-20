import { Button, Html, Tailwind } from "@react-email/components";

export const MyEmail = () => {
	return (
		<Html>
			<Tailwind>
				<Button
					href="https://example.com"
					style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
				>
					Click me
				</Button>
			</Tailwind>
		</Html>
	);
};

export default MyEmail;
