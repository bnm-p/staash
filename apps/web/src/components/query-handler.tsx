"use client";

import type { UseQueryResult } from "@tanstack/react-query";

interface IQueryHandlerProps<TData> {
	query: UseQueryResult<TData, unknown>;
	render: (args: { data: TData; isFetching: boolean }) => React.ReactNode;
	loading?: () => React.ReactNode;
	error?: (args: { error: unknown }) => React.ReactNode;
	empty?: () => React.ReactNode;
}

export const QueryHandler = <TData,>({ query, render, loading, error, empty }: IQueryHandlerProps<TData>) => {
	if (query.isLoading) {
		// Show loading only on initial load
		return <>{loading ? loading() : <div>Loading...</div>}</>;
	}

	if (query.isError) {
		console.error("QueryClient Error", query.error);
		return <>{error ? error({ error: query.error }) : <div>Error</div>}</>;
	}

	if (query.isSuccess) {
		const data = query.data;
		const isEmptyArray = Array.isArray(data) && data.length === 0;
		const isFalsyData = data === null || data === undefined;

		if (isEmptyArray || isFalsyData) {
			return <>{empty ? empty() : <div>No data available.</div>}</>;
		}

		// Don't block render when refetching — just pass down `isFetching`
		return <>{render({ data, isFetching: query.isFetching })}</>;
	}

	// Catch-all
	return null;
};
