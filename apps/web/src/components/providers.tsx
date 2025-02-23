"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import { Toaster } from "sonner";
import ModalProvider from "./providers/modal-provider";

export function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = new QueryClient();

	return (
		<NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange enableColorScheme>
			<Toaster theme="dark" toastOptions={{ className: "rounded-none" }} />
			<QueryClientProvider client={queryClient}>
				<ModalProvider />
				{children}
			</QueryClientProvider>
		</NextThemesProvider>
	);
}
