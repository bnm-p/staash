"use client";

import { useEffect, useState, type FC } from "react";

interface IRelativeTimeProps {
	date: Date | string;
	locale?: string;
}

export const RelativeTime: FC<IRelativeTimeProps> = ({ date, locale = "en" }) => {
	const [content, setContent] = useState("");

	useEffect(() => {
		const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

		const update = () => {
			const d = typeof date === "string" ? new Date(date) : date;

			const now = Date.now();
			const target = d.getTime();
			const diffInSeconds = (target - now) / 1000;

			let value: number;
			let unit: Intl.RelativeTimeFormatUnit;

			const abs = Math.abs(diffInSeconds);

			if (abs < 60) {
				value = Math.round(diffInSeconds);
				unit = "second";
			} else if (abs < 3600) {
				value = Math.round(diffInSeconds / 60);
				unit = "minute";
			} else if (abs < 86400) {
				value = Math.round(diffInSeconds / 3600);
				unit = "hour";
			} else {
				value = Math.round(diffInSeconds / 86400);
				unit = "day";
			}

			setContent(rtf.format(value, unit));
		};

		update();
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	}, [date, locale]);

	return <span>{content}</span>;
};
