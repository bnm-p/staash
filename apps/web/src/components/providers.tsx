"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type * as React from "react";
import { Toaster } from "sonner";
import ModalProvider from "./providers/modal-provider";
import DrawerProvider from "./providers/drawer-provider";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange enableColorScheme>
			<Toaster theme="dark" toastOptions={{ className: "rounded-none" }} />
			<QueryClientProvider client={queryClient}>
				<ModalProvider />
				<DrawerProvider />
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</NextThemesProvider>
	);
}
