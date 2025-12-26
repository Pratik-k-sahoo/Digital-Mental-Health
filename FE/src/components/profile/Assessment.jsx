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
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Brain } from "lucide-react";
import { ChartContainer, ChartTooltipContent } from "../ui/chart";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import { Tooltip } from "../ui/tooltip";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useNavigate } from "react-router";
import { Heart } from "lucide-react";
import { BarChart3 } from "lucide-react";
import useGetQuery from "@/hooks/useGetQuery";
import { fetchAssessmentHistory } from "@/lib/apiServices";
import { useMemo } from "react";
import {
	getLatestAssessment,
	getSeverityColor,
} from "@/lib/utils";
import { Minus } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { TrendingDown } from "lucide-react";

const chartConfig = {
	PHQ9: {
		label: "PHQ-9 (Depression)",
		color: "hsl(var(--lavender))",
	},
	GAD7: {
		label: "GAD-7 (Anxiety)",
		color: "hsl(var(--sky))",
	},
};

const Assessment = () => {
	const navigate = useNavigate();

	const {
		isPending: fetchAssessmentsPending,
		isError: isFetchAssessmentsError,
		data: assessments = [],
		error: fetchAssessmentsError,
	} = useGetQuery({
		queryKey: ["assessments"],
		queryFn: fetchAssessmentHistory,
		initialData: [],
	});

	if (fetchAssessmentsPending) {
		return (
			<Layout>
				<div className="container py-20 flex items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			</Layout>
		);
	}

	const chartData = useMemo(() => {
		const phq9Data = assessments
			?.filter((a) => a.type.toLowerCase() === "phq9")
			.reverse()
			.map((a) => ({
				date: format(new Date(a.createdAt), "MMM d"),
				fullDate: format(new Date(a.createdAt), "MMM d, yyyy"),
				PHQ9: a.score,
			}));

		const gad7Data = assessments
			?.filter((a) => a.type.toLowerCase() === "gad7")
			.reverse()
			.map((a) => ({
				date: format(new Date(a.createdAt), "MMM d"),
				fullDate: format(new Date(a.createdAt), "MMM d, yyyy"),
				GAD7: a.score,
			}));

		const allDates = new Set([
			...phq9Data.map((d) => d.fullDate),
			...gad7Data.map((d) => d.fullDate),
		]);

		const combinedData = Array.from(allDates)
			.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
			.map((fullDate) => {
				const phq9Entry = phq9Data.find((d) => d.fullDate === fullDate);
				const gad7Entry = gad7Data.find((d) => d.fullDate === fullDate);
				return {
					date: format(new Date(fullDate), "MMM d"),
					fullDate,
					PHQ9: phq9Entry?.PHQ9,
					GAD7: gad7Entry?.GAD7,
				};
			});

		return { phq9Data, gad7Data, combinedData };
	}, [assessments]);

	const hasChartData = chartData.combinedData.length >= 2;

  
const getAssessmentIcon = (type) => {
	return type.toLowerCase().includes("phq") ? (
		<Heart className="h-4 w-4" />
	) : (
		<Brain className="h-4 w-4" />
	);
};

const getTrendIcon = (type) => {
	const typeAssessments = assessments.filter(
		(a) => a.type.toLowerCase() === type.toLowerCase()
	);
	if (typeAssessments.length < 2)
		return <Minus className="h-4 w-4 text-muted-foreground" />;

	const latest = typeAssessments[0].score;
	const previous = typeAssessments[1].score;

	if (latest < previous) return <TrendingDown className="h-4 w-4 text-sage" />;
	if (latest > previous)
		return <TrendingUp className="h-4 w-4 text-destructive" />;
	return <Minus className="h-4 w-4 text-muted-foreground" />;
};

	const latestPHQ9 = getLatestAssessment("phq9", assessments);
	const latestGAD7 = getLatestAssessment("gad7", assessments);

	return (
		<div>
			<div className="grid md:grid-cols-2 gap-4">
				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg flex items-center gap-2">
								<Heart className="h-5 w-5 text-lavender" />
								PHQ-9 (Depression)
							</CardTitle>
							{getTrendIcon("phq9")}
						</div>
					</CardHeader>
					<CardContent>
						{latestPHQ9 ? (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-3xl font-bold">{latestPHQ9.score}</span>
									<Badge className={getSeverityColor(latestPHQ9.severity)}>
										{latestPHQ9.severity}
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									Last taken:{" "}
									{format(new Date(latestPHQ9.createdAt), "MMM d, yyyy")}
								</p>
							</div>
						) : (
							<p className="text-muted-foreground">No assessments yet</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg flex items-center gap-2">
								<Brain className="h-5 w-5 text-sky" />
								GAD-7 (Anxiety)
							</CardTitle>
							{getTrendIcon("gad7")}
						</div>
					</CardHeader>
					<CardContent>
						{latestGAD7 ? (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-3xl font-bold">{latestGAD7.score}</span>
									<Badge className={getSeverityColor(latestGAD7.severity)}>
										{latestGAD7.severity}
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									Last taken:{" "}
									{format(new Date(latestGAD7.createdAt), "MMM d, yyyy")}
								</p>
							</div>
						) : (
							<p className="text-muted-foreground">No assessments yet</p>
						)}
					</CardContent>
				</Card>
			</div>

			{hasChartData && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							Score Trends Over Time
						</CardTitle>
						<CardDescription>
							Track your mental health progress with visual insights
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ChartContainer config={chartConfig} className="h-[300px] w-full">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={chartData.combinedData}
									margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
								>
									<defs>
										<linearGradient
											id="phq9Gradient"
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
											id="gad7Gradient"
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
										className="text-muted-foreground"
									/>
									<YAxis
										domain={[0, 27]}
										tick={{ fontSize: 12 }}
										tickLine={false}
										axisLine={false}
										className="text-muted-foreground"
									/>
									<Tooltip content={<ChartTooltipContent />} />
									<Legend />
									<Area
										type="monotone"
										dataKey="PHQ9"
										stroke="hsl(var(--lavender))"
										strokeWidth={2}
										fill="url(#phq9Gradient)"
										connectNulls
										dot={{
											fill: "hsl(var(--lavender))",
											strokeWidth: 2,
											r: 4,
										}}
										activeDot={{ r: 6, strokeWidth: 0 }}
									/>
									<Area
										type="monotone"
										dataKey="GAD7"
										stroke="hsl(var(--sky))"
										strokeWidth={2}
										fill="url(#gad7Gradient)"
										connectNulls
										dot={{
											fill: "hsl(var(--sky))",
											strokeWidth: 2,
											r: 4,
										}}
										activeDot={{ r: 6, strokeWidth: 0 }}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</ChartContainer>

						<div className="mt-4 pt-4 border-t border-border">
							<p className="text-sm text-muted-foreground mb-2">
								Severity Reference:
							</p>
							<div className="flex flex-wrap gap-3 text-xs">
								<div className="flex items-center gap-1.5">
									<div className="w-3 h-3 rounded-full bg-sage" />
									<span>Minimal (0-4)</span>
								</div>
								<div className="flex items-center gap-1.5">
									<div className="w-3 h-3 rounded-full bg-sky" />
									<span>Mild (5-9)</span>
								</div>
								<div className="flex items-center gap-1.5">
									<div className="w-3 h-3 rounded-full bg-peach" />
									<span>Moderate (10-14)</span>
								</div>
								<div className="flex items-center gap-1.5">
									<div className="w-3 h-3 rounded-full bg-destructive" />
									<span>Severe (15+)</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Assessment History
					</CardTitle>
					<CardDescription>
						Your past mental health assessment results
					</CardDescription>
				</CardHeader>
				<CardContent>
					{assessments?.length === 0 ? (
						<div className="text-center py-8">
							<Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<p className="text-muted-foreground mb-4">
								You haven't taken any assessments yet
							</p>
							<Button variant="hero" onClick={() => navigate("/assessments")}>
								Take Your First Assessment
							</Button>
						</div>
					) : (
						<ScrollArea className="h-[400px] pr-4">
							<div className="space-y-3">
								{assessments?.map((assessment) => (
									<div
										key={assessment.id}
										className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
									>
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
												{getAssessmentIcon(assessment?.type)}
											</div>
											<div>
												<p className="font-medium">
													{assessment?.type.toUpperCase()}
												</p>
												<p className="text-sm text-muted-foreground">
													{format(
														new Date(assessment?.createdAt),
														"MMM d, yyyy 'at' h:mm a"
													)}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<span className="text-lg font-semibold">
												{assessment?.score}
											</span>
											<Badge className={getSeverityColor(assessment?.severity)}>
												{assessment?.severity}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default Assessment;
