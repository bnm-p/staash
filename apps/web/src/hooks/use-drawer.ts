import { create } from "zustand";
import type { Space, Organization } from "@prisma/client";

export type DrawerType = "edit-space";

interface DrawerData {
	org?: Partial<Organization>;
	space?: Partial<Space>;
	apiUrl?: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	query?: Record<string, any>;
}

interface DrawerStore {
	type: DrawerType | null;
	data: DrawerData;
	isOpen: boolean;
	onOpen: (type: DrawerType, data?: DrawerData) => void;
	onClose: () => void;
}

export const useDrawer = create<DrawerStore>((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
	onClose: () => set({ type: null, isOpen: false }),
}));
