import { useState } from "react";

export const useLocalStorageState = <T>(key: string, initialValue: T) => {
	const [state, setState] = useState<T>(() => {
		try {
			const value = localStorage.getItem(key);
			return value ? (JSON.parse(value) as T) : initialValue;
		} catch (error) {
			return initialValue;
		}
	});

	const setLocalStorageState = (value: T) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			setState(value);
		} catch (error) {
			console.error(error);
		}
	};

	return [state, setLocalStorageState] as const;
};
