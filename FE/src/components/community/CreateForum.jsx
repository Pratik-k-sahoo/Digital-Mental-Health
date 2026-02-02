import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { addPost } from "@/lib/apiServices";
import useAppMutation from "@/hooks/useAppMutation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "sonner";

const CreateForum = ({ categories }) => {
	const { user } = useSelector((state) => state.auth);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);

	const form = useForm({
		defaultValues: {
			title: "",
			category: "",
			content: "",
			isAnonymous: true,
			displayName: "",
		},
	});

	const { reset } = form;

	const isAnonymous = useWatch({
		control: form.control,
		name: "isAnonymous",
	});

	const { mutate: createForum, isPending } = useAppMutation({
		mutationFn: addPost,
		invalidateQueries: ["forumPost", user?._id],
		onSuccess: () => {
			toast.success("Discussion started 🚀");
		},
		onError: () => {
			toast.error("Some error occurred.", {
				description: "Please try again after sometimes.⌚",
			});
		},
	});

	const handleCreateForum = async (formData) => {
		await createForum(formData);
	};

	useEffect(() => {
		if (isPending) return;
		reset();
		setCreateDialogOpen(false);
	}, [isPending, reset]);

	return (
		<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
			<DialogTrigger className="flex items-center rounded-3xl border px-3 py-2 bg-primary text-muted gap-2 font-bold cursor-pointer mx-auto">
				<Plus className="h-4 w-4" />
				Start a Discussion
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Start a Discussion</DialogTitle>
					<DialogDescription>
						Share your thoughts, ask questions, or seek support from the
						community.
					</DialogDescription>
					<form
						id="create-forum"
						onSubmit={form.handleSubmit(handleCreateForum)}
						className="flex flex-col gap-4 items-center"
					>
						<FieldGroup>
							<Controller
								name="title"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel className="text-lg" htmlFor="title">
											Title:{" "}
										</FieldLabel>
										<Input
											{...field}
											className="w-full"
											id="title"
											type="text"
											aria-invalid={fieldState.invalid}
											placeholder="What's on your mind?"
										/>
									</Field>
								)}
							/>
							<Controller
								name="category"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel className="text-lg" htmlFor="title">
											Category:{" "}
										</FieldLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="h-full w-48 capitalize">
												<SelectValue placeholder="Select Category" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{categories.slice(1).map((item) => (
														<SelectItem
															key={item}
															value={item}
															className="capitalize"
														>
															{item}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</Field>
								)}
							/>
							<Controller
								name="content"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel className="text-lg" htmlFor="content">
											Content:{" "}
										</FieldLabel>
										<Textarea
											{...field}
											className="w-full min-h-[120px]"
											id="content"
											type="text"
											aria-invalid={fieldState.invalid}
											placeholder="Share more details..."
										/>
									</Field>
								)}
							/>
							<Controller
								name="isAnonymous"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<div className="flex items-center justify-between">
											<div>
												<FieldLabel className="text-lg" htmlFor="isAnonymous">
													Post anonymously:{" "}
												</FieldLabel>
												<p className="text-sm text-muted-foreground">
													Your identity will be hidden from other users
												</p>
											</div>
											<Switch
												{...field}
												checked={field.value}
												onCheckedChange={field.onChange}
												id="isAnonymous"
											/>
										</div>
									</Field>
								)}
							/>
							{!isAnonymous && (
								<Controller
									name="displayName"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel className="text-lg" htmlFor="displayName">
												Display Name:{" "}
											</FieldLabel>
											<Input
												{...field}
												className="w-full"
												id="displayName"
												type="text"
												aria-invalid={fieldState.invalid}
												placeholder="How should we call you?"
											/>
										</Field>
									)}
								/>
							)}
						</FieldGroup>
						<div className="flex items-end gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setCreateDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin mr-2" />
										Posting...
									</>
								) : (
									"Post Discussion"
								)}
							</Button>
						</div>
					</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default CreateForum;
