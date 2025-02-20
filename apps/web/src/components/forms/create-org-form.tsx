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

	const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

	const watchName = form.watch("name", "");
	const watchSlug = form.watch("slug", "");

	useEffect(() => {
		if (autoSlug && watchName) {
			form.setValue("slug", slugify(watchName));
		}
	}, [watchName, autoSlug, form]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const res = await client.api.org.$post({
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
			router.push(`/${data.slug}`);
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		}
	}

	return (
		<div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<div>
					<h1 className="text-2xl font-semibold">Create Organization</h1>
					<p className="text-muted-foreground">Set up your new organization in seconds</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8 w-full py-10", className)} {...props}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input type="" className="max-w-md" placeholder="My Organization" {...field} />
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
								<FormItem>
									<FormLabel>Slug</FormLabel>
									<FormControl className="flex items-stretch">
										<div className="max-w-md">
											<div className="px-4 py-2 bg-muted border border-r-0 border-border text-muted-foreground text-sm flex items-center">
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
								<FormItem>
									<FormLabel>Logo</FormLabel>
									<FormControl>
										<Input type="file" accept="image/*" {...field} className="max-w-md" onChange={handleLogoChange} />
									</FormControl>
									<FormDescription>Upload a logo for your organization</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full max-w-md">
							Create Organization
						</Button>
					</form>
				</Form>
			</div>
			<div className="flex justify-center items-center">
				<div className="border border-border bg-background p-4 max-w-md w-full">
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
							<p className="text-sm text-muted-foreground">staash.app/{watchSlug || "my-organization"}</p>
						</div>
					</div>

					<div className="mt-6 border-t pt-6">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Users className="h-4 w-4" />
							<span>0 members</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
