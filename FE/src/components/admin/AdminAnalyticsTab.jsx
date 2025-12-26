import { GraduationCap } from "lucide-react";
import { FileText } from "lucide-react";
import { Calendar } from "lucide-react";
import { HandHelping } from "lucide-react";
import { Users } from "lucide-react";
import React from "react";
import { Activity } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserStar } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router";
import useGetQuery from "@/hooks/useGetQuery";
import {
	fetchAllAssessments,
	fetchOverviewData,
	fetchSeverityStats,
} from "@/lib/apiServices";
import { useMemo } from "react";
import { getSeverityCount, getTypeCount } from "@/lib/utils";
import AlertThresholdsPanel from "../AlertThresholdsPanel";

const AdminAnalyticsTab = () => {
	const {
		data: overview,
		isLoading,
		isError,
		error,
	} = useGetQuery({
		queryKey: ["adminDashboard", "overview"],
		queryFn: fetchOverviewData,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const {
		data: severityStats,
		isLoading: isSeverityStatsLoading,
		isError: isSeverityStatsError,
		error: severityStatsError,
	} = useGetQuery({
		queryKey: ["adminDashboard", "assessments"],
		queryFn: fetchSeverityStats,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const alertMetrics = useMemo(() => {
		const severeCount = getSeverityCount(severityStats?.dataBySevere, "severe");
		const moderateSevereCount = getSeverityCount(
			severityStats?.dataBySevere,
			"moderately_severe"
		);
		const phq9Assessments = getTypeCount(severityStats?.dataByTypes, "phq9");
		const gad7Assessments = getTypeCount(severityStats?.dataByTypes, "gad7");

		const avgPHQ9 =
			phq9Assessments.length > 0
				? Math.round(
						phq9Assessments.reduce((sum, a) => sum + a.score, 0) /
							phq9Assessments.length
				  )
				: 0;
		const avgGAD7 =
			gad7Assessments.length > 0
				? Math.round(
						gad7Assessments.reduce((sum, a) => sum + a.score, 0) /
							gad7Assessments.length
				  )
				: 0;

		return { severeCount, moderateSevereCount, avgPHQ9, avgGAD7 };
	}, [severityStats]);

	if (isError || isSeverityStatsError) {
		return (
			<div className="container py-20 flex items-center justify-center">
				<p className="text-center">
					{error?.message || severityStatsError?.message}
				</p>
			</div>
		);
	}

	const STATS_CARD = [
		{
			title: "Total Users",
			value: overview?.users,
			icon: Users,
			description: "Registered users",
			color: "text-blue-500",
			bgColor: "bg-blue-500/10",
			child: [
				{
					title: "Total Students",
					value: overview?.students,
					icon: GraduationCap,
					description: "Registered students",
					color: "text-blue-500",
					bgColor: "bg-blue-500/10",
				},
				{
					title: "Total Counsellors",
					value: overview?.counsellors,
					icon: HandHelping,
					description: "Registered counsellors",
					color: "text-blue-500",
					bgColor: "bg-blue-500/10",
				},
				{
					title: "Total Peers Supporters",
					value: overview?.counsellors,
					icon: UserStar,
					description: "Registered Peers",
					color: "text-blue-500",
					bgColor: "bg-blue-500/10",
				},
			],
		},
		{
			title: "Resources",
			value: overview?.resources,
			icon: FileText,
			description: "Published resources",
			color: "text-green-500",
			bgColor: "bg-green-500/10",
		},
		{
			title: "Appointments",
			value: overview?.appointments,
			icon: Calendar,
			description: `${overview?.pendingAppointments} pending, ${overview?.confirmedAppointments} confirmed, ${overview?.completedAppointments} completed`,
			color: "text-purple-500",
			bgColor: "bg-purple-500/10",
		},
		{
			title: "Assessments",
			value: overview?.assessments,
			icon: Activity,
			description: "Completed assessments",
			color: "text-orange-500",
			bgColor: "bg-orange-500/10",
		},
	];

	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{STATS_CARD?.map((stats) => (
					<Card key={stats.title}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								{stats.title}
							</CardTitle>
							<div className={`p-2 rounded-lg ${stats.bgColor}`}>
								{stats.title === "Total Users" ? (
									<Tooltip>
										<TooltipTrigger asChild>
											<stats.icon className={`h-4 w-4 ${stats.color}`} />
										</TooltipTrigger>
										<TooltipContent className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
											{stats?.child.map((stat) => (
												<Card key={stat.title}>
													<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
														<CardTitle className="text-sm font-medium">
															{stat.title}
														</CardTitle>
														<div className={`p-2 rounded-lg ${stat.bgColor}`}>
															<stat.icon className={`h-4 w-4 ${stat.color}`} />
														</div>
													</CardHeader>
													<CardContent>
														<div className="text-2xl font-bold">
															{isLoading ? "..." : stat.value}
														</div>
														<p className="text-xs text-muted-foreground">
															{stat.description}
														</p>
													</CardContent>
												</Card>
											))}
										</TooltipContent>
									</Tooltip>
								) : (
									<stats.icon className={`h-4 w-4 ${stats.color}`} />
								)}
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{isLoading ? "..." : stats.value}
							</div>
							<p className="text-xs text-muted-foreground">
								{stats.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			<AlertThresholdsPanel
				stats={overview}
				severeAssessmentsCount={alertMetrics.severeCount}
				moderateSevereCount={alertMetrics.moderateSevereCount}
				avgPHQ9Score={alertMetrics.avgPHQ9}
				avgGAD7Score={alertMetrics.avgGAD7}
			/>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-green-500" />
							Quick Insights
						</CardTitle>
						<CardDescription>Platform overview</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
							<span className="text-sm">Peer Support Content</span>
							<span className="font-semibold">
								{overview?.peerSupportContent}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
							<span className="text-sm">Pending Appointments</span>
							<span className="font-semibold text-orange-500">
								{overview?.pendingAppointments}
							</span>
						</div>
						<div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
							<span className="text-sm">Avg Assessments/User</span>
							<span className="font-semibold">
								{overview?.users
									? (overview?.assessments / overview?.users).toFixed(1)
									: "0"}
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5 text-primary" />
							Recent Activity
						</CardTitle>
						<CardDescription>Latest platform activity</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
								<div className="w-2 h-2 rounded-full bg-green-500" />
								<span className="text-sm">Platform is running smoothly</span>
							</div>
							<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
								<div className="w-2 h-2 rounded-full bg-blue-500" />
								<span className="text-sm">
									{overview?.users} users registered
								</span>
							</div>
							<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
								<div className="w-2 h-2 rounded-full bg-purple-500" />
								<span className="text-sm">
									{overview?.assessments} assessments completed
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminAnalyticsTab;
