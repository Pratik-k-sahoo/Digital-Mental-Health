import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "motion/react";
import { Eye, Flag, EyeOff, Lock } from "lucide-react";
import useGetQuery from "@/hooks/useGetQuery";
import { getPosts } from "@/lib/apiServices";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Loader2 } from "lucide-react";
import { ClosedCaption } from "lucide-react";
import { Rss } from "lucide-react";
import React from "react";
import { useState } from "react";
import AnonymizationToggle from "../AnonymizationToggle";
import { Textarea } from "@/components/ui/textarea";
import { useMemo } from "react";
import useAnonymization from "@/hooks/useAnonymization";
import SwitchStatus from "./SwitchStatus";
import ForumTable from "./ForumTable";

const ForumPosts = () => {
	const [searchQuery, setSearchQuery] = useState("");


	const {
		data: posts,
		isLoading,
		isError,
		error,
	} = useGetQuery({
		queryKey: ["posts"],
		queryFn: getPosts,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const filteredPosts = useMemo(() => {
		if (isLoading) return;
		return posts.rows.filter(
			(post) =>
				post.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
				post.content.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
				post.category
					.toLowerCase()
					.includes(searchQuery.trim().toLowerCase()) ||
				post.User.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
		);
	}, [posts, isLoading, searchQuery]);
	return (
		<div>
			<CardHeader>
				<div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Rss className="h-5 w-5" />
							Posts
						</CardTitle>
						<CardDescription>View and manage posts</CardDescription>
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
					{posts?.count} posts
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
								<TableHead>Content</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Author Name</TableHead>
								<TableHead>Created On</TableHead>
								<TableHead>Is Locked?</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{posts.count === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center py-8 text-muted-foreground"
									>
										No post reported
									</TableCell>
								</TableRow>
							) : (
								filteredPosts?.map((post) => <ForumTable post={post} />)
							)}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
};

export default ForumPosts;
