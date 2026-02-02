import React from "react";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Flag } from "lucide-react";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import useAppMutation from "@/hooks/useAppMutation";
import { editPost } from "@/lib/apiServices";
import { Edit2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { toast } from "sonner";

const categories = [
	"All Topics",
	"Academic Stress",
	"Emotional Support",
	"Sleep & Wellness",
	"Social Connection",
	"Self-Care",
	"Saved",
];

const EditDialog = ({ post, userId }) => {
	const [editOpen, setEditOpen] = useState(false);

	const form = useForm({
		defaultValues: {
			title: post?.title,
			category: post?.category,
			content: post?.content,
			isAnonymous: post?.isAnonymous || true,
			displayName: post?.displayName || "",
			authorId: post?.authorId || "",
		},
	});

	const { reset } = form;

	const isAnonymous = useWatch({
		control: form.control,
		name: "isAnonymous",
	});

	const { mutate: postEdit, isPostEditPending } = useAppMutation({
		mutationFn: editPost,
		invalidateQueries: ["discussion", post.id],
		onSuccess: () => {
			toast.success("Discussion edited");
		},
		onError: () => {
			toast.error("Something went wrong", {
				description: "Please try again later⌚",
			});
		},
	});

	const handleEditPost = async (formData) => {
		await postEdit({ credentials: formData, id: post.id });
	};

	useEffect(() => {
		if (isPostEditPending) return;
		reset();
		setEditOpen(false);
	}, [isPostEditPending, reset]);

	return (
		<Sheet open={editOpen} onOpenChange={setEditOpen}>
			<SheetTrigger>
				<Button
					variant="ghost"
					className="hover:bg-destructive text-destructive hover:text-destructive-foreground"
				>
					<Edit2 className="h-4 w-4" />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit Post</SheetTitle>
					<SheetDescription>
						Edit the post and help the community grow in good direction
					</SheetDescription>
				</SheetHeader>
				<div className="grid flex-1 auto-rows-min gap-6 px-4">
					<form
						id="create-forum"
						onSubmit={form.handleSubmit(handleEditPost)}
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
						<SheetFooter>
							<Button type="submit" disabled={isPostEditPending}>
								Report
							</Button>
							<SheetClose asChild>
								<Button
									type="button"
									disabled={isPostEditPending}
									variant="outline"
								>
									Close
								</Button>
							</SheetClose>
						</SheetFooter>
					</form>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default EditDialog;
