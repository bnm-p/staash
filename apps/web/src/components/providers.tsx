"use client";

import type * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = new QueryClient();

	return (
		<NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange enableColorScheme>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</NextThemesProvider>
	);
}
