import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useGetQuery from "@/hooks/useGetQuery";
import {
	fetchAllAppointments,
	fetchAllAssessments,
	fetchAllResources,
	fetchTopResources,
} from "@/lib/apiServices";
import {
	eachDayOfInterval,
	format,
	isWithinInterval,
	parseISO,
	subDays,
	subMonths,
} from "date-fns";
import { TrendingUp } from "lucide-react";
import { ChartNetwork } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { Shield } from "lucide-react";
import { Calendar } from "lucide-react";
import { Loader2 } from "lucide-react";
import { FileText } from "lucide-react";
import { Activity } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useMemo } from "react";
import { Link } from "react-router";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

const SEVERITY_COLORS = {
	Minimal: "hsl(142, 76%, 36%)",
	Mild: "hsl(48, 96%, 53%)",
	Moderate: "hsl(38, 92%, 50%)",
	"Moderately Severe": "hsl(25, 95%, 53%)",
	Severe: "hsl(0, 84%, 60%)",
	Unknown: "hsl(215, 14%, 45%)",
};

const chartConfig = {
	appointments: { label: "Appointments", color: "hsl(var(--primary))" },
	count: { label: "Resources", color: "hsl(var(--sky))" },
	avgPHQ9: { label: "Avg PHQ-9", color: "hsl(var(--lavender))" },
	avgGAD7: { label: "Avg GAD-7", color: "hsl(var(--sky))" },
	pending: { label: "Pending", color: "hsl(48, 96%, 53%)" },
	confirmed: { label: "Confirmed", color: "hsl(142, 76%, 36%)" },
	completed: { label: "Completed", color: "hsl(215, 76%, 56%)" },
	cancelled: { label: "Cancelled", color: "hsl(0, 84%, 60%)" },
	expired: { label: "Expired", color: "hsl(0, 20%, 45%)" },
};

const dateRangeOptions = [
	{ value: "7d", label: "Last 7 days" },
	{ value: "30d", label: "Last 30 days" },
	{ value: "90d", label: "Last 90 days" },
	{ value: "6m", label: "Last 6 months" },
	{ value: "1y", label: "Last year" },
	{ value: "all", label: "All time" },
];

