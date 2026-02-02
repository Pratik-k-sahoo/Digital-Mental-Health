import React from "react";
import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Calendar } from "lucide-react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
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
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { Link } from "react-router";
import useGetQuery from "@/hooks/useGetQuery";
import {
	fetchAllAppointments,
	updateBookingStatus as updateBookingStatusApi,
} from "@/lib/apiServices";
import useAppMutation from "@/hooks/useAppMutation";
import useAnonymization from "@/hooks/useAnonymization";
import AnonymizationToggle from "./AnonymizationToggle";
import { User } from "lucide-react";
import { HandHelping } from "lucide-react";
import { toast } from "sonner";
import { sleep } from "@/lib/utils";

const statusColors = {
	pending: "bg-yellow-500",
	confirmed: "bg-green-500",
	cancelled: "bg-red-500",
	completed: "bg-blue-500",
};

const AdminAppointmentsTab = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const { anonymizeEmail, anonymizeName } = useAnonymization();
	const {
		data: appointments,
		isLoading,
		isError,
		error,
	} = useGetQuery({
		queryKey: ["adminDashboard", "appointments"],
		queryFn: fetchAllAppointments,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const { mutateAsync: updateBookingStatus, isPending } = useAppMutation({
		mutationFn: updateBookingStatusApi,
		invalidateQueries: {
			queryKey: ["adminDashboard", "appointments"],
		},
	});

	if (isError) {
		return (
			<div className="container py-20 flex items-center justify-center">
				<p className="text-center">{error?.message}</p>
			</div>
		);
	}

	const filteredAppointments = appointments?.filter((appointment) => {
		const matchesSearch =
			appointment?.Student?.name
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			appointment?.Student?.email
				?.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			appointment?.Counsellor?.name
				?.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || appointment.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const updateStatus = async (id, updatedStatus) => {
		if (isPending) return;
		toast.promise(
			(async () => {
				const res = await updateBookingStatus({ id, updatedStatus });
				await sleep(1500);

				return res;
			})(),
			{
				loading: "Updating appointment status...",
				success: "Appointment status updated ✅",
				error: "Failed to update appointment status ❌",
				position: "bottom-center",
			},
		);
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Appointment Management
						</CardTitle>
						<CardDescription>
							View and manage counseling appointments
						</CardDescription>
					</div>
					<AnonymizationToggle />
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search appointments..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9"
						/>
					</div>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="Filter status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="confirmed">Confirmed</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
							<SelectItem value="cancelled">Cancelled</SelectItem>
							<SelectItem value="expired">Expired</SelectItem>
						</SelectContent>
					</Select>
					<Badge variant="secondary">{appointments?.length} appointments</Badge>
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
									<TableHead>Student</TableHead>
									<TableHead>Counselor</TableHead>
									<TableHead>Date & Time</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="w-[150px]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredAppointments?.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="text-center py-8 text-muted-foreground"
										>
											No appointments found
										</TableCell>
									</TableRow>
								) : (
									filteredAppointments?.map((appointment) => (
										<TableRow key={appointment.id}>
											<TableCell className={`sm:hidden`}>
												<div
													className={`${
														statusColors[appointment?.status]
													} text-white space-y-1.5 p-2 rounded-2xl`}
												>
													<div className="flex items-center justify-center gap-1">
														{appointment?.status === "pending" && (
															<>
																<Button
																	variant="ghost"
																	size="icon"
																	onClick={() =>
																		updateStatus(appointment?.id, "confirmed")
																	}
																	title="Confirm"
																	className={"p-2 hover:bg-primary"}
																	asChild
																>
																	<Check className="h-4 w-4 text-green-500" />
																</Button>
																<Button
																	variant="ghost"
																	size="icon"
																	onClick={() =>
																		updateStatus(appointment?.id, "cancelled")
																	}
																	title="Cancel"
																	className={"p-2 hover:bg-destructive"}
																	asChild
																>
																	<X className="h-4 w-4 text-red-500" />
																</Button>
															</>
														)}
														{appointment?.status === "confirmed" && (
															<Button
																variant="ghost"
																size="icon"
																onClick={() =>
																	updateStatus(appointment?.id, "completed")
																}
																title="Mark Complete"
																asChild
																className="p-2 hover:bg-accent"
															>
																<Check className="h-4 w-4 text-blue-500" />
															</Button>
														)}
													</div>
													<div className="flex gap-2 items-center">
														<User />
														<div>
															<div className="font-medium">
																{anonymizeName(appointment?.Student?.name) ||
																	"N/A"}
															</div>
															<div className="text-sm text-neutral-300">
																{anonymizeEmail(appointment?.Student?.email)}
															</div>
														</div>
													</div>
													<div className="flex gap-2 items-center">
														<HandHelping />
														{anonymizeName(appointment?.Counsellor?.name) ||
															"Unassigned"}
													</div>
													<div className="flex gap-2 items-center">
														<Calendar />
														<div>
															<div>
																{format(
																	new Date(appointment?.datetime),
																	"MMM d, yyyy",
																)}
															</div>
															<div className="text-sm text-neutral-300">
																{format(
																	new Date(appointment?.datetime),
																	"h:mm a",
																)}
															</div>
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												<div>
													<div className="font-medium">
														{anonymizeName(appointment?.Student?.name) || "N/A"}
													</div>
													<div className="text-sm text-muted-foreground">
														{anonymizeEmail(appointment?.Student?.email)}
													</div>
												</div>
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												{anonymizeName(appointment?.Counsellor?.name) ||
													"Unassigned"}
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												<div>
													<div>
														{format(
															new Date(appointment?.datetime),
															"MMM d, yyyy",
														)}
													</div>
													<div className="text-sm text-muted-foreground">
														{format(new Date(appointment?.datetime), "h:mm a")}
													</div>
												</div>
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												<Badge
													className={`${
														statusColors[appointment?.status]
													} text-white`}
												>
													{appointment?.status}
												</Badge>
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												<div className="flex items-center gap-1">
													{appointment?.status === "pending" && (
														<>
															<Button
																variant="ghost"
																size="icon"
																onClick={() =>
																	updateStatus(appointment?.id, "confirmed")
																}
																title="Confirm"
																className={"p-2 hover:bg-primary"}
																asChild
															>
																<Check className="h-4 w-4 text-green-500" />
															</Button>
															<Button
																variant="ghost"
																size="icon"
																onClick={() =>
																	updateStatus(appointment?.id, "cancelled")
																}
																title="Cancel"
																className={"p-2 hover:bg-destructive"}
																asChild
															>
																<X className="h-4 w-4 text-red-500" />
															</Button>
														</>
													)}
													{appointment?.status === "confirmed" && (
														<Button
															variant="ghost"
															size="icon"
															onClick={() =>
																updateStatus(appointment?.id, "completed")
															}
															title="Mark Complete"
															asChild
															className="p-2 hover:bg-accent"
														>
															<Check className="h-4 w-4 text-blue-500" />
														</Button>
													)}
												</div>
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

export default AdminAppointmentsTab;
