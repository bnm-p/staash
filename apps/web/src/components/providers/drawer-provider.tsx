"use client";

import { type FC, useEffect, useState } from "react";
import { EditSpaceDrawer } from "../drawers/edit-space-drawer";

const DrawerProvider: FC = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => setIsMounted(true), []);

	if (!isMounted) return null;

	return (
		<>
			<EditSpaceDrawer />
		</>
	);
};

export default DrawerProvider;
