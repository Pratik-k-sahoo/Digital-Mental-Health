import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import useGetQuery from "@/hooks/useGetQuery";
import {
	getAllReportedComments,
	getAllReportedPosts,
	reviewCommentReport,
	reviewReport,
} from "@/lib/apiServices";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Edit } from "lucide-react";
import { Trash2 } from "lucide-react";
import { ClosedCaption } from "lucide-react";
import { Search } from "lucide-react";
import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import ReviewPost from "./ReviewPost";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Calendar } from "lucide-react";
import AnonymizationToggle from "../AnonymizationToggle";
import { OctagonAlert } from "lucide-react";
import { Check } from "lucide-react";
import useAppMutation from "@/hooks/useAppMutation";

const ReportedComments = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const {
		data: reportedComments,
		isLoading,
		isError,
		error,
	} = useGetQuery({
		queryKey: ["flagComment"],
		queryFn: getAllReportedComments,
	});

	const expandCommentByBatch = (comments) => {
		const rows = [];

		comments.forEach((comment) => {
			const batchMap = {};

			comment.Flags.forEach((flag) => {
				if (!batchMap[flag.reviewBatch]) {
					batchMap[flag.reviewBatch] = [];
				}
				batchMap[flag.reviewBatch].push(flag);
			});

			Object.entries(batchMap).forEach(([batch, flags]) => {
				const hasPending = flags.some((f) => f.status === "pending");

				rows.push({
					comment,
					reviewBatch: Number(batch),
					flags,
					isActiveBatch:
						Number(batch) === comment.currentReviewBatch && hasPending,
					isResolvedBatch:
						Number(batch) !== comment.currentReviewBatch || !hasPending,
				});
			});
		});

		return rows;
	};

	const expandedRows = useMemo(() => {
		if (isLoading || !reportedComments) return [];

		const expanded = expandCommentByBatch(reportedComments);

		return expanded.filter(({ comment }) =>
			comment.content.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [reportedComments, searchQuery, isLoading]);

	const { mutate: reportReview } = useAppMutation({
		mutationFn: reviewCommentReport,
		invalidateQueries: {
			queryKey: ["flagComment"],
		},
	});

	const handleReviewReportedPost = async (id) => {
		await reportReview(id);
	};

	return (
		<div>
			<CardHeader>
				<div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<OctagonAlert className="h-5 w-5" />
							Reported Posts
						</CardTitle>
						<CardDescription>View and manage reported posts</CardDescription>
					</div>
					<AnonymizationToggle />
				</div>
			</CardHeader>
			<div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
				<div className="relative flex-1 max-w-sm order-2 md:order-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search reported posts..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Badge variant="secondary" className="order-1 md:order-2">
					{reportedComments?.length} reported posts
				</Badge>
			</div>
			{isLoading ? (
				<div className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin text-primary" />
				</div>
			) : (
				<div className="rounded-md border">
					<Table>
						<TableHeader className="font-bold text-base">
							<TableRow className="hidden sm:table-row">
								<TableHead>Comment</TableHead>
								<TableHead>Post Title</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Created</TableHead>
								<TableHead className="w-[100px]">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{expandedRows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center py-8 text-muted-foreground"
									>
										No post reported
									</TableCell>
								</TableRow>
							) : (
								expandedRows?.map((comment) => (
									<TableRow
										key={`${comment.comment.id}-${comment.reviewBatch}`}
										className={comment.isActiveBatch ? "" : "bg-primary/10"}
									>
										<TableCell className="font-medium sm:hidden">
											<div className="space-y-1.5">
												<div className="flex items-center justify-between">
													{format(
														new Date(comment.comment?.createdAt),
														"MMM d, yyyy",
													)}
													{comment.isActiveBatch ? (
														<div className="flex items-center gap-1">
															<ReviewPost data={comment.comment} />
															<Button
																variant="ghost"
																size="icon"
																// onClick={() => handleDelete(resource.id)}
																className="hover:bg-primary/10 font-bold"
															>
																<Check className="h-4 w-4 text-primary" />
															</Button>
														</div>
													) : (
														<span className="text-muted-foreground text-sm">
															Reviewed
														</span>
													)}
												</div>
												<div className="text-wrap flex gap-3">
													<ClosedCaption />
													{comment.comment.content}
												</div>
												<div className="flex gap-2 justify-between">
													<Badge variant="outline">
														{comment.comment.ForumPost.title}
													</Badge>
													<Badge
														variant={
															comment.comment.status === "visible"
																? "default"
																: comment.comment?.status === "flagged"
																	? "destructive"
																	: "secondary"
														}
													>
														{comment.comment.status === "visible"
															? "Visible"
															: comment.comment.status === "flagged"
																? "Flagged"
																: "Hidden"}
													</Badge>
												</div>
											</div>
										</TableCell>
										<TableCell className="font-medium hidden sm:table-cell">
											{comment.comment.content}
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											<Badge variant="outline">
												{comment.comment.ForumPost.title}
											</Badge>
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											<Badge
												variant={
													comment.comment.status === "visible"
														? "default"
														: comment.comment?.status === "flagged"
															? "destructive"
															: "secondary"
												}
											>
												{comment.comment.status === "visible"
													? "Visible"
													: comment.comment.status === "flagged"
														? "Flagged"
														: "Hidden"}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground hidden sm:table-cell">
											{format(
												new Date(comment.comment?.createdAt),
												"MMM d, yyyy",
											)}
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											{comment.isActiveBatch ? (
												<div className="flex items-center gap-1">
													<ReviewPost data={comment.comment} />
													<Button
														variant="ghost"
														size="icon"
														onClick={() =>
															handleReviewReportedPost(comment.comment.id)
														}
														className="hover:bg-primary/10 font-bold"
													>
														<Check className="h-6 w-6 text-primary" />
													</Button>
												</div>
											) : (
												<span className="text-muted-foreground text-sm">
													Reviewed
												</span>
											)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
};

export default ReportedComments;
