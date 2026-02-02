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
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import useAnonymization from "@/hooks/useAnonymization";
import useAppMutation from "@/hooks/useAppMutation";
import { reviewComment, reviewPost } from "@/lib/apiServices";
import { toast } from "sonner";

const STATUS = ["Visible", "Flagged", "Hidden"];
const ISLOCKEDARRAY = ["Lock", "Unlock"];

const ReviewPost = ({ data }) => {
	const { anonymizeName } = useAnonymization();
	const [openSheet, setOpenSheet] = useState(false);
	const form = useForm({
		defaultValues: {
			status: data?.status || "",
			isLocked: data?.isLocked?.toString() || "false",
		},
	});

	const { reset } = form;

	const status = useWatch({
		control: form.control,
		name: "status",
	});

	const { mutate: postReview } = useAppMutation({
		mutationFn: reviewPost,
		invalidateQueries: {
			queryKey: ["flagPost"],
		},
	});

	const { mutate: commentReview } = useAppMutation({
		mutationFn: reviewComment,
		invalidateQueries: {
			queryKey: ["flagComment"],
		},
	});

	const handleReviewPost = async (formData) => {
		toast.promise(
			postReview({
				credentials: {
					status: formData.status,
					isLocked:
						formData.status === "visible"
							? formData.isLocked === "true"
								? true
								: false
							: true,
				},
				id: data.id,
			}),
			{
				loading: "Updating reported discussion status...",
				success: `Updated the discussion status`,
				error: "Failed to update discussion status ❌",
				position: "bottom-center",
			},
		);
		setOpenSheet(false);
		reset();
	};

	const handleReviewComment = async (formData) => {
    toast.promise(
			commentReview({
				credentials: {
					status: formData.status,
				},
				id: data.id,
			}),
			{
				loading: "Updating reported comment status...",
				success: `Updated the comment status`,
				error: "Failed to update comment status ❌",
				position: "bottom-center",
			},
		);
		setOpenSheet(false);
		reset();
	};

	return (
		<Sheet open={openSheet} onOpenChange={setOpenSheet}>
			<SheetTrigger className="hover:bg-accent p-2 rounded-2xl cursor-pointer hover:text-accent-foreground">
				<Edit />
			</SheetTrigger>
			<SheetContent className="min-w-xl p-4">
				<SheetHeader>
					<SheetTitle>Review the reports for the post</SheetTitle>
					<SheetDescription>
						Thoroughly review the reports for better environment
					</SheetDescription>
				</SheetHeader>
				<div className="container">
					<ScrollArea className="h-44 rounded-md border p-4">
						<div className="bg-primary/30 p-3 rounded-xl">
							<div className="space-y-2 grid grid-cols-2">
								<h3 className="font-bold underline col-span-2">
									{data?.ForumPost ? "Comment" : "Post"} Details
								</h3>

								<p>
									<strong className="text-accent">Title:</strong>{" "}
									{data?.title || data?.ForumPost?.title}
								</p>

								<p>
									<strong className="text-accent">Content:</strong>{" "}
									{data?.content}
								</p>
								{!data?.ForumPost ? (
									<p>
										<strong className="text-accent">Category:</strong>{" "}
										{data?.category}
									</p>
								) : (
									<p>
										<strong className="text-accent">Post By:</strong>{" "}
										{anonymizeName(data?.ForumPost?.User?.name)}
									</p>
								)}
								<p>
									<strong className="text-accent">Status:</strong>{" "}
									<Badge
										variant={
											data?.status === "visible"
												? "default"
												: data?.status === "flagged"
													? "destructive"
													: "secondary"
										}
									>
										{data?.status === "visible"
											? "Visible"
											: data?.status === "flagged"
												? "Flagged"
												: "Hidden"}
									</Badge>
								</p>
							</div>
						</div>

						<div className="bg-primary/30 p-3 rounded-xl mt-6">
							<div className="space-y-2">
								<h3 className="font-bold underline">Author</h3>
								<p>
									<strong>Name:</strong>{" "}
									{data?.displayName || anonymizeName(data?.User?.name)}
								</p>
								<p>
									<strong>Anonymous:</strong> {data?.isAnonymous ? "Yes" : "No"}
								</p>
							</div>
						</div>
					</ScrollArea>

					<h3 className="font-bold underline mt-6">
						Flag Reports ({data?.Flags.length})
					</h3>
					<div className="bg-primary/30 p-3 rounded-xl mt-3">
						<div className="space-y-4">
							<ScrollArea className="max-h-52 overflow-y-auto rounded-md p-4">
								{data?.Flags.map((flag) => (
									<div
										key={flag.id}
										className="border rounded-lg p-3 space-y-1 mt-3"
									>
										<p>
											<strong>Reason:</strong> {flag.reason}
										</p>
										<p>
											<strong>Flagged By:</strong>{" "}
											{anonymizeName(flag.User?.name)} ({flag.User?.role})
										</p>
										<p className="text-xs text-muted-foreground">
											{new Date(flag.createdAt).toLocaleString()}
										</p>
									</div>
								))}
							</ScrollArea>
						</div>
					</div>
				</div>

				<SheetFooter className="flex gap-2 pl-8 pr-8">
					<form
						id="create-forum"
						onSubmit={form.handleSubmit(
							data?.ForumPost ? handleReviewComment : handleReviewPost,
						)}
						className="grid grid-cols-2 gap-4 items-center"
					>
						<Controller
							name="status"
							className={`${data?.ForumPost ? "col-span-2" : "col-span-1"}`}
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									className={`${data?.ForumPost ? "col-span-2" : "col-span-1"}`}
								>
									<FieldLabel className="text-lg -mt-6" htmlFor="status">
										Status:
									</FieldLabel>
									<Select
										id="status"
										{...field}
										aria-invalid={fieldState.invalid}
										defaultValues={data?.status}
										onValueChange={(e) => {
											form.setValue("status", e);
										}}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Post Status" />
										</SelectTrigger>
										<SelectContent>
											{STATUS.map((s) => (
												<SelectItem value={s.toLowerCase()}>{s}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}
						/>
						{!data?.ForumPost && (
							<Controller
								name="isLocked"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel className="text-lg -mt-6" htmlFor="isLocked">
											Is Locked?:
										</FieldLabel>
										<Select
											id="isLocked"
											{...field}
											aria-invalid={fieldState.invalid}
											onValueChange={(e) => {
												form.setValue("isLocked", e);
											}}
											disabled={status === "flagged" || status === "hidden"}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Is Post Locked?" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="true">true</SelectItem>
												<SelectItem value="false">false</SelectItem>
											</SelectContent>
										</Select>
									</Field>
								)}
							/>
						)}

						<Button>Submit</Button>
						<SheetClose>
							<Button className="w-full" onClick={reset}>
								Cancel
							</Button>
						</SheetClose>
					</form>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};

export default ReviewPost;
