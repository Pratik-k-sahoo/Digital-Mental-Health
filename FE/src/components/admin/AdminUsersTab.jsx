import React from "react";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { User } from "lucide-react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { Link } from "react-router";
import useGetQuery from "@/hooks/useGetQuery";
import { fetchAllUsers, updateUserRole } from "@/lib/apiServices";
import AnonymizationToggle from "./AnonymizationToggle";
import useAnonymization from "@/hooks/useAnonymization";
import { UserCheck } from "lucide-react";
import { MailCheck } from "lucide-react";
import { CircleCheckBig } from "lucide-react";
import SwitchRole from "./SwitchRole";
import useAppMutation from "@/hooks/useAppMutation";
import { toast } from "sonner";
import { sleep } from "@/lib/utils";
import { useSelector } from "react-redux";

const AdminUsersTab = () => {
	const { user: current } = useSelector((state) => state.auth);
	const [searchQuery, setSearchQuery] = useState("");
	const { anonymizeEmail, anonymizeName } = useAnonymization();
	const {
		data: users,
		isLoading,
		isError,
		error,
	} = useGetQuery({
		queryKey: ["adminDashboard", "users"],
		queryFn: fetchAllUsers,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const { mutateAsync: userRoleUpdateAsync, isPending: userRoleUpdatePending } =
		useAppMutation({
			mutationFn: updateUserRole,
			invalidateQueries: {
				queryKey: ["adminDashboard", "users"],
			},
		});

	const handleRoleChange = async (role, id) => {
		if (userRoleUpdatePending) return;
		if (role === "admin") {
			const confirmed = window.confirm(
				"Are you sure you want to upgrade the user's role to admin?",
			);
			if (!confirmed) return;
		} else if (role === "peer_volunteer") {
			const confirmed = window.confirm(
				"Are you sure you want to upgrade the user's role to peer volunteer?",
			);
			if (!confirmed) return;
		}
		toast.promise(
			(async () => {
				const res = await userRoleUpdateAsync({
					role: {
						role,
					},
					id,
				});
				await sleep(1500);

				return res;
			})(),
			{
				loading: "Updating user's role...",
				success: `User is ${role === "peer_volunteer" ? "volunteer" : role} now`,
				error: "Failed to update user's role ❌",
				position: "bottom-center",
			},
		);
	};

	if (isError) {
		return (
			<div className="container py-20 flex items-center justify-center">
				<p className="text-center">{error?.message}</p>
			</div>
		);
	}

	const filteredUsers = users?.filter((user) => {
		const search = searchQuery?.toLowerCase();
		return (
			user?.name?.toLowerCase()?.includes(search) ||
			user?.email?.toLowerCase()?.includes(search)
		);
	});
	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							User Management
						</CardTitle>
						<CardDescription>View and manage registered users</CardDescription>
					</div>
					<AnonymizationToggle />
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
					<div className="relative flex-1 w-full max-w-sm order-2 md:order-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search users..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Badge variant="secondary" className="order-1 md:order-2">
						{users?.length} users
					</Badge>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-primary" />
					</div>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader className="hidden md:table-header-group">
								<TableRow>
									<TableHead className="font-bold text-base">Name</TableHead>
									<TableHead className="font-bold text-base">Email</TableHead>
									<TableHead className="font-bold text-base">Role</TableHead>
									<TableHead className="font-bold text-base">Joined</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredUsers?.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={4}
											className="text-center py-8 text-muted-foreground"
										>
											No users found
										</TableCell>
									</TableRow>
								) : (
									filteredUsers?.map((user) => (
										<TableRow key={user?.id}>
											<TableCell className="font-medium md:hidden">
												<div
													className={`space-y-1.5 p-2 rounded-2xl ${
														user?.role === "admin"
															? "bg-destructive text-white"
															: user?.role === "counsellor"
																? "bg-primary text-primary-foreground"
																: "bg-secondary text-secondary-foreground"
													}`}
												>
													<span className="flex justify-center underline underline-offset-2 font-bold">
														{user?.role}
													</span>
													<div className="flex items-center gap-2">
														<UserCheck />
														{anonymizeName(user?.name) || "Not set"}
													</div>
													<div className="flex items-center gap-2">
														<MailCheck />
														{anonymizeEmail(user?.email) || "N/A"}
													</div>
													<div className="flex items-center gap-2">
														<CircleCheckBig />
														{format(
															new Date(user?.createdAt?.replace(" ", "T")),
															"MMM d, yyyy",
														)}
													</div>
												</div>
											</TableCell>
											<TableCell className="hidden md:table-cell">
												{anonymizeName(user?.name) || "Not set"}
											</TableCell>
											<TableCell className="hidden md:table-cell">
												{anonymizeEmail(user?.email) || "N/A"}
											</TableCell>
											<TableCell className="hidden md:table-cell">
												{current?.role === "admin" ? (
													<SwitchRole
														value={user}
														onChange={handleRoleChange}
													/>
												) : (
													<Badge
														variant={
															user?.role === "admin"
																? "destructive"
																: user?.role === "counsellor"
																	? "default"
																	: "secondary"
														}
													>
														{user?.role || "user"}
													</Badge>
												)}
											</TableCell>
											<TableCell className="text-muted-foreground hidden md:table-cell">
												{format(
													new Date(user?.createdAt?.replace(" ", "T")),
													"MMM d, yyyy",
												)}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default AdminUsersTab;
