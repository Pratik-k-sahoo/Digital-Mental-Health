import useAppMutation from "@/hooks/useAppMutation";
import useGetQuery from "@/hooks/useGetQuery";
import {
	createResource as createResourceApi,
	deleteResource as deleteResourceApi,
	fetchAllResources,
	updateResource as updateResourceApi,
} from "@/lib/apiServices";
import React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { FileText } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Loader2 } from "lucide-react";
import { Search } from "lucide-react";
import { Badge } from "../ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Switch } from "../ui/switch";

const TYPES = ["Article", "Video", "Audio"];

const CATEGORY = [
	{ value: "stress", name: "Stress" },
	{ value: "anxiety", name: "Anxiety" },
	{ value: "sleep", name: "Sleep" },
	{ value: "exam_pressure", name: "Exam Pressure" },
	{ value: "relationship", name: "Relationship" },
];

const AdminResourcesTab = () => {
	const {
		data: resources,
		isLoading,
		isError,
		error,
	} = useGetQuery({
		queryKey: ["adminDashboard", "resources"],
		queryFn: fetchAllResources,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const [searchQuery, setSearchQuery] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingResource, setEditingResource] = useState(null);
	const form = useForm({
		mode: "onChange",
		defaultValues: {
			title: "",
			category: "stress",
			type: "article",
			description: "",
			url: "",
			language: "",
			isActive: false,
			tags: "",
		},
	});

	const {
		mutate: updateResource,
		isError: isUpdateResourceError,
		error: updateResourceError,
	} = useAppMutation({
		mutationFn: updateResourceApi,
		invalidateQueries: {
			queryKey: ["adminDashboard", "resources"],
		},
	});

	const {
		mutate: createResource,
		isError: isCreateResourceError,
		error: createResourceError,
	} = useAppMutation({
		mutationFn: createResourceApi,
		invalidateQueries: {
			queryKey: ["adminDashboard", "resources"],
		},
	});

	const {
		mutate: deleteResource,
		isError: isDeleteResourceError,
		error: deleteResourceError,
	} = useAppMutation({
		mutationFn: deleteResourceApi,
		invalidateQueries: {
			queryKey: ["adminDashboard", "resources"],
		},
	});

	const handleSubmit = async (e) => {
		try {
			if (editingResource) {
				updateResource({
					id: editingResource.id,
					credentials: {
						...e,
						title: e.title ?? editingResource?.title,
						category:
							e.category.toLowerCase() ??
							editingResource?.category?.toLowerCase(),
						type: e.type.toLowerCase() ?? editingResource?.type?.toLowerCase(),
						description: e.description ?? editingResource?.description,
						url: e.url ?? editingResource?.url,
						language: e.language ?? editingResource?.language,
						tags: e.tags ?? editingResource?.tags,
						isActive: e.isActive ?? editingResource?.isActive,
					},
				});
			} else {
				createResource({
					...e,
					title: e.title,
					category: e.category.toLowerCase(),
					type: e.type.toLowerCase(),
					description: e.description,
					url: e.url,
					language: e.language,
					tags: e.tags,
					isActive: e.isActive,
				});
			}

			setIsDialogOpen(false);
			form.reset({
				title: "",
				category: "stress",
				type: "article",
				description: "",
				url: "",
				language: "",
				isActive: false,
				tags: "",
			});
			setEditingResource(null);
		} catch (error) {
			console.error("Error in resource:", error);
			toast({ title: "Error in resource", variant: "destructive" });
		}
	};

	const openEditDialog = (resource) => {
		setEditingResource(resource);
		form.reset({
			title: resource.title,
			category: resource.category,
			type: resource.type,
			description: resource.description,
			url: resource.url,
			language: resource.language,
			tags: resource.tags,
			isActive: resource.isActive,
		});
		setIsDialogOpen(true);
	};

	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this resource?")) return;
		await deleteResource({ id });
	};

	const filteredResources = resources?.filter(
		(resource) =>
			resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			resource.category.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Content Management
						</CardTitle>
						<CardDescription>
							Manage resources and educational content
						</CardDescription>
					</div>
					<Dialog
						open={isDialogOpen}
						onOpenChange={(open) => {
							setIsDialogOpen(open);
							if (!open) {
								setEditingResource(null);
								form.reset({
									title: "",
									category: "stress",
									type: "article",
									description: "",
									url: "",
									language: "",
									isActive: false,
									tags: "",
								});
							}
						}}
					>
						<DialogTrigger asChild>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Add Resource
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
							<DialogHeader>
								<DialogTitle>
									{editingResource ? "Edit Resource" : "Add New Resource"}
								</DialogTitle>
								<DialogDescription>
									Fill in the details for the resource.
								</DialogDescription>
							</DialogHeader>

							<form
								id="resource-form"
								onSubmit={form.handleSubmit(handleSubmit)}
							>
								<FieldGroup>
									<div className="space-y-4 py-4">
										<Controller
											name="title"
											control={form.control}
											render={({ field, fieldState }) => (
												<Field
													data-invalid={fieldState.invalid}
													className="space-y-2"
												>
													<FieldLabel className="text-lg" htmlFor="title">
														Title (English)*
													</FieldLabel>
													<Input
														{...field}
														id="title"
														type="text"
														aria-invalid={fieldState.invalid}
														placeholder="Resource title"
													/>
												</Field>
											)}
										/>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<Controller
												name="category"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field
														data-invalid={fieldState.invalid}
														className="space-y-2"
													>
														<FieldLabel className="text-lg" htmlFor="category">
															Category*
														</FieldLabel>
														<Select
															id="category"
															{...field}
															aria-invalid={fieldState.invalid}
															defaultValue="stress"
															onValueChange={(e) => {
																form.setValue("category", e);
															}}
														>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																{CATEGORY?.map((cat) => (
																	<SelectItem
																		key={cat?.value}
																		value={cat?.value}
																	>
																		{cat?.name}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</Field>
												)}
											/>
											<Controller
												name="type"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field
														data-invalid={fieldState.invalid}
														className="space-y-2"
													>
														<FieldLabel className="text-lg" htmlFor="type">
															Type*
														</FieldLabel>
														<Select
															id="type"
															{...field}
															aria-invalid={fieldState.invalid}
															defaultValue="article"
															onValueChange={(e) => {
																form.setValue("type", e);
															}}
														>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																{TYPES?.map((type) => (
																	<SelectItem
																		key={type}
																		value={type?.toLowerCase()}
																	>
																		{type}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</Field>
												)}
											/>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<Controller
												name="description"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field
														data-invalid={fieldState.invalid}
														className="space-y-2 md:col-span-2"
													>
														<FieldLabel
															className="text-lg"
															htmlFor="description"
														>
															Description (English)*
														</FieldLabel>
														<Input
															{...field}
															id="description"
															type="text"
															aria-invalid={fieldState.invalid}
															placeholder="Resource description"
														/>
													</Field>
												)}
											/>
											<Controller
												name="language"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field
														data-invalid={fieldState.invalid}
														className="space-y-2"
													>
														<FieldLabel className="text-lg" htmlFor="language">
															Language
														</FieldLabel>
														<Input
															{...field}
															id="language"
															type="text"
															aria-invalid={fieldState.invalid}
															placeholder="en/hi/od language"
														/>
													</Field>
												)}
											/>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<Controller
												name="url"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field
														data-invalid={fieldState.invalid}
														className="space-y-2"
													>
														<FieldLabel className="text-lg" htmlFor="url">
															External URL
														</FieldLabel>
														<Input
															{...field}
															id="url"
															type="text"
															aria-invalid={fieldState.invalid}
															placeholder="https://..."
														/>
													</Field>
												)}
											/>

											<Controller
												name="tags"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field
														data-invalid={fieldState.invalid}
														className="space-y-2"
													>
														<FieldLabel className="text-lg" htmlFor="tags">
															Tags
														</FieldLabel>
														<Input
															{...field}
															id="tags"
															type="text"
															aria-invalid={fieldState.invalid}
															placeholder="Tags for the resource"
														/>
													</Field>
												)}
											/>
										</div>

										<Controller
											name="isActive"
											control={form.control}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<div className="flex items-center space-x-2">
														<Switch
															id="isActive"
															checked={!!field.value}
															onCheckedChange={field.onChange}
															aria-invalid={fieldState.invalid}
															className="shrink-0"
														/>
														<FieldLabel className="text-lg" htmlFor="isActive">
															Publish (Make this resource visible to students)
														</FieldLabel>
													</div>
												</Field>
											)}
										/>
									</div>
								</FieldGroup>
								<DialogFooter>
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setIsDialogOpen(false);
											setEditingResource(null);
											form.reset({
												title: "",
												category: "stress",
												type: "article",
												description: "",
												url: "",
												language: "",
												isActive: false,
												tags: "",
											});
										}}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={
											!form.formState.isValid || form.formState.isSubmitting
										}
									>
										{editingResource ? "Update" : "Create"}
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-4 mb-6">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search resources..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Badge variant="secondary">{resources?.length} resources</Badge>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-primary" />
					</div>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Created</TableHead>
									<TableHead className="w-[100px]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredResources.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center py-8 text-muted-foreground"
										>
											No resources found
										</TableCell>
									</TableRow>
								) : (
									filteredResources?.map((resource) => (
										<TableRow key={resource.id}>
											<TableCell className="font-medium">
												{resource.title}
											</TableCell>
											<TableCell>
												<Badge variant="outline">{resource.category}</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant={resource.isActive ? "default" : "secondary"}
												>
													{resource.isActive ? "Published" : "Draft"}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{format(new Date(resource?.createdAt), "MMM d, yyyy")}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => openEditDialog(resource)}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDelete(resource.id)}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default AdminResourcesTab;
