"use client";

import Image from "next/image";
import { useEffect, useState, type FC } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, Sparkle, Users } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { authClient } from "@/lib/auth-client";
import { slugify } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { client } from "@/lib/client";

interface ICreateOrgFormProps extends React.ComponentProps<"form"> {}

const formSchema = z.object({
	name: z.string(),
	slug: z.string(),
	logo: z.string(),
});

const COLORS = ["#f43f5e", "#34d399", "#a3e635", "#38bdf8", "#6366f1", "#a855f7"];
const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

export const CreateOrgForm: FC<ICreateOrgFormProps> = ({ className, ...props }) => {
	const router = useRouter();

	const [logoPreview, setLogoPreview] = useState<string | null>(null);
	const [autoSlug, setAutoSlug] = useState(true);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			slug: "",
			logo: "",
		},
	});

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const watchName = form.watch("name", "");
	const watchSlug = form.watch("slug", "");

	useEffect(() => {
		if (autoSlug && watchName) {
			form.setValue("slug", slugify(watchName));
		}
	}, [watchName, autoSlug, form]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const res = await client.api.orgs.$post({
				form: {
					...values,
				},
			});
			const data = await res.json();
			await authClient.organization.setActive({
				organizationSlug: values.slug,
			});

			toast.success("Organization created");
			router.refresh();
			router.push(`/orgs/${data.slug}`);
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		}
	}

	return (
		<div className="grid w-full grid-cols-1 md:grid-cols-[1fr_1.5fr]">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn("w-full max-w-lg divide-y divide-border border-border border-r border-b", className)}
					{...props}
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="px-8 py-6">
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input type="" placeholder="My Organization" {...field} />
								</FormControl>
								<FormDescription>Name of your organization</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem className="px-8 py-6">
								<FormLabel>Slug</FormLabel>
								<FormControl className="flex items-stretch">
									<div>
										<div className="flex items-center border border-border border-r-0 bg-muted px-4 py-2 text-muted-foreground text-sm">
											staash.app/
										</div>
										<Input
											type=""
											placeholder="my-organization"
											{...field}
											onChange={(e) => {
												setAutoSlug(false);
												field.onChange(e);
											}}
										/>
									</div>
								</FormControl>
								<FormDescription>URL slug of your organization</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="logo"
						render={({ field }) => (
							<FormItem className="px-8 py-6">
								<FormLabel>Logo</FormLabel>
								<FormControl>
									<Input type="file" accept="image/*" {...field} onChange={handleLogoChange} />
								</FormControl>
								<FormDescription>Upload a logo for your organization</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="px-8 py-6">
						<Button type="submit" className="w-full">
							Create Organization
						</Button>
					</div>
				</form>
			</Form>
			<div className="flex items-center justify-center">
				<div className="w-full max-w-md border border-border bg-background p-4">
					<div className="flex items-start gap-4">
						<div className="relative h-12 w-12 overflow-hidden border border-border">
							{logoPreview ? (
								<Image src={logoPreview || "/placeholder.svg"} alt="Organization logo" layout="fill" objectFit="cover" />
							) : (
								<div
									className="flex h-full w-full items-center justify-center"
									style={{
										backgroundColor: `${randomColor}50`,
									}}
								>
									<Sparkle className="h-6 w-6 text-muted-foreground" style={{ color: randomColor }} />
								</div>
							)}
						</div>
						<div className="flex-1 space-y-1">
							<h3 className="font-medium">{watchName || "My Organization"}</h3>
							<p className="text-muted-foreground text-sm">staash.app/{watchSlug || "my-organization"}</p>
						</div>
					</div>

					<div className="mt-6 border-t pt-6">
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<Users className="h-4 w-4" />
							<span>0 members</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
