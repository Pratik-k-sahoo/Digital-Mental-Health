import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Users,
	MessageSquare,
	Heart,
	Shield,
	Plus,
	ThumbsUp,
} from "lucide-react";
import useGetQuery from "@/hooks/useGetQuery";
import { getAllPosts, getPeerApplication } from "@/lib/apiServices";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import CreateForum from "@/components/community/CreateForum";
import DiscussionDialog from "@/components/community/DiscussionDialog";
import socket from "@/lib/socket";
import PeerApplication from "@/components/community/PeerApplication";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const EVENTS = {
	JOIN_POST: "join-post",
	NEW_COMMENT: "new-comment",
	POST_LIKED: "post_liked",
	BOOKMARK_TOGGLED: "bookmark_toggled",
	SOCKET_ERROR: "socket-error",
	TYPING_STOP: "typing_stop",
	TYPING_START: "typing_start",
	FLAG_POST: "flag_post",
	FLAG_COMMENT: "flag_comment",
};

const categories = [
	"All Topics",
	"Academic Stress",
	"Emotional Support",
	"Sleep & Wellness",
	"Social Connection",
	"Self-Care",
	"Saved",
];

const Community = () => {
	const { user } = useSelector((state) => state.auth);
	const [selectedCat, setSelectedCat] = useState("All Topics");
	const [selectedDiscussion, setSelectedDiscussion] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);
	const {
		data: peerApplication,
		isLoading,
		isError,
		error,
	} = useGetQuery({
		queryKey: ["peer-application"],
		queryFn: () => getPeerApplication(),
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const {
		data: posts,
		isFetching,
		refetch,
	} = useGetQuery({
		queryKey: ["forumPost", page],
		queryFn: () => getAllPosts({ page, limit: 10 }),
		keepPreviousData: true,
	});

	const forumPosts = useMemo(() => {
		let filteredPosts = posts?.posts || [];
		if (selectedCat !== "All Topics")
			filteredPosts = posts?.posts?.filter((post) =>
				selectedCat === "Saved"
					? post.bookmarked
					: post.category === selectedCat,
			);

		if (searchQuery) {
			filteredPosts = filteredPosts.filter(
				(post) =>
					post.title.includes(searchQuery) ||
					post.content.includes(searchQuery) ||
					post.category.includes(searchQuery),
			);
		}
		return filteredPosts;
	}, [posts, selectedCat, searchQuery]);

	useEffect(() => {
		socket.on(EVENTS.FLAG_COMMENT, ({ isFlagged }) => {
			if (isFlagged) refetch({ page, limit: 10 });
		});

		return () => {
			socket.off(EVENTS.POST_LIKED);
		};
	}, [page, refetch]);

	return (
		<Layout>
			<div className="container py-12 md:py-16">
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light border border-sage/20 text-sm font-medium mb-4">
						<Users className="h-4 w-4 text-primary" />
						<span>Peer Support Community</span>
					</div>
					<h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Connect with Peers
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						A safe, moderated space where students support each other. Share
						your experiences, ask questions, and find connection.
					</p>
				</div>

				<Card className="mb-8 bg-sky-light border-sky/20">
					<CardContent className="py-4">
						<div className="flex flex-col md:flex-row items-start md:items-center gap-4">
							<div className="flex items-center gap-2">
								<Shield className="h-5 w-5 text-sky" />
								<span className="font-medium text-foreground">
									Community Guidelines:
								</span>
							</div>
							<p className="text-sm text-muted-foreground">
								Be respectful • Keep it supportive • Maintain anonymity • Report
								concerns
							</p>
						</div>
					</CardContent>
				</Card>

				<div className="grid lg:grid-cols-4 gap-8">
					<div className="lg:col-span-1 space-y-6">
						<Card variant="feature">
							<CardHeader>
								<CardTitle className="text-lg">Categories</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 hidden md:block">
								{categories.map((category) => (
									<Button
										key={category}
										variant={selectedCat === category ? "calm" : "ghost"}
										className="w-full justify-start gap-2"
										size="sm"
										onClick={() => setSelectedCat(category)}
									>
										{category === "Saved" && <Bookmark className="h-4 w-4" />}
										{category}
									</Button>
								))}
							</CardContent>
						</Card>

						<Card
							variant="feature"
							className="bg-lavender-light border-lavender/20"
						>
							<CardHeader>
								<CardTitle className="text-lg">
									Become a Peer Volunteer
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="mb-4">
									Trained student volunteers help moderate discussions and
									provide peer support.
								</CardDescription>
								{!user ? (
									<p className="text-sm text-muted-foreground">
										Sign in to apply
									</p>
								) : user?.role === "peer_volunteer" ? (
									<div className="flex items-center gap-2 text-sm text-primary">
										<CheckCircle className="h-4 w-4" />
										<span>You're a peer supporter!</span>
									</div>
								) : peerApplication?.isDraft ? (
									<PeerApplication
										data={peerApplication}
										title="Resume Application"
									/>
								) : peerApplication?.status && peerApplication ? (
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Badge
												variant={
													peerApplication?.status === "approved"
														? "default"
														: peerApplication?.status === "rejected"
															? "destructive"
															: "secondary"
												}
											>
												{peerApplication?.status === "submitted" && (
													<Clock className="h-3 w-3 mr-1" />
												)}
												{peerApplication?.status?.charAt(0).toUpperCase() +
													peerApplication?.status?.slice(1)}
											</Badge>
										</div>
										<p className="text-xs text-muted-foreground">
											Applied{" "}
											{formatDistanceToNow(
												new Date(peerApplication?.updatedAt),
												{
													addSuffix: true,
												},
											)}
										</p>
									</div>
								) : (
									<PeerApplication data={peerApplication} title="Apply Now" />
								)}
							</CardContent>
						</Card>
					</div>

					<div className="lg:col-span-3 space-y-4">
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="flex-1">
								<Input
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search discussions by title, content, or category..."
								/>
							</div>
							<CreateForum categories={categories} />
						</div>

						<div className="space-y-4">
							{isFetching ? (
								<div className="flex justify-center py-12">
									<Loader2 className="h-8 w-8 animate-spin text-primary" />
								</div>
							) : forumPosts.length === 0 ? (
								<Card>
									<CardContent className="py-12 text-center">
										<MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
										<h3 className="text-lg font-medium text-foreground mb-2">
											{searchQuery
												? "No discussions found"
												: "No discussions yet"}
										</h3>
										<p className="text-muted-foreground mb-4">
											{searchQuery
												? "Try adjusting your search terms or browse all topics."
												: "Be the first to start a conversation in this community!"}
										</p>
										{!searchQuery && user && (
											<CreateForum categories={categories} />
										)}
										{searchQuery && (
											<Button
												variant="outline"
												onClick={() => setSearchQuery("")}
											>
												Clear Search
											</Button>
										)}
									</CardContent>
								</Card>
							) : (
								<div className="flex flex-col space-y-5">
									{forumPosts.map((discussion) => (
										<DiscussionDialog discussion={discussion} />
									))}
								</div>
							)}

							{!searchQuery && (
								<div className="flex justify-center pt-4 space-x-3">
									{Array.from({ length: posts?.pages }).map((_, i) => (
										<Button
											key={i}
											variant={page === i + 1 ? "default" : "outline"}
											onClick={() => setPage(i + 1)}
											disabled={isFetching}
										>
											{i + 1}
										</Button>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Community;
