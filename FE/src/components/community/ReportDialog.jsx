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
import { flagPost } from "@/lib/apiServices";
import { toast } from "sonner";

const ReportDialog = ({ post }) => {
	const [flagOpen, setFlagOpen] = useState(false);
	const [reason, setReason] = useState("");

	const { mutate: postFlag, isPending: isFlagPostPending } = useAppMutation({
		mutationFn: flagPost,
		invalidateQueries: {
			queryKey: ["flagPost"],
		},
		onSuccess: () => {
			toast.success("Discussion reported");
		},
		onError: () => {
			toast.error("Something went wrong", {
				description: "Please try again later⌚",
			});
		},
	});

	const handleReportPost = async () => {
		if (isFlagPostPending) return;
		await postFlag({ credentials: { reason }, id: post.id });
		setFlagOpen(false);
	};

	return (
		<Sheet
			open={flagOpen}
			onOpenChange={setFlagOpen}
			className="border border-red-900"
		>
			<SheetTrigger>
				<Button
					variant="ghost"
					className="hover:bg-destructive text-destructive hover:text-destructive-foreground"
				>
					<Flag className="h-4 w-4" />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Report Post</SheetTitle>
					<SheetDescription>
						Report the post if you find any threats or offensive. Mention the
						reason below.
					</SheetDescription>
				</SheetHeader>
				<div className="grid flex-1 auto-rows-min gap-6 px-4">
					<div className="grid gap-3">
						<Label htmlFor="reason">
							Post by {post?.displayName || "Anonymous Student"}
						</Label>
						<Textarea disabled value={post?.content} />
					</div>
					<div className="grid gap-3">
						<Label htmlFor="reason">Reason</Label>
						<Textarea
							id="reason"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder="Enter the reason of reporting here..."
						/>
					</div>
				</div>
				<SheetFooter>
					<Button disabled={isFlagPostPending} onClick={handleReportPost}>
						Report
					</Button>
					<SheetClose asChild>
						<Button disabled={isFlagPostPending} variant="outline">
							Close
						</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};

export default ReportDialog;
