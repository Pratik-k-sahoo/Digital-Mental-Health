import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useGetQuery from "@/hooks/useGetQuery";
import { getAllReportedPosts, reviewReport } from "@/lib/apiServices";
import { format, formatDistanceToNow } from "date-fns";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import ReportedPostTabContent from "./ReportedPostTabContent";
import { CheckCircle } from "lucide-react";

const ReportedPosts = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("pending");
	const {
		data: reportedPosts,
		isLoading,
		isError,
		error,
	} = useGetQuery({
		queryKey: ["flagPost"],
		queryFn: getAllReportedPosts,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const expandPostsByBatch = (posts) => {
		const rows = [];

		posts.forEach((post) => {
			const batchMap = {};

			post.Flags.forEach((flag) => {
				if (!batchMap[flag.reviewBatch]) {
					batchMap[flag.reviewBatch] = [];
				}
				batchMap[flag.reviewBatch].push(flag);
			});

			Object.entries(batchMap).forEach(([batch, flags]) => {
				const hasPending = flags.some((f) => f.status === "pending");

				rows.push({
					post,
					reviewBatch: Number(batch),
					flags,
					isActiveBatch:
						Number(batch) === post.currentReviewBatch && hasPending,
					isResolvedBatch:
						Number(batch) !== post.currentReviewBatch || !hasPending,
				});
			});
		});

		return rows;
	};

	const expandedRows = useMemo(() => {
		if (isLoading || !reportedPosts) return [];

		const expanded = expandPostsByBatch(reportedPosts);

		return expanded.filter(
			({ post }) =>
				post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.content.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [reportedPosts, searchQuery, isLoading]);

	const pendingRows = useMemo(() => {
		if (isLoading || !reportedPosts) return [];
		return expandedRows.filter((post) => post.isActiveBatch);
	}, [isLoading, reportedPosts, expandedRows]);

	const resolvedRows = useMemo(() => {
		if (isLoading || !reportedPosts) return [];
		return expandedRows.filter((post) => !post.isActiveBatch);
	}, [isLoading, reportedPosts, expandedRows]);

	const pendingCount = expandedRows.filter((r) => r.isActiveBatch).length;
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Reported Content</h2>
					<p className="text-muted-foreground">
						Review and manage flagged discussions
					</p>
				</div>
				{pendingCount > 0 && (
					<Badge variant="destructive" className="text-sm">
						{pendingCount} pending
					</Badge>
				)}
			</div>

			<Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
				<TabsList>
					<TabsTrigger value="pending" className="gap-2">
						<AlertTriangle className="h-4 w-4" />
						Pending
					</TabsTrigger>
					<TabsTrigger value="resolved" className="gap-2">
						<CheckCircle className="h-4 w-4" />
						Resolved
					</TabsTrigger>
					<TabsTrigger value="all">All</TabsTrigger>
				</TabsList>
				<ReportedPostTabContent
					value={"pending"}
					reports={pendingRows}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					isLoading={isLoading}
				/>
				<ReportedPostTabContent
					value={"resolved"}
					reports={resolvedRows}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					isLoading={isLoading}
				/>
				<ReportedPostTabContent
					value={"all"}
					reports={expandedRows}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					isLoading={isLoading}
				/>
			</Tabs>
		</div>
	);
};

export default ReportedPosts;
