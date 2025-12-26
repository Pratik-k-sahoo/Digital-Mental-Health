import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Trash2 } from "lucide-react";
import { TrendingUpIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { History } from "lucide-react";
import { TrendingDown } from "lucide-react";
import { Minus } from "lucide-react";
import { format } from "date-fns";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import dataJSON from "@/assets/data.json";
import { Dot } from "lucide-react";
import useGetQuery from "@/hooks/useGetQuery";
import {
	clearAssessmentHistory as clearAssessmentHistoryApi,
	fetchAssessmentHistory,
} from "@/lib/apiServices";
import useAppMutation from "@/hooks/useAppMutation";
import { toast } from "sonner";

const AssessmentHistory = () => {
	const {
		isPending: fetchPending,
		isError: isFetchError,
		data,
		error: fetchError,
	} = useGetQuery({
		queryKey: ["assessments"],
		queryFn: fetchAssessmentHistory,
		staleTime: 1 * 60 * 1000,
	});

	const {
		mutate: clearHistory,
		isPending: clearPending,
		isError: isClearError,
		error: clearError,
	} = useAppMutation({
		mutationFn: clearAssessmentHistoryApi,
		invalidateQueries: ["assessments", "history"],
		onSuccess: (data) => {
			toast.success(
				data?.message || "Assessment history cleared successfully."
			);
		},
		onError: (error) => {
			console.error(error);
			toast.error(error?.message || "Failed to clear assessment history.");
		},
	});

	const phq9History = data?.filter((h) => h?.type === "PHQ9");
	const gad7History = data?.filter((h) => h?.type === "GAD7");

	const getTrend = (items) => {
		if (items?.length < 2) return null;
		const latest = items?.[0]?.score;
		const prev = items?.[1]?.score;
		if (latest < prev) return "improving";
		if (latest > prev) return "declining";
		return "stable";
	};

	const phq9Trend = getTrend(phq9History);
	const gad7Trend = getTrend(gad7History);

	const getSeverityColor = (key) => {
		if (key?.includes("minimal")) return "text-green-600";
		if (key?.includes("mild")) return "text-blue-600";
		if (key?.includes("moderate") && !key?.includes("severe"))
			return "text-yellow-600";
		if (key?.includes("moderately_severe")) return "text-orange-600";
		return "text-red-600";
	};

	const TrendIcon = ({ trend }) => {
		console.log(trend);
		if (trend === "improving")
			return <TrendingDown className="h-4 w-4 text-green-600" />;
		if (trend === "declining")
			return <TrendingUpIcon className="h-4 w-4 text-red-600" />;
		if (trend === "stable")
			return <Minus className="h-4 w-4 text-yellow-600" />;
		return null;
	};

	if (isFetchError) {
		return <p>{fetchError?.message}</p>;
	}

	if (isClearError) {
		return <p>{clearError?.message}</p>;
	}

	if (fetchPending) {
		return (
			<Card className="text-center py-12">
				<CardContent className="flex items-center justify-center w-fit mx-auto">
					<Dot className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-bounce delay-0" />
					<Dot className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-bounce delay-75" />
					<Dot className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-bounce delay-100" />
					<span className="text-muted-foreground font-bold font-mono animate-bounce delay-150">
						Fetching History
					</span>
				</CardContent>
			</Card>
		);
	}

	if (clearPending) {
		return (
			<Card className="text-center py-12">
				<CardContent className="flex items-center justify-center w-fit mx-auto">
					<Dot className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-bounce delay-0" />
					<Dot className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-bounce delay-75" />
					<Dot className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-bounce delay-100" />
					<span className="text-muted-foreground font-bold font-mono animate-bounce delay-150">
						Clearing History
					</span>
				</CardContent>
			</Card>
		);
	}

	if (data?.length === 0) {
		return (
			<Card className="text-center py-12">
				<CardContent>
					<History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
					<p className="text-muted-foreground">No History</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid md:grid-cols-2 gap-4">
				<Card className="border-sky/30 bg-sky/5">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg flex items-center gap-2">
							<Brain className="h-5 w-5 text-sky" />
							PHQ-9 History
							<TrendIcon trend={phq9Trend} />
						</CardTitle>
					</CardHeader>
					<CardContent>
						{phq9History?.length > 0 ? (
							<div className="space-y-1">
								<p className="text-2xl font-bold">
									{phq9History?.[0]?.score}/27
								</p>
								<p
									className={cn(
										"text-sm",
										getSeverityColor(phq9History?.[0]?.severity)
									)}
								>
									{phq9History?.[0]?.severity}
								</p>
								<p className="text-xs text-muted-foreground">
									{format(new Date(phq9History?.[0]?.createdAt), "MMM d, yyyy")}
								</p>
							</div>
						) : (
							<p className="text-muted-foreground text-sm">No History</p>
						)}
					</CardContent>
				</Card>

				<Card className="border-lavender/30 bg-lavender/5">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg flex items-center gap-2">
							<Heart className="h-5 w-5 text-lavender" />
							GAD-7 History
							<TrendIcon trend={gad7Trend} />
						</CardTitle>
					</CardHeader>
					<CardContent>
						{gad7History?.length > 0 ? (
							<div className="space-y-1">
								<p className="text-2xl font-bold">
									{gad7History?.[0]?.score}/21
								</p>
								<p
									className={cn(
										"text-sm",
										getSeverityColor(gad7History?.[0]?.severity)
									)}
								>
									{gad7History?.[0]?.severity}
								</p>
								<p className="text-xs text-muted-foreground">
									{format(new Date(gad7History?.[0]?.createdAt), "MMM d, yyyy")}
								</p>
							</div>
						) : (
							<p className="text-muted-foreground text-sm">No History</p>
						)}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<History className="h-5 w-5" />
						History
					</CardTitle>
					<Drawer>
						<DrawerTrigger className="text-destructive cursor-pointer flex hover:bg-accent py-2 px-3 rounded-xl items-center hover:text-accent-foreground">
							<Trash2 className="h-4 w-4 mr-2" />
							Clear History
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>Are you absolutely sure?</DrawerTitle>
								<DrawerDescription>
									This action cannot be undone.
								</DrawerDescription>
							</DrawerHeader>
							<DrawerFooter>
								<Button
									onClick={clearHistory}
									className="w-fit mx-auto cursor-pointer"
								>
									Submit
								</Button>
								<DrawerClose>
									<Button variant="outline" className="cursor-pointer">
										Cancel
									</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[300px]">
						<div className="space-y-3">
							{data?.map((item) => (
								<div
									key={item.id}
									className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
								>
									<div className="flex items-center gap-3">
										{item.type === "PHQ9" ? (
											<Brain className="h-5 w-5 text-sky" />
										) : (
											<Heart className="h-5 w-5 text-lavender" />
										)}
										<div>
											<Drawer>
												<DrawerTrigger className="font-medium cursor-pointer">
													{item.type === "PHQ9" ? "PHQ-9" : "GAD-7"}{" "}
													<span className="text-black/50 hover:underline">
														{"(click here to see details)"}
													</span>
												</DrawerTrigger>
												<DrawerContent>
													<DrawerHeader>
														<DrawerTitle>Detailed Answer</DrawerTitle>
														<DrawerDescription>
															This answers cannot be edited.
														</DrawerDescription>
													</DrawerHeader>
													<div className="flex flex-col items-start justify-center w-fit mx-auto">
														{item?.answers?.map((answer, idx) => (
															<div
																key={idx}
																className="flex items-center justify-center"
															>
																<p className="font-semibold text-red-500">
																	<span className="text-black">
																		Q{idx + 1}:
																	</span>
																	{
																		dataJSON[
																			`${item.type.toLowerCase()}.q${idx + 1}`
																		]
																	}
																	?
																</p>
																<p className="font-semibold text-blue-500">
																	<span className="text-black"> - </span>
																	{dataJSON[`ans.${answer + 1}`]}
																</p>
															</div>
														))}
													</div>
													<DrawerFooter>
														<DrawerClose>
															<Button
																variant="outline"
																className="cursor-pointer"
															>
																Close
															</Button>
														</DrawerClose>
													</DrawerFooter>
												</DrawerContent>
											</Drawer>
											<p
												className={cn(
													"text-sm",
													getSeverityColor(item?.severity)
												)}
											>
												{item?.severity}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-bold">
											{item.score}/{item.type === "PHQ9" ? 27 : 21}
										</p>
										<p className="text-xs text-muted-foreground">
											{format(new Date(item?.createdAt), "MMM d, yyyy")}
										</p>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
};

export default AssessmentHistory;
