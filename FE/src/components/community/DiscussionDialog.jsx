import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import useGetQuery from "@/hooks/useGetQuery";
import {
	addBookmark,
	addComment,
	addLike,
	getPostsWithComments,
} from "@/lib/apiServices";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Flag } from "lucide-react";
import EditDialog from "./EditDialog";
import ReportDialog from "./ReportDialog";
import { ScrollArea } from "../ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { ThumbsUp } from "lucide-react";
import { BookmarkCheck } from "lucide-react";
import { Bookmark } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Send } from "lucide-react";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useAppMutation from "@/hooks/useAppMutation";
import { useRef } from "react";
import { useEffect } from "react";
import socket from "@/lib/socket";
import FlagComment from "./FlagComment";
import { Lock } from "lucide-react";
import { toast } from "sonner";
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

const DiscussionDialog = ({ discussion }) => {
	const { user } = useSelector((state) => state.auth);
	const [discussionDialogOpen, setDiscussionDialogOpen] = useState(false);
	const [id, setId] = useState("");
	const [newComment, setNewComment] = useState("");
	const [isAnonymous, setIsAnonymous] = useState(true);
	const [displayName, setDisplayName] = useState("");
	const btnRef = useRef(null);
	const typingTimeout = useRef(null);
	const [localComments, setLocalComments] = useState([]);
	const [typingUsers, setTypingUsers] = useState([]);
	const [postState, setPostState] = useState({
		likes: discussion.likes,
		liked: discussion.liked,
		bookmarked: discussion.bookmarked,
	});
	const [likePulse, setLikePulse] = useState("");

	const { data: posts, isFetching } = useGetQuery({
		queryKey: ["discussion", id],
		queryFn: () => getPostsWithComments({ id }),
		keepPreviousData: true,
	});

	const { mutate: createComment, isPending: isCommentPending } = useAppMutation(
		{
			mutationFn: addComment,
		},
	);

	const { mutate: dropLike, isPending: isLikePending } = useAppMutation({
		mutationFn: addLike,
	});

	const { mutate: bookmark, isPending: isBookmarkPending } = useAppMutation({
		mutationFn: addBookmark,
    onSuccess: () => {
      toast.success("Saved for quick reference🏃‍➡️")
    },
    onError: () => {
      toast.error("Some error occurred.", {
        description: "Please try again after sometimes⌚"
      })
    }
	});

	const isOwner = useMemo(() => {
		return user.id === posts?.post?.authorId;
	}, [user?.id, posts?.post?.authorId]);

	const handleCreateComment = async (e) => {
		e.preventDefault();
		createComment({
			credentials: {
				content: newComment,
				isAnonymous,
				displayName: !isAnonymous ? displayName : "",
			},
			id,
		});
		setNewComment("");
		setDisplayName("");
		setIsAnonymous(true);
	};

	const handleLikePost = async () => {
		if (isLikePending) return;

		await dropLike({ id });
	};

	const handleBookmarkPost = async () => {
		if (isBookmarkPending) return;

		await bookmark({ id });
	};

	useEffect(() => {
		if (posts?.post?.ForumComments) {
			setLocalComments([...posts.post.ForumComments].reverse());
		}
	}, [posts?.post?.ForumComments]);

	useEffect(() => {
		if (!discussionDialogOpen || !id || !user) return;

		socket.emit(EVENTS.JOIN_POST, id);

		return () => {
			socket.emit(EVENTS.TYPING_STOP, { postId: id });
			socket.off(EVENTS.NEW_COMMENT);
			socket.off(EVENTS.POST_LIKED);
			socket.off(EVENTS.TYPING_START);
			socket.off(EVENTS.TYPING_STOP);
		};
	}, [discussionDialogOpen, id, user]);

	useEffect(() => {
		if (!discussionDialogOpen) return;

		socket.on(EVENTS.NEW_COMMENT, ({ comment }) => {
			setLocalComments((prev) => [comment, ...prev]);
		});

		socket.on(EVENTS.BOOKMARK_TOGGLED, ({ postId, userId, bookmarked }) => {
			if (postId != id) return;
			setPostState((prev) => ({
				...prev,
				bookmarked: userId === user.id ? bookmarked : prev.bookmarked,
			}));
		});

		return () => {
			socket.off(EVENTS.NEW_COMMENT);
			socket.off(EVENTS.BOOKMARK_TOGGLED);
		};
	}, [discussionDialogOpen, id, user.id]);

	useEffect(() => {
		socket.on(EVENTS.POST_LIKED, ({ postId, likes, userId, liked }) => {
			if (postId != id) return;
			setLikePulse("animate-ping");
			setPostState((prev) => ({
				...prev,
				likes,
				liked: userId === user.id ? liked : prev.liked,
			}));
			setTimeout(() => setLikePulse(""), 300);
		});

		return () => {
			socket.off(EVENTS.POST_LIKED);
		};
	}, [id, user.id]);

	useEffect(() => {
		if (!discussionDialogOpen || !btnRef.current) return;

		btnRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
	}, [localComments.length, discussionDialogOpen]);

	useEffect(() => {
		socket.on(EVENTS.TYPING_START, ({ userId, name }) => {
			setTypingUsers((prev) =>
				prev.some((u) => u.userId === userId)
					? prev
					: [...prev, { userId, name }],
			);
		});

		socket.on(EVENTS.TYPING_STOP, ({ userId }) => {
			setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
		});

		return () => {
			socket.off(EVENTS.TYPING_START);
			socket.off(EVENTS.TYPING_STOP);
		};
	}, []);

	return (
		<>
			<Card
				variant="resource"
				className="cursor-pointer group"
				onClick={() => {
					setId(discussion?.id);
					setDiscussionDialogOpen(true);
				}}
			>
				<CardContent className="">
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<span className="text-xs px-2 py-1 rounded-full bg-sage-light text-sage-dark font-medium">
									{discussion?.category}
								</span>
								<span className="text-xs text-muted-foreground">
									{formatDistanceToNow(new Date(discussion?.createdAt), {
										addSuffix: true,
									})}
								</span>
							</div>
							<h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1 text-start">
								{discussion.title}
							</h3>
							<p className="text-sm text-muted-foreground text-start">
								Posted by {discussion.displayName || "Anonymous Student"}
							</p>
						</div>
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<MessageSquare className="h-4 w-4" />
								<span>{localComments.length}</span>
							</div>
							<div
								className={`flex items-center gap-1 ${postState?.liked ? "text-primary" : ""}`}
							>
								<ThumbsUp className="h-4 w-4" />
								<span>{postState.likes}</span>
							</div>
							{user && (
								<div
									title={postState?.bookmarked ? "Remove bookmark" : "Bookmark"}
								>
									{postState?.bookmarked ? (
										<BookmarkCheck className="h-4 w-4 text-primary" />
									) : (
										<Bookmark className="h-4 w-4" />
									)}
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			<Dialog
				open={discussionDialogOpen}
				onOpenChange={setDiscussionDialogOpen}
			>
				<DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
					<DialogHeader>
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<span className="text-xs px-2 py-1 rounded-full bg-sage-light text-sage-dark font-medium">
									{posts?.post?.category}
								</span>
								<span className="text-xs text-muted-foreground">
									{formatDistanceToNow(new Date(discussion.updatedAt), {
										addSuffix: true,
									})}
								</span>
							</div>
							<div className="flex items-center gap-1">
								{isOwner && (
									<EditDialog
										setId={setId}
										userId={user.id}
										post={posts?.post}
									/>
								)}
								{user && !isOwner && (
									<ReportDialog userId={user.id} post={posts?.post} />
								)}
							</div>
						</div>
						<DialogTitle>{posts?.post?.title}</DialogTitle>
						<DialogDescription>
							Posted by {posts?.post?.displayName || "Anonymous Student"}
						</DialogDescription>
					</DialogHeader>
					<div className="py-4 border-b">
						<p className="text-foreground whitespace-pre-wrap">
							{posts?.post?.content}
						</p>
						<div className="flex items-center gap-4 mt-4">
							<Button
								variant={postState?.liked ? "default" : "outline"}
								size="sm"
								onClick={() => handleLikePost(id)}
								className={`gap-2 ${likePulse}`}
							>
								<ThumbsUp className="h-4 w-4" />
								{postState.likes} {postState?.likes === 1 ? "Like" : "Likes"}
							</Button>
							<div className="flex items-center gap-1 text-sm text-muted-foreground">
								<MessageSquare className="h-4 w-4" />
								<span>
									{localComments.length}{" "}
									{localComments.length === 1 ? "Comment" : "Comments"}
								</span>
							</div>
							{user && (
								<Button
									variant={postState?.bookmarked ? "ghost" : "outline"}
									size="sm"
									className={`h-8 w-8 p-2 ${postState.bookmarked && "bg-primary rounded-full"}`}
									onClick={() => handleBookmarkPost(id)}
									title={postState?.bookmarked ? "Remove bookmark" : "Bookmark"}
								>
									{postState?.bookmarked ? (
										<BookmarkCheck className="h-4 w-4 text-primary-foreground " />
									) : (
										<Bookmark className="h-4 w-4" />
									)}
								</Button>
							)}
						</div>
					</div>

					<ScrollArea className="flex-1 min-h-0 max-h-[300px] overflow-auto">
						<div className="space-y-4 py-4">
							<div ref={btnRef} />
							{isFetching ? (
								<div className="flex justify-center py-8">
									<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
								</div>
							) : localComments.length === 0 ? (
								<p className="text-center text-muted-foreground py-8">
									No comments yet. Be the first to share your thoughts!
								</p>
							) : (
								localComments.map((comment) => (
									<div
										key={comment.id}
										className="p-4 rounded-lg bg-muted/50 group"
									>
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2">
												<span className="font-medium text-sm">
													{comment.displayName || "Anonymous Student"}
												</span>
												<span className="text-xs text-muted-foreground">
													about{" "}
													{formatDistanceToNow(new Date(comment.createdAt), {
														addSuffix: true,
													})}
												</span>
											</div>
											<div className="flex items-center gap-1 transition-opacity">
												{user && user.id !== comment.authorId && (
													<FlagComment comment={comment} userId={user.id} />
												)}
												{user?.id === comment.authorId && (
													<Button
														variant="ghost"
														className="hover:bg-destructive text-destructive hover:text-destructive-foreground"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												)}
											</div>
										</div>
										<p className="text-sm text-foreground">{comment.content}</p>
									</div>
								))
							)}
						</div>
					</ScrollArea>

					{user && (
						<div className={`${discussion?.isLocked && "relative"}`}>
							<div className="flex gap-2 p-2 pt-4 border-t">
								<div className="flex flex-col gap-4  w-full">
									{!isAnonymous && (
										<Input
											placeholder="What we can say you?"
											value={displayName}
											onChange={(e) => setDisplayName(e.target.value)}
										/>
									)}
									{typingUsers.length > 0 && (
										<p className="text-xs text-muted-foreground italic">
											{typingUsers.length === 1
												? `${typingUsers[0].name} is typing…`
												: `${typingUsers.length} people are typing…`}
										</p>
									)}
									<Textarea
										placeholder="Write a supportive comment..."
										value={newComment}
										onChange={(e) => {
											setNewComment(e.target.value);
											socket.emit(EVENTS.TYPING_START, { postId: id });
											clearTimeout(typingTimeout.current);
											typingTimeout.current = setTimeout(() => {
												socket.emit(EVENTS.TYPING_STOP, { postId: id });
											}, 800);
										}}
										className="min-h-20 resize-none"
									/>
								</div>
								<div className="flex flex-col justify-end items-start gap-2 w-2/6">
									<Label htmlFor="isAnonymous">
										By: {isAnonymous ? "Anonymous" : `${displayName}`}
									</Label>
									<div className="flex items-end gap-2">
										<Switch
											id="isAnonymous"
											checked={isAnonymous}
											onCheckedChange={setIsAnonymous}
										/>
										<Button
											onClick={handleCreateComment}
											disabled={isCommentPending || !newComment.trim()}
											className="self-end"
										>
											{isCommentPending ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<Send className="h-4 w-4" />
											)}
										</Button>
									</div>
								</div>
							</div>
							{discussion?.isLocked && (
								<div className="flex top-0 gap-2 absolute w-full backdrop:blur-3xl bg-transparent h-full items-center z-10 backdrop-blur-xs rounded-2xl">
									<Lock />
									<span>
										This thread is locked and cannot recieve new comments
									</span>
								</div>
							)}
						</div>
					)}

					{!user && (
						<p className="text-center text-sm text-muted-foreground py-4 border-t">
							Please sign in to join the conversation
						</p>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DiscussionDialog;