const Stats = () => {
	const [dateRange, setDateRange] = useState("30d");

	const getDateRangeStart = (range) => {
		const now = new Date();
		switch (range) {
			case "7d":
				return subDays(now, 7);
			case "30d":
				return subDays(now, 30);
			case "90d":
				return subDays(now, 90);
			case "6m":
				return subMonths(now, 6);
			case "1y":
				return subMonths(now, 12);
			case "all":
				return null;
		}
	};

	const filterByDateRange = (data = []) => {
		if (!Array.isArray(data)) return [];
		const startDate = getDateRangeStart(dateRange);
		if (!startDate) return data;

		return data?.filter((item) => {
			const itemDate = parseISO(item.createdAt);
			return isWithinInterval(itemDate, { start: startDate, end: new Date() });
		});
	};

	const {
		data: resources = [],
		isLoading: isResourceLoading,
	} = useGetQuery({
		queryKey: ["adminDashboard", "resources"],
		queryFn: fetchAllResources,
		initialData: [],
		cacheTime: 10 * 60 * 1000,
	});

	const {
		data: appointments = [],
		isLoading: isAppointmentsLoading,
	} = useGetQuery({
		queryKey: ["adminDashboard", "appointments"],
		queryFn: fetchAllAppointments,
		initialData: [],
		cacheTime: 10 * 60 * 1000,
	});

	const {
		data: assessments = [],
		isLoading: isAssessmentsLoading,
	} = useGetQuery({
		queryKey: ["adminDashboard", "assessments"],
		queryFn: fetchAllAssessments,
		initialData: [],
		cacheTime: 10 * 60 * 1000,
	});

	const {
		data: topResources = [],
		isLoading: isTopResourcesLoading,
	} = useGetQuery({
		queryKey: ["adminDashboard", "topResources", dateRange],
		queryFn: () => fetchTopResources(getDateRangeStart(dateRange)),
		initialData: [],
		cacheTime: 10 * 60 * 1000,
	});

	const filteredAssessments = useMemo(
		() => filterByDateRange(assessments),
		[assessments, dateRange]
	);

	const filteredAppointments = useMemo(
		() => filterByDateRange(appointments),
		[appointments, dateRange]
	);

	const severityPieData = useMemo(() => {
		if (
			!Array.isArray(filteredAssessments) ||
			filteredAssessments?.length === 0
		)
			return [];

		const severityCounts = filteredAssessments?.reduce((acc, assessment) => {
			const severity = assessment.severity || "Unknown";
			acc[severity] = (acc[severity] || 0) + 1;
			return acc;
		}, {});

		return Object?.entries(severityCounts)?.map(([name, value]) => ({
			name,
			value,
		}));
	}, [filteredAssessments]);

	const appointmentDemandData = useMemo(() => {
		if (
			!Array.isArray(filteredAppointments) ||
			filteredAppointments?.length === 0
		)
			return [];

		const startDate = getDateRangeStart(dateRange);
		const daysToShow =
			dateRange === "7d"
				? 7
				: dateRange === "30d"
				? 30
				: dateRange === "90d"
				? 90
				: 30;

		const interval = eachDayOfInterval({
			start: startDate || subDays(new Date(), daysToShow - 1),
			end: new Date(),
		});

		return interval.map((day) => {
			const dayStr = format(day, "yyyy-MM-dd");
			const count = filteredAppointments?.filter((apt) => {
				const aptDate = format(new Date(apt.createdAt), "yyyy-MM-dd");
				return aptDate === dayStr;
			}).length;

			return {
				date: format(day, "MMM d"),
				appointments: count,
			};
		});
	}, [filteredAppointments, dateRange]);

	const resourcesUsageData = useMemo(() => {
		if (!Array.isArray(resources) || resources?.length === 0) return [];

		const categoryCounts = resources?.reduce((acc, resource) => {
			const category = resource.category || "Other";
			acc[category] = (acc[category] || 0) + 1;
			return acc;
		}, {});

		return Object.entries(categoryCounts).map(([category, count]) => ({
			category,
			count,
		}));
	}, [resources]);

	const avgScoresTrendData = useMemo(() => {
		if (
			!Array.isArray(filteredAssessments) ||
			filteredAssessments?.length === 0
		)
			return [];

		const phq9Assessments = filteredAssessments?.filter(
			(a) => a.type.toLowerCase() === "phq9"
		);
		const gad7Assessments = filteredAssessments?.filter(
			(a) => a.type.toLowerCase() === "gad7"
		);

		const weeklyData = {};

		phq9Assessments.forEach((a) => {
			const weekKey = format(new Date(a.createdAt), "MMM d");
			if (!weeklyData[weekKey]) {
				weeklyData[weekKey] = { phq9Scores: [], gad7Scores: [] };
			}
			weeklyData[weekKey].phq9Scores.push(a.score);
		});

		gad7Assessments.forEach((a) => {
			const weekKey = format(new Date(a.createdAt), "MMM d");
			if (!weeklyData[weekKey]) {
				weeklyData[weekKey] = { phq9Scores: [], gad7Scores: [] };
			}
			weeklyData[weekKey].gad7Scores.push(a.score);
		});

		return Object.entries(weeklyData).map(([date, data]) => ({
			date,
			avgPHQ9:
				data.phq9Scores.length > 0
					? Math.round(
							data.phq9Scores.reduce((a, b) => a + b, 0) /
								data.phq9Scores.length
					  )
					: null,
			avgGAD7:
				data.gad7Scores.length > 0
					? Math.round(
							data.gad7Scores.reduce((a, b) => a + b, 0) /
								data.gad7Scores.length
					  )
					: null,
		}));
	}, [filteredAssessments]);

	const departmentComparisonData = useMemo(() => {
		if (
			!Array.isArray(filteredAppointments) ||
			filteredAppointments?.length === 0
		)
			return [];

		const statusByCategory = {};

		filteredAppointments?.forEach((apt) => {
			const status = apt.status || "unknown";
			const month = format(new Date(apt.datetime), "MMM");

			if (!statusByCategory[month]) {
				statusByCategory[month] = {
					pending: 0,
					confirmed: 0,
					completed: 0,
					cancelled: 0,
					expired: 0,
				};
			}

			if (status === "pending") statusByCategory[month].pending++;
			else if (status === "confirmed") statusByCategory[month].confirmed++;
			else if (status === "completed") statusByCategory[month].completed++;
			else if (status === "cancelled") statusByCategory[month].cancelled++;
			else if (status === "expired") statusByCategory[month].expired++;
		});

		return Object.entries(statusByCategory).map(([month, counts]) => ({
			month,
			...counts,
		}));
	}, [filteredAppointments]);

	if (
		isTopResourcesLoading ||
		isResourceLoading ||
		isAppointmentsLoading ||
		isAssessmentsLoading
	) {
		return (
			<div className="flex items-center justify-center py-20">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="container space-y-6 py-8">
			<div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 rounded-lg bg-primary/10">
							<ChartNetwork className="h-6 w-6 text-primary" />
						</div>
						<h1 className="text-3xl font-bold text-foreground flex flex-col md:flex-row md:gap-3 md:items-end">
							Admin Stats
							<Link
								to="/admin"
								className="ml-2 underline underline-offset-2 text-xl text-peach"
							>
								Go to Dashboard
							</Link>
						</h1>
					</div>
					<p className="text-muted-foreground">
						See graphical stats of users, contents, assessments and appointments
					</p>
				</div>
				<div className="flex items-center gap-2">
					<CalendarDays className="h-4 w-4 text-muted-foreground" />
					<Select
						value={dateRange}
						onValueChange={(value) => setDateRange(value)}
					>
						<SelectTrigger className="w-40">
							<SelectValue placeholder="Select range" />
						</SelectTrigger>
						<SelectContent>
							{dateRangeOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5 text-primary" />
							Assessment Severity Distribution
						</CardTitle>
						<CardDescription>
							Breakdown of assessment results by severity level
						</CardDescription>
					</CardHeader>
					<CardContent>
						{severityPieData.length > 0 ? (
							<ChartContainer config={chartConfig} className="h-80">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={severityPieData}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={100}
											paddingAngle={2}
											dataKey="value"
											label={({ name, percent }) =>
												`${name} (${(percent * 100).toFixed(0)}%)`
											}
											labelLine={false}
										>
											{severityPieData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={
														SEVERITY_COLORS[entry.name] ||
														SEVERITY_COLORS.Unknown
													}
												/>
											))}
										</Pie>
										<ChartTooltip content={<ChartTooltipContent />} />
									</PieChart>
								</ResponsiveContainer>
							</ChartContainer>
						) : (
							<div className="h-[300px] flex items-center justify-center text-muted-foreground">
								No assessment data available
							</div>
						)}
						<div className="flex flex-wrap gap-2 mt-4 justify-center">
							{Object.entries(SEVERITY_COLORS)
								.slice(0, 5)
								.map(([severity, color]) => (
									<div
										key={severity}
										className="flex items-center gap-1.5 text-xs"
									>
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: color }}
										/>
										<span>{severity}</span>
									</div>
								))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5 text-purple-500" />
							Appointment Demand (Last 30 Days)
						</CardTitle>
						<CardDescription>Daily appointment bookings trend</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={chartConfig} className="h-[300px]">
							<LineChart data={appointmentDemandData}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis
									dataKey="date"
									tick={{ fontSize: 12 }}
									tickLine={false}
									axisLine={false}
									interval="preserveStartEnd"
								/>
								<YAxis
									tick={{ fontSize: 12 }}
									tickLine={false}
									axisLine={false}
									allowDecimals={false}
								/>
								<ChartTooltip content={<ChartTooltipContent />} />
								<Line
									type="monotone"
									dataKey="appointments"
									stroke="hsl(var(--primary))"
									strokeWidth={2}
									dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
									activeDot={{ r: 5 }}
								/>
							</LineChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-green-500" />
							Resources by Category
						</CardTitle>
						<CardDescription>
							Distribution of resources across categories
						</CardDescription>
					</CardHeader>
					<CardContent>
						{resourcesUsageData.length > 0 ? (
							<ChartContainer config={chartConfig} className="h-[300px]">
								<BarChart data={resourcesUsageData} layout="vertical">
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
										horizontal={true}
										vertical={false}
									/>
									<XAxis
										type="number"
										tick={{ fontSize: 12 }}
										tickLine={false}
										axisLine={false}
										allowDecimals={false}
									/>
									<YAxis
										dataKey="category"
										type="category"
										tick={{ fontSize: 12 }}
										tickLine={false}
										axisLine={false}
										width={100}
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar
										dataKey="count"
										fill="hsl(var(--sky))"
										radius={[0, 4, 4, 0]}
									/>
								</BarChart>
							</ChartContainer>
						) : (
							<div className="h-[300px] flex items-center justify-center text-muted-foreground">
								No resources data available
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-blue-500" />
							Average Assessment Scores Trend
						</CardTitle>
						<CardDescription>
							PHQ-9 and GAD-7 average scores over time
						</CardDescription>
					</CardHeader>
					<CardContent>
						{avgScoresTrendData.length > 0 ? (
							<ChartContainer config={chartConfig} className="h-[300px]">
								<AreaChart data={avgScoresTrendData}>
									<defs>
										<linearGradient
											id="avgPHQ9Gradient"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop
												offset="5%"
												stopColor="hsl(var(--lavender))"
												stopOpacity={0.3}
											/>
											<stop
												offset="95%"
												stopColor="hsl(var(--lavender))"
												stopOpacity={0}
											/>
										</linearGradient>
										<linearGradient
											id="avgGAD7Gradient"
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop
												offset="5%"
												stopColor="hsl(var(--sky))"
												stopOpacity={0.3}
											/>
											<stop
												offset="95%"
												stopColor="hsl(var(--sky))"
												stopOpacity={0}
											/>
										</linearGradient>
									</defs>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
									/>
									<XAxis
										dataKey="date"
										tick={{ fontSize: 12 }}
										tickLine={false}
										axisLine={false}
									/>
									<YAxis
										tick={{ fontSize: 12 }}
										tickLine={false}
										axisLine={false}
										domain={[0, 27]}
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<ChartLegend content={<ChartLegendContent />} />
									<Area
										type="monotone"
										dataKey="avgPHQ9"
										stroke="hsl(var(--lavender))"
										fill="url(#avgPHQ9Gradient)"
										strokeWidth={2}
										connectNulls
									/>
									<Area
										type="monotone"
										dataKey="avgGAD7"
										stroke="hsl(var(--sky))"
										fill="url(#avgGAD7Gradient)"
										strokeWidth={2}
										connectNulls
									/>
								</AreaChart>
							</ChartContainer>
						) : (
							<div className="h-[300px] flex items-center justify-center text-muted-foreground">
								No assessment data available
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileText className="h-5 w-5 text-primary" />
							Top Resources by Usage
						</CardTitle>
						<CardDescription>
							Most viewed resources ranked by user engagement
						</CardDescription>
					</CardHeader>
					<CardContent>
						{topResources?.length > 0 ? (
							<ChartContainer config={chartConfig} className="h-[300px]">
								<BarChart data={topResources} layout="vertical">
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
										horizontal={true}
										vertical={false}
									/>
									<XAxis
										type="number"
										tick={{ fontSize: 12 }}
										tickLine={false}
										axisLine={false}
										allowDecimals={false}
									/>
									<YAxis
										dataKey="title"
										type="category"
										tick={{ fontSize: 11 }}
										tickLine={false}
										axisLine={false}
										width={120}
										tickFormatter={(value) =>
											value.length > 18 ? `${value.slice(0, 18)}...` : value
										}
									/>
									<ChartTooltip
										content={
											<ChartTooltipContent
												labelFormatter={(_, payload) => {
													const data = payload?.[0]?.payload;
													return data?.title ?? "";
												}}
												formatter={(value, name, props) => {
													const { lastUsedAt } = props.payload;

													return [
														<>
															<div className="flex flex-col gap-0.5">
																<span className="font-extrabold text-destructive">
																	Usage:{" "}
																	<span className="font-semibold text-black">
																		{value}
																	</span>
																</span>
																{lastUsedAt && (
																	<span className="text-xs text-accent font-extrabold">
																		Last used:{" "}
																		<span className="font-semibold text-black">
																			{new Date(
																				lastUsedAt
																			).toLocaleDateString()}{" "}
																			{new Date(lastUsedAt).toLocaleTimeString(
																				[],
																				{
																					hour: "2-digit",
																					minute: "2-digit",
																				}
																			)}
																		</span>
																	</span>
																)}
															</div>
														</>,
													];
												}}
											/>
										}
									/>
									<Bar
										dataKey="usageCount"
										fill="hsl(var(--primary))"
										radius={[0, 4, 4, 0]}
									/>
								</BarChart>
							</ChartContainer>
						) : (
							<div className="h-[300px] flex items-center justify-center text-muted-foreground">
								No resource usage data available
							</div>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5 text-orange-500" />
							Appointment Status by Month
						</CardTitle>
						<CardDescription>
							Stacked comparison of appointment statuses over time
						</CardDescription>
					</CardHeader>
					<CardContent>
						{departmentComparisonData.length > 0 ? (
							<ChartContainer config={chartConfig} className="h-[350px]">
								<BarChart data={departmentComparisonData}>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-muted"
									/>
									<XAxis
										dataKey="month"
										tick={{ fontSize: 12 }}
										tickLine={false}
										axisLine={false}
									/>
									<YAxis
										tick={{ fontSize: 12 }}
										tickLine={false}
										axisLine={false}
										allowDecimals={false}
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<ChartLegend content={<ChartLegendContent />} />
									<Bar
										dataKey="pending"
										stackId="a"
										fill="hsl(48, 96%, 53%)"
										radius={[0, 0, 0, 0]}
									/>
									<Bar
										dataKey="confirmed"
										stackId="a"
										fill="hsl(142, 76%, 36%)"
										radius={[0, 0, 0, 0]}
									/>
									<Bar
										dataKey="completed"
										stackId="a"
										fill="hsl(215, 76%, 56%)"
										radius={[0, 0, 0, 0]}
									/>
									<Bar
										dataKey="cancelled"
										stackId="a"
										fill="hsl(0, 84%, 60%)"
										radius={[4, 4, 0, 0]}
									/>
									<Bar
										dataKey="expired"
										stackId="a"
										fill="hsl(0, 20%, 45%)"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ChartContainer>
						) : (
							<div className="h-[350px] flex items-center justify-center text-muted-foreground">
								No appointment data available
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Stats;
