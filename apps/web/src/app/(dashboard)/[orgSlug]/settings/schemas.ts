"use client";

import { z } from "zod";

export const orgSettings_name = z.object({
	name: z.string().min(1, "Name is required"),
});

export const orgSettings_slug = z.object({
	slug: z.string().min(1, "Slug is required"),
});
