import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetQuery from "@/hooks/useGetQuery";
import { fetchAIAnalysis, fetchAppliedPeers } from "@/lib/apiServices";
import { Loader2 } from "lucide-react";
import { Users } from "lucide-react";
import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { User } from "lucide-react";
import { Globe } from "lucide-react";
import { Mail } from "lucide-react";
import { Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Sparkles } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { FileText } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { XCircle } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Brain } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AiAnalysisPanel from "./AiAnalysisPanel";
import PeerApplicationStatus from "./PeerApplicationStatus";

function FormDataSection({ label, value, icon: Icon }) {
	if (!value) return null;
	const display =
		typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
	return (
		<div className="space-y-1">
			<Label className="text-sm font-medium flex items-center gap-1.5">
				{Icon && <Icon className="h-3.5 w-3.5 text-primary" />} {label}
			</Label>
			<p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
				{display}
			</p>
		</div>
	);
}

const PeersApplied = () => {
	const { user } = useSelector((state) => state.auth);
	const {
		data: applications,
		isLoading,
		isError,
		error,
	} = useGetQuery({
		queryKey: ["applied-peers"],
		queryFn: fetchAppliedPeers,
		staleTime: 5 * 60 * 1000,
		cacheTime: 10 * 60 * 1000,
	});

	const [selectedApp, setSelectedApp] = useState(null);
	const [actionType, setActionType] = useState(null);
	const [expandedIds, setExpandedIds] = useState(null);
	const [aiResults, setAiResults] = useState({});
	const [isAiAnalysisLoading, setIsAiAnalysisLoading] = useState({});
	const [statusFilter, setStatusFilter] = useState("all");

	const toggleExpanded = (id) => {
		setExpandedIds((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const handleAIAnalyze = async (id) => {
		setIsAiAnalysisLoading((prev) => ({
			...prev,
			[id]: true,
		}));
		delete aiResults[id];
		setTimeout(async () => {
			try {
				const result = await fetchAIAnalysis(id);
				setAiResults((prev) => ({
					...prev,
					[id]: result,
				}));
				console.log(result);
			} catch (error) {
				console.error("AI analysis failed", error);
			} finally {
				setIsAiAnalysisLoading((prev) => ({
					...prev,
					[id]: false,
				}));
			}
		}, 6000);
	};

	const filteredApplications = useMemo(() => {
		return applications?.filter(
			(app) => statusFilter === "all" || app.status === statusFilter,
		);
	}, [applications, statusFilter]);

	const getStatusBadge = (status) => {
		switch (status) {
			case "approved":
				return <Badge className="bg-green-500">Approved</Badge>;
			case "rejected":
				return <Badge variant="destructive">Rejected</Badge>;
			default:
				return (
					<Badge variant="secondary">
						<Clock className="h-3 w-3 mr-1" />
						Pending
					</Badge>
				);
		}
	};

	const renderFormData = (fd) => {
		let responses = {};
		fd.map((res) => (responses = { ...responses, ...res.responses }));
		console.log(responses);
		const sections = [
			{
				title: "Basic Info",
				icon: User,
				fields: [
					{ label: "Full Name", value: responses.fullName },
					{ label: "Age", value: responses.age },
					{ label: "Country", value: responses.country },
					{ label: "Timezone", value: responses.timeZone },
					{
						label: "Languages",
						value: responses.languages?.join?.(", ") || fd.languages,
					},
					{
						label: "Availability",
						value: responses.availability
							? `${responses.availability.weekdays ? "Weekdays" : ""}${responses.availability.weekdays && responses.availability.weekends ? ", " : ""}${responses.availability.weekends ? "Weekends" : ""} | ${responses.availability.timePreference?.join?.(", ") || ""}`
							: undefined,
					},
					{ label: "Hours/Week", value: responses.hoursPerWeek },
				],
			},
			{
				title: "Motivation",
				icon: Sparkles,
				fields: [
					{ label: "Why Volunteer", value: responses.whyVolunteer },
					{
						label: "Peer Support Meaning",
						value: responses.peerSupportMeaning,
					},
					{ label: "How Users Should Feel", value: responses.userFeelingGoal },
				],
			},
			{
				title: "Lived Experience",
				icon: Heart,
				fields: [
					{
						label: "Experienced Challenges",
						value:
							responses.experiencedChallenges != null
								? responses.experiencedChallenges
									? "Yes"
									: "No"
								: undefined,
					},
					{ label: "Emotionally Stable Now", value: responses.stableNow },
					{ label: "Coping Methods", value: responses.copingMethods },
				],
			},
			{
				title: "Boundaries",
				icon: ShieldCheck,
				fields: [
					{ label: "Dependency Handling", value: responses.dependencyHandling },
					{
						label: "Qualified Advice Handling",
						value: responses.qualifiedAdviceHandling,
					},
					{
						label: "Comfortable Referring",
						value:
							responses.comfortableReferring != null
								? responses.comfortableReferring
									? "Yes"
									: "No"
								: undefined,
					},
					{ label: "Healthy Boundaries", value: responses.healthyBoundaries },
				],
			},
			{
				title: "Scenarios",
				icon: AlertTriangle,
				fields: [
					{ label: "Crisis Situation", value: responses.scenario1 },
					{ label: "Boundary Testing", value: responses.scenario2 },
					{ label: "Emotional Burnout", value: responses.scenario3 },
				],
			},
			{
				title: "Communication",
				icon: MessageCircle,
				fields: [
					{ label: "Showing Empathy", value: responses.showEmpathy },
					{ label: "Comfortable Style", value: responses.comfortableStyle },
					{
						label: "Phrases to Avoid",
						value:
							responses.avoidPhrases?.join?.(", ") || responses.avoidPhrases,
					},
				],
			},
			{
				title: "Agreements",
				icon: FileText,
				fields: [
					{
						label: "Training Consent",
						value:
							responses.trainingConsent != null
								? responses.trainingConsent
									? "✅ Agreed"
									: "❌ Not agreed"
								: undefined,
					},
					{
						label: "Rule Consent",
						value:
							responses.ruleConsent != null
								? responses.ruleConsent
									? "✅ Agreed"
									: "❌ Not agreed"
								: undefined,
					},
					{
						label: "Not Therapy Agreement",
						value:
							responses.notTherapyAgreement != null
								? responses.notTherapyAgreement
									? "✅ Agreed"
									: "❌ Not agreed"
								: undefined,
					},
					{
						label: "Moderation Consent",
						value:
							responses.moderationConsent != null
								? responses.moderationConsent
									? "✅ Agreed"
									: "❌ Not agreed"
								: undefined,
					},
				],
			},
		];

		return (
			<div className="space-y-4">
				{sections.map((section) => {
					const hasData = section.fields.some(
						(f) => f.value != null && f.value !== "" && f.value !== undefined,
					);
					if (!hasData) return null;
					return (
						<div key={section.title}>
							<h5 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
								<section.icon className="h-4 w-4 text-primary" />{" "}
								{section.title}
							</h5>
							<div className="grid gap-2">
								{section.fields.map((f) =>
									f.value != null && f.value !== "" && f.value !== undefined ? (
										<FormDataSection
											key={f.label}
											label={f.label}
											value={f.value}
										/>
									) : null,
								)}
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" /> Peer Applications
						</CardTitle>
						<p className="text-sm text-muted-foreground mt-1">
							Review applications with AI-powered analysis
						</p>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						{["all", "submitted", "approved", "rejected"].map((filter) => (
							<Button
								key={filter}
								variant={statusFilter === filter ? "default" : "outline"}
								size="sm"
								onClick={() => setStatusFilter(filter)}
							>
								{filter.charAt(0).toUpperCase() + filter.slice(1)}
								{filter !== "all" && (
									<Badge variant="secondary" className="ml-2">
										{applications?.filter((a) => a.status === filter).length}
									</Badge>
								)}
							</Button>
						))}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				) : filteredApplications.length === 0 ? (
					<div className="text-center py-12">
						<Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
						<h3 className="text-lg font-medium mb-2">No applications found</h3>
						<p className="text-muted-foreground">
							{statusFilter === "pending"
								? "No pending applications to review"
								: `No ${statusFilter} applications`}
						</p>
					</div>
				) : (
					<ScrollArea className="h-[600px]">
						<div className="space-y-4">
							<AnimatePresence>
								{filteredApplications.map((app) => (
									<motion.div
										key={app.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
									>
										<Card>
											<Collapsible
												open={expandedIds && expandedIds?.has(app.id)}
												onOpenChange={() => toggleExpanded(app.id)}
											>
												<CardContent className="pt-4">
													<div className="flex items-start justify-between">
														<div className="space-y-2 flex-1">
															<div className="flex items-center gap-3">
																<User className="h-5 w-5 text-muted-foreground" />
																<span className="font-semibold text-lg">
																	{app?.StepResponses[0]?.responses?.fullName ||
																		app?.User?.fullName ||
																		"Anonymous User"}
																</span>
																{getStatusBadge(app.status)}
																{app?.StepResponses[0]?.responses?.country && (
																	<span className="text-xs text-muted-foreground flex items-center gap-1">
																		<Globe className="h-3 w-3" />
																		{app?.StepResponses[0]?.responses?.country}
																	</span>
																)}
															</div>
															{app.User?.email && (
																<div className="flex items-center gap-2 text-sm text-muted-foreground">
																	<Mail className="h-4 w-4" />
																	{app?.User?.email}
																</div>
															)}
															<div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
																<span className="flex items-center gap-1">
																	<Clock className="h-4 w-4" />
																	Applied{" "}
																	{formatDistanceToNow(
																		new Date(app.updatedAt),
																		{ addSuffix: true },
																	)}
																</span>
																{app?.StepResponses[0]?.responses
																	?.hoursPerWeek && (
																	<span className="flex items-center gap-1">
																		<Sparkles className="h-4 w-4" />
																		{
																			app?.StepResponses[0]?.responses
																				?.hoursPerWeek
																		}{" "}
																		hrs/week
																	</span>
																)}
																{aiResults[app.id] && (
																	<Badge
																		variant="outline"
																		className="flex items-center gap-1"
																	>
																		<Brain className="h-3 w-3" /> Score:{" "}
																		{aiResults[app.id].confidenceScore}/10
																	</Badge>
																)}
															</div>
														</div>
														<div className="flex items-center gap-2 flex-wrap">
															<Button
																size="sm"
																variant="outline"
																onClick={(e) => {
																	e.stopPropagation();
																	handleAIAnalyze(app.id);
																}}
																disabled={isAiAnalysisLoading[app.id]}
															>
																{isAiAnalysisLoading[app.id] ? (
																	<Loader2 className="h-4 w-4 animate-spin mr-1" />
																) : (
																	<Brain className="h-4 w-4 mr-1" />
																)}
																{isAiAnalysisLoading[app.id]
																	? "Analysing"
																	: aiResults[app.id]
																		? "Re-analyze"
																		: "Analyze"}
															</Button>
															{app.status === "submitted" && (
																<>
																	<Button
																		size="sm"
																		variant="outline"
																		className="text-destructive hover:text-destructive"
																		onClick={() => {
																			setSelectedApp(app);
																			setActionType("reject");
																		}}
																	>
																		<XCircle className="h-4 w-4 mr-1" />
																		Reject
																	</Button>
																	<Button
																		size="sm"
																		onClick={() => {
																			setSelectedApp(app);
																			setActionType("approve");
																		}}
																	>
																		<CheckCircle className="h-4 w-4 mr-1" />
																		Approve
																	</Button>
																</>
															)}
															<CollapsibleTrigger asChild>
																<Button variant="ghost" size="sm">
																	{expandedIds && expandedIds.has(app.id) ? (
																		<ChevronUp className="h-4 w-4" />
																	) : (
																		<ChevronDown className="h-4 w-4" />
																	)}
																</Button>
															</CollapsibleTrigger>
														</div>
													</div>

													<CollapsibleContent>
														<motion.div
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															className="mt-6 space-y-4 border-t pt-4"
														>
															{aiResults[app.id] && (
																<>
																	<AiAnalysisPanel
																		analysis={aiResults[app.id]}
																	/>
																	<Separator />
																</>
															)}
															{app?.StepResponses &&
																renderFormData(app.StepResponses)}

															{app.admin_notes && (
																<FormDataSection
																	label="Admin Notes"
																	value={app.admin_notes}
																/>
															)}
															{app.reviewed_at && (
																<p className="text-xs text-muted-foreground">
																	Reviewed on{" "}
																	{format(new Date(app.reviewed_at), "PPP")}
																</p>
															)}
														</motion.div>
													</CollapsibleContent>
												</CardContent>
											</Collapsible>
										</Card>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</ScrollArea>
				)}
				<PeerApplicationStatus
					actionType={actionType}
					setActionType={setActionType}
					selectedApp={selectedApp}
				/>
			</CardContent>
		</Card>
	);
};

export default PeersApplied;
