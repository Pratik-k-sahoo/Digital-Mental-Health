import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAppMutation from "@/hooks/useAppMutation";
import { updatePeerApplicationStatus } from "@/lib/apiServices";
import React from "react";
import { useState } from "react";

const PeerApplicationStatus = ({ actionType, setActionType, selectedApp }) => {
	const [adminNotes, setAdminNotes] = useState("");
	const { mutateAsync: updateStatus, isPending: isUpdateStatusPending } =
		useAppMutation({
			mutationFn: updatePeerApplicationStatus,
			invalidateQueries: {
				queryKey: ["applied-peers"],
			},
		});
	const handleApprove = async (app) => {
		await updateStatus({ id: app.id, status: actionType });
	};
	const handleReject = async (app) => {
		await updateStatus({ id: app.id, status: actionType });
	};
	return (
		<AlertDialog
			open={!!actionType}
			onOpenChange={() => {
				setActionType(null);
				setAdminNotes("");
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{actionType === "approve"
							? "Approve Application?"
							: "Reject Application?"}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{actionType === "approve"
							? `This will grant ${selectedApp?.profile?.full_name || "this user"} peer supporter privileges.`
							: `This will reject the application from ${selectedApp?.profile?.full_name || "this user"}.`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="space-y-2">
					<Label htmlFor="admin-notes">Admin Notes (optional)</Label>
					<Textarea
						id="admin-notes"
						placeholder="Add any notes about this decision..."
						value={adminNotes}
						onChange={(e) => setAdminNotes(e.target.value)}
					/>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant={actionType === "reject" ? "destructive" : ""}
						onClick={() => {
							if (selectedApp) {
								actionType === "approve"
									? handleApprove(selectedApp)
									: handleReject(selectedApp);
							}
						}}
					>
						{actionType === "approve"
							? isUpdateStatusPending
								? "Approving..."
								: "Approve"
							: isUpdateStatusPending
								? "Rejecting..."
								: "Reject"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default PeerApplicationStatus;
