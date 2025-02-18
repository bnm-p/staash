"use client";

import type { NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { client } from "@/lib/client";

const IndexPage: NextPage = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["hello"],
		queryFn: async () => {
			const res = await client.api.hello.$get();
			const { message } = await res.json();
			return message;
		},
	});

	return (
		<div className="flex items-center justify-center min-h-svh">
			<div className="flex flex-col items-center justify-center gap-4">
				<h1 className="text-2xl font-bold">
					{isLoading ? "Loading..." : data}
				</h1>
				<Button size="sm">Button</Button>
			</div>
		</div>
	);
};

export default IndexPage;
