"use client";

import autoAnimate from "@formkit/auto-animate";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Eye, EyeOff, FileText, MoreVertical, PenLine, Plus, Search, Trash2 } from "lucide-react";
import { type ComponentProps, type FC, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface EnvironmentVariable {
	id: string;
	key: string;
	value: string;
	environments: string[];
	isVisible: boolean;
	dateAdded: string;
}

interface IVariableManagerProps extends ComponentProps<"div"> {}

export const VariableManager: FC<IVariableManagerProps> = ({ className, ...props }) => {
	const [variables, setVariables] = useState<EnvironmentVariable[]>([]);
	const [newVariables, setNewVariables] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("Last Updated");

	const fileInputRef = useRef<HTMLInputElement>(null);

	const isValidEnvFile = (content: string) => {
		const lines = content.split(/\r?\n/);
		for (const line of lines) {
			const trimmedLine = line.trim();
			if (!trimmedLine || trimmedLine.startsWith("#")) continue;

			if (!trimmedLine.includes("=") && !trimmedLine.includes(":")) {
				return false;
			}
		}
		return true;
	};

	const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				// check if file is .env
				if (!file.name.endsWith(".env")) {
					toast.error("Please upload a .env file");
					return;
				}

				//check if env valid
				if (!isValidEnvFile(event.target?.result as string)) {
					toast.error("Please upload a valid .env file");
					return;
				}

				const content = event.target?.result as string;
				if (!content) return;

				const pairs: { key: string; value: string }[] = [];
				const lines = content.split(/\r?\n/);

				for (const line of lines) {
					const trimmedLine = line.trim();
					if (!trimmedLine || trimmedLine.startsWith("#")) continue;

					let key, value;

					if (trimmedLine.includes("=")) {
						[key, ...value] = trimmedLine.split("=");
						value = value.join("=");
					} else if (trimmedLine.includes(":")) {
						[key, ...value] = trimmedLine.split(":");
						value = value.join(":");
					}

					if (key && value !== undefined) {
						key = key.trim();
						value = value.trim().replace(/^['\"]|['\"]$/g, "");

						pairs.push({ key, value });
					}
				}

				if (pairs.length > 0) {
					setNewVariables((prevVariables) => {
						if (prevVariables[0].key === "" && prevVariables[0].value === "") {
							return pairs;
						}
						return [...prevVariables, ...pairs];
					});
				}

				// Reset the file input
				e.target.value = "";
			};

			reader.readAsText(file);
		}
	};

	const triggerFileImport = () => {
		fileInputRef.current?.click();
	};

	const handleKeyPaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
		const pastedText = e.clipboardData.getData("text");

		if (pastedText.includes("=") || pastedText.includes(":")) {
			e.preventDefault();

			const pairs: { key: string; value: string }[] = [];
			const lines = pastedText.split(/\r?\n/);

			for (const line of lines) {
				const trimmedLine = line.trim();
				if (!trimmedLine || trimmedLine.startsWith("#")) continue;

				let key;
				let value;

				if (trimmedLine.includes("=")) {
					[key, ...value] = trimmedLine.split("=");
					value = value.join("=");
				} else if (trimmedLine.includes(":")) {
					[key, ...value] = trimmedLine.split(":");
					value = value.join(":");
				}

				if (key && value !== undefined) {
					key = key.trim();
					value = value.trim().replace(/^['"]|['"]$/g, "");

					pairs.push({ key, value });
				}
			}

			if (pairs.length > 0) {
				const updatedVariables = [...newVariables];
				updatedVariables[index] = pairs[0];

				if (pairs.length > 1) {
					updatedVariables.push(...pairs.slice(1));
				}

				setNewVariables(updatedVariables);
			}
		}
	};

	const handleAddVariable = () => {
		setNewVariables([...newVariables, { key: "", value: "" }]);
	};

	const handleRemoveVariable = (index: number) => {
		const updatedVariables = [...newVariables];
		updatedVariables.splice(index, 1);
		setNewVariables(updatedVariables);
	};

	const handleInputChange = (index: number, field: "key" | "value", value: string) => {
		const updatedVariables = [...newVariables];
		updatedVariables[index][field] = value;
		setNewVariables(updatedVariables);
	};

	const handleSave = () => {
		// Filter out empty variables
		const validVariables = newVariables.filter((v) => v.key.trim() !== "");

		if (validVariables.length === 0) return;

		// Add the new variables to the list
		const newEnvVars = validVariables.map((v) => ({
			id: Math.random().toString(36).substring(2, 9),
			key: v.key,
			value: v.value,
			environments: ["All Environments"],
			isVisible: false,
			dateAdded: new Date().toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			}),
		}));

		setVariables([...newEnvVars, ...variables]);

		// Reset the form
		setNewVariables([{ key: "", value: "" }]);
	};

	const toggleVariableVisibility = (id: string) => {
		setVariables(variables.map((v) => (v.id === id ? { ...v, isVisible: !v.isVisible } : v)));
	};

	const deleteVariable = (id: string) => {
		setVariables(variables.filter((v) => v.id !== id));
	};

	// Filter variables based on search query
	const filteredVariables = variables.filter((v) => v.key.toLowerCase().includes(searchQuery.toLowerCase()));

	return (
		<div className="space-y-6">
			<div>
				{variables.length > 0 ? (
					<Card>
						<CardContent className="p-6">
							<div className="mb-4 flex items-center justify-between">
								<div className="relative w-full max-w-sm">
									<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search..."
										className="pl-8"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
								<div className="flex items-center gap-2">
									<Select value={sortBy} onValueChange={setSortBy}>
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Last Updated" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Last Updated">Last Updated</SelectItem>
											<SelectItem value="Name">Name</SelectItem>
											<SelectItem value="Recently Added">Recently Added</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								{filteredVariables.map((variable) => (
									<div key={variable.id} className="flex items-center justify-between rounded-md border p-4">
										<div className="flex items-center space-x-4">
											<div className="rounded bg-muted p-1 font-mono text-sm">
												<code>{variable.key}</code>
											</div>
											<div className="text-muted-foreground text-sm">{variable.environments.join(", ")}</div>
										</div>
										<div className="flex items-center space-x-2">
											<Button variant="ghost" size="icon" onClick={() => toggleVariableVisibility(variable.id)}>
												{variable.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
											</Button>
											{variable.isVisible ? (
												<div className="max-w-xs truncate rounded bg-gray-100 p-1 font-mono dark:bg-gray-800">
													<code>{variable.value || "••••••••••••"}</code>
												</div>
											) : (
												<>
													<div className="text-muted-foreground text-sm">Added {variable.dateAdded}</div>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon">
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem onClick={() => deleteVariable(variable.id)}>Delete</DropdownMenuItem>
															<DropdownMenuItem>Edit</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</>
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="flex flex-col items-center justify-center p-12 text-center">
							<div className="mb-4 rounded-full bg-muted p-6">
								<FileText className="h-10 w-10 text-gray-400" />
							</div>
							<h3 className="mb-2 font-medium text-lg">No environment variables</h3>
							<p className="mb-6 max-w-md text-muted-foreground text-sm">
								Environment variables are key-value pairs that can be used to configure your application. Add your first
								environment variable above.
							</p>
						</CardContent>
					</Card>
				)}
			</div>
			<Card className="h-fit">
				<CardContent className="p-6">
					<div className="space-y-6">
						<div className="space-y-4">
							<div className="grid grid-cols-[1fr_1fr_80px] gap-x-2">
								<h3 className="mb-2 font-medium text-sm">Key</h3>
								<h3 className="mb-2 font-medium text-sm">Value</h3>
							</div>

							<div className="space-y-4">
								{newVariables.map((variable, index) => (
									<div key={`item-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-x-2">
										<Input
											placeholder="e.g. CLIENT_KEY"
											className="font-mono"
											value={variable.key}
											onChange={(e) => handleInputChange(index, "key", e.target.value)}
											onPaste={(e) => handleKeyPaste(e, index)}
										/>
										<Input
											placeholder="Value"
											className="font-mono"
											value={variable.value}
											onChange={(e) => handleInputChange(index, "value", e.target.value)}
										/>
										<div className="flex items-center gap-x-2">
											<Button
												variant="outline"
												className="size-9"
												onClick={() => handleRemoveVariable(index)}
												disabled={newVariables.length === 1 && index === 0}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
											<Button
												variant="outline"
												className="size-9"
												onClick={() => {
													const updatedVariables = [...newVariables];
													updatedVariables[index].value = "";
													setNewVariables(updatedVariables);
												}}
											>
												<PenLine className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</div>

							<Button variant="outline" onClick={handleAddVariable} className="flex items-center">
								<Plus className="mr-1 h-4 w-4" /> Add Another
							</Button>
							<input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileImport} />
						</div>

						<div className="mt-8 flex items-center justify-between">
							<Button variant="outline" className="flex items-center" onClick={triggerFileImport}>
								<FileText className="mr-2 h-4 w-4" />
								Import .env
							</Button>
							<span className="text-muted-foreground text-sm">or paste the .env contents above</span>
							<Button onClick={handleSave}>Save</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
