import useGetQuery from "@/hooks/useGetQuery";
import { fetchMyAppointments } from "@/lib/apiServices";
import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { User2 } from "lucide-react";
import { HandHelping } from "lucide-react";
import { CalendarPlus2 } from "lucide-react";

const statusColors = {
	pending: "bg-yellow-500",
	confirmed: "bg-green-500",
	cancelled: "bg-red-500",
	completed: "bg-blue-500",
};

const Appointment = () => {
	const { user } = useSelector((state) => state.auth);
	const [statusFilter, setStatusFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const {
		isPending: fetchAppointmentsPending,
		isError: isFetchAppointmentsError,
		data: appointments = [],
		error: fetchAppointmentsError,
	} = useGetQuery({
		queryKey: ["appointments"],
		queryFn: fetchMyAppointments,
		initialData: [],
	});

	if (fetchAppointmentsPending) {
		return (
			<Layout>
				<div className="container py-20 flex items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			</Layout>
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

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Appointment Management
						</CardTitle>
						<CardDescription>
							View and manage counseling appointments
						</CardDescription>
					</div>
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

				{fetchAppointmentsPending ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-primary" />
					</div>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader className="hidden sm:table-header-group">
								<TableRow>
									<TableHead className="font-bold text-base">
										Student
									</TableHead>
									<TableHead className="font-bold text-base">
										Counselor
									</TableHead>
									<TableHead className="font-bold text-base">
										Date & Time
									</TableHead>
									<TableHead className="font-bold text-base">
										Status
									</TableHead>
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
											<TableCell>
												<div
													className={`rounded-lg p-2 ${
														statusColors[appointment?.status]
													} sm:bg-white text-white sm:text-black space-y-1.5 sm:space-y-0`}
												>
													<span className="flex justify-center rounded-2xl bg-white text-black sm:hidden">
														{appointment?.status}
													</span>
													<div className="flex items-center gap-2">
														<div className="sm:hidden">
															<User2 />
														</div>
														<div>
															<div className="font-medium ">
																{user.name || "N/A"}
															</div>
															<div className="text-xs sm:text-sm text-neutral-400  sm:text-muted-foreground">
																{user.email}
															</div>
														</div>
													</div>
													<div className="sm:hidden">
														<div className="flex items-center gap-2">
															<span>
																<HandHelping />
															</span>
															{appointment?.Counsellor?.name || "Unassigned"}
														</div>
														<div className="flex items-center gap-2">
															<span>
																<CalendarPlus2 />
															</span>
															<div>
																<div>
																	{format(
																		new Date(appointment?.datetime),
																		"MMM d, yyyy"
																	)}
																</div>
																<div className="text-sm text-neutral-400 sm:text-muted-foreground">
																	{format(
																		new Date(appointment?.datetime),
																		"h:mm a"
																	)}
																</div>
															</div>
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												{appointment?.Counsellor?.name || "Unassigned"}
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												<div>
													<div>
														{format(
															new Date(appointment?.datetime),
															"MMM d, yyyy"
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

export default Appointment;
