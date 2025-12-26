import React from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSelector } from "react-redux";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import useAppMutation from "@/hooks/useAppMutation";
import { updateUser as updateUserApi } from "@/lib/apiServices";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slice/authSlice";
import { Loader2 } from "lucide-react";
import { Save } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

const UserProfile = () => {
	const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const form = useForm({
		defaultValues: {
			...user,
		},
	});

	const {
		mutate: updateUser,
		isPending,
		isError,
		error,
	} = useAppMutation({
		mutationFn: updateUserApi,
		invalidateQueries: ["user"],
		onSuccess: (data) => {
			dispatch(login(data?.user));
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const handleSaveProfile = async (e) => {
		updateUser(e);
	};
	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>Update your personal information</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="fullName">Full Name</Label>
						<Input
							id="fullName"
							value={user?.name || ""}
							placeholder="Enter your name"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							value={user?.email || ""}
							disabled
							className="bg-muted"
						/>
						<p className="text-xs text-muted-foreground">
							Email cannot be changed
						</p>
					</div>
					<Separator />
					<Button onClick={handleSaveProfile} disabled={isPending}>
						{isPending ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="h-4 w-4 mr-2" />
								Save Changes
							</>
						)}
					</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Account Details</CardTitle>
					<CardDescription>Your account information</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex justify-between items-center py-2">
						<span className="text-muted-foreground">User ID</span>
						<span className="font-mono text-sm">
							{user?.id}
							...
						</span>
					</div>
					<Separator />
					<div className="flex justify-between items-center py-2">
						<span className="text-muted-foreground">Account Created</span>
						<span>
							{user?.createdAt
								? format(new Date(user.createdAt), "MMM d, yyyy")
								: "N/A"}
						</span>
					</div>
					<Separator />
					<div className="flex justify-between items-center py-2">
						<span className="text-muted-foreground">Total Assessments</span>
						<Badge variant="secondary">{user?.assessments}</Badge>
					</div>
					<Separator />
					<div className="flex justify-between items-center py-2">
						<span className="text-muted-foreground">Total Appointments</span>
						<Badge variant="secondary">{user?.appointments}</Badge>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default UserProfile;
