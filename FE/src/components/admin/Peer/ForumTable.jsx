import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import useAnonymization from "@/hooks/useAnonymization";
import { format } from "date-fns";
import { Lock } from "lucide-react";
import { ClosedCaption } from "lucide-react";
import React from "react";
import { useState } from "react";
import SwitchStatus from "./SwitchStatus";
import { togglePostLock, updatePostStatus } from "@/lib/apiServices";
import useAppMutation from "@/hooks/useAppMutation";
import { toast } from "sonner";
import { sleep } from "@/lib/utils";

const ForumTable = ({ post }) => {
	const [status, setStatus] = useState(post.status);
	const [isLocked, setIsLocked] = useState(post.isLocked);
	const { anonymizeName } = useAnonymization();
	const { mutateAsync: postStatusUpdate, isPending: postStatusPending } =
		useAppMutation({
			mutationFn: updatePostStatus,
			invalidateQueries: {
				queryKey: ["posts"],
			},
		});

	const handleStatusChange = async (nextStatus) => {
		if (postStatusPending) return;
		if (nextStatus === "hidden") {
			const confirmed = window.confirm(
				"Are you sure you want to hide this post? This will remove it from public view.",
			);
			if (!confirmed) return;

			setIsLocked(true);
		}

		if (nextStatus === "flagged") {
			setIsLocked(true);
		}

		if (nextStatus === "visible") {
			setIsLocked(post?.isLocked);
		}

		setStatus(nextStatus);
		toast.promise(
			(async () => {
				const res = await postStatusUpdate({
					credentials: {
						status: nextStatus,
					},
					id: post.id,
				});
				await sleep(1500);

				return res;
			})(),
			{
				loading: "Updating discussion status...",
				success: `Discussion is ${nextStatus} now`,
				error: "Failed to update discussion status ❌",
				position: "bottom-center",
			},
		);
	};

	const { mutate: postLockToggle, isPending: toggleLockPending } =
		useAppMutation({
			mutationFn: togglePostLock,
			invalidateQueries: {
				queryKey: ["posts"],
			},
		});

	const handleLockToggle = async (lock) => {
		if (toggleLockPending || postStatusPending) return;
		setIsLocked(lock);
		if (status !== "visible") return;

		toast.promise(
			(async () => {
				const res = await postLockToggle({ credentials: lock, id: post.id });
				await sleep(1500);

				return res;
			})(),
			{
				loading: `${lock === true ? "Locking the discussion" : "Unlocking the discussion"}...`,
				success: `${lock === true ? "Discussion is Locked now " : "Discussion is Unlocked now"} ✅ `,
				error: "Failed to toggle the discussion ❌",
				position: "bottom-center",
			},
		);
	};

	return (
		<TableRow key={`${post.id}-${post.currentReviewBatch}`}>
			<TableCell className="font-medium sm:hidden">
				<div className="space-y-1.5">
					<div className="flex items-center justify-between">
						{format(new Date(post?.createdAt), "MMM d, yyyy")}
					</div>
					<div className="text-wrap flex gap-3">
						<ClosedCaption />
						{post?.content}
					</div>
					<div className="flex gap-2 justify-between">
						<Badge variant="outline">{post?.title}</Badge>
						<Badge
							variant={
								post?.status === "visible"
									? "default"
									: post?.status === "flagged"
										? "destructive"
										: "secondary"
							}
						>
							{post.status === "visible"
								? "Visible"
								: post.status === "flagged"
									? "Flagged"
									: "Hidden"}
						</Badge>
					</div>
				</div>
			</TableCell>
			<TableCell className="font-medium hidden sm:table-cell">
				{post?.title}
			</TableCell>
			<TableCell className="font-medium hidden sm:table-cell">
				<Card className="p-2 max-w-64 text-wrap line-clamp-2 overflow-hidden">
					<p>{post?.content}</p>
				</Card>
			</TableCell>
			<TableCell className="hidden sm:table-cell">
				<Badge variant="default">{post?.category}</Badge>
			</TableCell>
			<TableCell className="hidden sm:table-cell">
				<SwitchStatus value={status} onChange={handleStatusChange} />
			</TableCell>
			<TableCell className="hidden sm:table-cell">
				{anonymizeName(post?.User?.name)}
			</TableCell>
			<TableCell className="text-muted-foreground hidden sm:table-cell">
				{format(new Date(post?.createdAt), "MMM d, yyyy")}
			</TableCell>
			<TableCell className="hidden sm:table-cell">
				<div className="flex items-center gap-2">
					<Switch
						checked={isLocked}
						disabled={status !== "visible"}
						onCheckedChange={(e) => handleLockToggle(e)}
					/>
					{isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
				</div>
			</TableCell>
		</TableRow>
	);
};

export default ForumTable;
