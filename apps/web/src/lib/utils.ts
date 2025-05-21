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

// Tremor focusInput [v0.0.2]

export const focusInput = [
	// base
	"focus:ring-2",
	// ring color
	"focus:ring-blue-200 dark:focus:ring-blue-700/30",
	// border color
	"focus:border-blue-500 dark:focus:border-blue-700",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
	// base
	"outline outline-offset-2 outline-0 focus-visible:outline-2",
	// outline color
	"outline-blue-500 dark:outline-blue-500",
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
	// base
	"ring-2",
	// border color
	"border-red-500 dark:border-red-700",
	// ring color
	"ring-red-200 dark:ring-red-700/30",
];
