"use client";

import { type FC, useEffect, useState } from "react";
import { CreateSpaceModal } from "../modals/create-space-modal";

const ModalProvider: FC = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<>
			<CreateSpaceModal />
		</>
	);
};

export default ModalProvider;
