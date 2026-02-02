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
} from "@/lib/apiServices";
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
import ReportedPostTabContent from "./ReportedPostTabContent";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { CheckCircle } from "lucide-react";
import ReportedCommentTabContent from "./ReportedCommentTabContent";

const ReportedComments = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("pending");
	const {
		data: reportedComments,
		isLoading,
	} = useGetQuery({
		queryKey: ["flagComment"],
		queryFn: getAllReportedComments,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
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

	const pendingRows = useMemo(() => {
		if (isLoading || !reportedComments) return [];
		return expandedRows.filter((comment) => comment.isActiveBatch);
	}, [isLoading, reportedComments, expandedRows]);

	const resolvedRows = useMemo(() => {
		if (isLoading || !reportedComments) return [];
		return expandedRows.filter((comment) => !comment.isActiveBatch);
	}, [isLoading, reportedComments, expandedRows]);

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
				<ReportedCommentTabContent
					value={"pending"}
					reports={pendingRows}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					isLoading={isLoading}
				/>
				<ReportedCommentTabContent
					value={"resolved"}
					reports={resolvedRows}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					isLoading={isLoading}
				/>
				<ReportedCommentTabContent
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

export default ReportedComments;
