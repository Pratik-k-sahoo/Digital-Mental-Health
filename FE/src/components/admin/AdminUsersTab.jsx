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
import { fetchAllUsers } from "@/lib/apiServices";
import AnonymizationToggle from "./AnonymizationToggle";
import useAnonymization from "@/hooks/useAnonymization";

const AdminUsersTab = () => {
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

	if (isError) {
		if (error?.status === 401) {
			return (
				<div className="container py-20 flex items-center justify-center">
					<p className="text-center">
						Please{" "}
						<Link
							to="/login"
							className="text-accent underline underline-offset-2"
						>
							login
						</Link>{" "}
						in again.
					</p>
				</div>
			);
		}
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
				<div className="flex items-center justify-between">
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
				<div className="flex items-center gap-4 mb-6">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search users..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Badge variant="secondary">{users?.length} users</Badge>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-primary" />
					</div>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Joined</TableHead>
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
											<TableCell className="font-medium">
												{anonymizeName(user?.name) || "Not set"}
											</TableCell>
											<TableCell>
												{anonymizeEmail(user?.email) || "N/A"}
											</TableCell>
											<TableCell>
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
											</TableCell>
											<TableCell className="text-muted-foreground">
												{format(
													new Date(user?.createdAt?.replace(" ", "T")),
													"MMM d, yyyy"
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
