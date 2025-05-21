export const slugify = (text: string): string => {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\w-]+/g, "") // Remove all non-word chars
		.replace(/--+/g, "-") // Replace multiple - with single -
		.replace(/^-+/, "") // Trim - from start of text
		.replace(/-+$/, ""); // Trim - from end of text
};

export const relativeTime = (date: Date) => {
	const rtf1 = new Intl.RelativeTimeFormat("en", { style: "short" });
	const rtf2 = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

	const diff = date.getTime() - Date.now();
	const diffInDays = Math.round(diff / (1000 * 60 * 60 * 24));

	return diffInDays < -1 ? rtf1.format(diffInDays, "day") : rtf2.format(diffInDays, "day");
};
