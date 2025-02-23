import { create } from "zustand";
import type { Space, Organization } from "@prisma/client";

export type ModalType = "create-space";

interface ModalData {
	org?: Partial<Organization>;
	space?: Space;
	apiUrl?: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	query?: Record<string, any>;
}

interface ModalStore {
	type: ModalType | null;
	data: ModalData;
	isOpen: boolean;
	onOpen: (type: ModalType, data?: ModalData) => void;
	onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
	onClose: () => set({ type: null, isOpen: false }),
}));
