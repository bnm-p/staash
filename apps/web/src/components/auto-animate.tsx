"use client";

import { useEffect, useRef, type ComponentProps, type FC } from "react";
import { Slot } from "@radix-ui/react-slot";
import autoAnimate from "@formkit/auto-animate";

interface IAutoAnimateProps extends ComponentProps<"div"> {
	asChild?: boolean;
}

export const AutoAnimate: FC<IAutoAnimateProps> = ({ children, asChild, ...props }) => {
	const ref = useRef<HTMLDivElement>(null);
	const Comp = asChild ? Slot : "div";

	// biome-ignore lint/correctness/useExhaustiveDependencies: ref dependency is necessary for auto-animate
	useEffect(() => {
		ref.current && autoAnimate(ref.current);
	}, [ref]);

	return (
		<Comp {...props} ref={ref}>
			{children}
		</Comp>
	);
};
