import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import useAppMutation from "@/hooks/useAppMutation";
import { reviewReport } from "@/lib/apiServices";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Search } from "lucide-react";
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ClosedCaption } from "lucide-react";
import ReviewPost from "./ReviewPost";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

const ReportedPostTabContent = ({
	value,
	reports,
	searchQuery,
	setSearchQuery,
	isLoading,
}) => {
	const { mutate: reportReview } = useAppMutation({
		mutationFn: reviewReport,
		invalidateQueries: {
			queryKey: ["flagPost"],
		},
	});

	const handleReviewReportedPost = async (id) => {
		toast.promise(reportReview(id), {
			loading: "Updating reported discussion as reviewed...",
			success: `Reviewed the discussion`,
			error: "Failed to review the discussion ❌",
			position: "bottom-center",
		});
	};
  
	return (
		<TabsContent value={value}>
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
					{reports?.length} reported posts
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
								<TableHead>Title</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Created</TableHead>
								<TableHead className="w-[100px]">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{reports.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center py-8 text-muted-foreground"
									>
										No post reported
									</TableCell>
								</TableRow>
							) : (
								reports?.map((post) => (
									<TableRow
										key={`${post.post.id}-${post.reviewBatch}`}
										className={post.isActiveBatch ? "" : "bg-primary/10"}
									>
										<TableCell className="font-medium sm:hidden">
											<div className="space-y-1.5">
												<div className="flex items-center justify-between">
													{format(
														new Date(post.post?.createdAt),
														"MMM d, yyyy",
													)}
													{post.isActiveBatch ? (
														<div className="flex items-center gap-1">
															<ReviewPost data={post.post} />
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
													{post.post.title}
												</div>
												<div className="flex gap-2 justify-between">
													<Badge variant="outline">{post.post.category}</Badge>
													<Badge
														variant={
															post.post.status === "visible"
																? "default"
																: post.post?.status === "flagged"
																	? "destructive"
																	: "secondary"
														}
													>
														{post.post.status === "visible"
															? "Visible"
															: post.post.status === "flagged"
																? "Flagged"
																: "Hidden"}
													</Badge>
												</div>
											</div>
										</TableCell>
										<TableCell className="font-medium hidden sm:table-cell">
											{post.post.title}
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											<Badge variant="outline">{post.post.category}</Badge>
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											<Badge
												variant={
													post.post.status === "visible"
														? "default"
														: post.post?.status === "flagged"
															? "destructive"
															: "secondary"
												}
											>
												{post.post.status === "visible"
													? "Visible"
													: post.post.status === "flagged"
														? "Flagged"
														: "Hidden"}
											</Badge>
										</TableCell>
										<TableCell className="text-muted-foreground hidden sm:table-cell">
											{format(new Date(post.post?.createdAt), "MMM d, yyyy")}
										</TableCell>
										<TableCell className="hidden sm:table-cell">
											{post.isActiveBatch ? (
												<div className="flex items-center gap-1">
													<ReviewPost data={post.post} />
													<Button
														variant="ghost"
														size="icon"
														onClick={() =>
															handleReviewReportedPost(post.post.id)
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
		</TabsContent>
	);
};

export default ReportedPostTabContent;
