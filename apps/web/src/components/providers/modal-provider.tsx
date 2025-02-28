"use client";

import { type FC, useEffect, useState } from "react";
import { CreateSpaceModal } from "../modals/create-space-modal";
import { CreateOrgModal } from "../modals/create-org-modal";
import { useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { DeleteOrgModal } from "../modals/delete-org-modal";

const ModalProvider: FC = () => {
	const [isMounted, setIsMounted] = useState(false);
	const searchParams = useSearchParams();

	useEffect(() => setIsMounted(true), []);

	useEffect(() => {
		if (searchParams.get("modalOpen") === "create-org") {
			useModal.getState().onOpen("create-org");
		}

		window.history.replaceState({}, "", window.location.href.split("?")[0]);
	}, [searchParams]);

	if (!isMounted) return null;

	return (
		<>
			<CreateSpaceModal />
			<CreateOrgModal />
			<DeleteOrgModal />
		</>
	);
};

export default ModalProvider;
