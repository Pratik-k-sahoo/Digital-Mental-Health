import useAppMutation from "@/hooks/useAppMutation";
import { updateAlertThreshold as updateAlertThresholdApi } from "@/lib/apiServices";
import { login } from "@/redux/slice/authSlice";
import { Activity } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Calendar } from "lucide-react";
import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { Settings } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "./ui/field";

const AlertThresholdsPanel = ({
	stats,
	severeAssessmentsCount,
	moderateSevereCount,
	avgPHQ9Score,
	avgGAD7Score,
}) => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const [isOpen, setIsOpen] = useState(false);
	const form = useForm({
		defaultValues: {
			...user?.threshold,
		},
	});

	const {
		formState: { dirtyFields, isDirty },
		reset,
	} = form;

	const { mutate: updateAlertThreshold } = useAppMutation({
		mutationFn: updateAlertThresholdApi,
		invalidateQueries: {
			queryKey: ["adminDashboard", "threshold"],
		},
		onSuccess: (data) => {
			dispatch(login(data?.user));
			reset(data?.user?.threshold);
		},
	});

	const saveThreshold = async (e) => {
		const payload = {};
		Object.keys(dirtyFields).forEach((key) => {
			const value = e[key];

			if (typeof value === "string" && value !== "")
				payload[key] = Number(value);
			else payload[key] = value;
		});

		if (Object.keys(payload).length === 0) {
			setIsOpen(false);
			return;
		}
		await updateAlertThreshold(e);
		setIsOpen(false);
	};

	const alerts = useMemo(
		() => [
			{
				id: "pendingAppointments",
				name: "Pending Appointments",
				description: "Number of unconfirmed appointment requests",
				currentValue: stats?.pendingAppointments,
				threshold: user?.threshold?.pendingAppointments,
				type:
					stats?.pendingAppointments >= user?.threshold?.pendingAppointments
						? "critical"
						: "warning",
				enabled: user?.threshold?.enablePendingAppointments,
				icon: Calendar,
			},
			{
				id: "severeAssessments",
				name: "Severe Assessments",
				description: "Users with severe assessment scores",
				currentValue: severeAssessmentsCount,
				threshold: user?.threshold?.severeAssessments,
				type:
					severeAssessmentsCount >= user?.threshold?.severeAssessments
						? "critical"
						: "warning",
				enabled: user?.threshold?.enableSevereAssessments,
				icon: AlertTriangle,
			},
			{
				id: "moderateSevereAssessments",
				name: "Moderate-Severe Assessments",
				description: "Users with moderate to severe scores",
				currentValue: moderateSevereCount,
				threshold: user?.threshold?.moderateSevereAssessments,
				type:
					moderateSevereCount >= user?.threshold?.moderateSevereAssessments
						? "critical"
						: "warning",
				enabled: user?.threshold?.enableModerateSevereAssessments,
				icon: Activity,
			},
			{
				id: "avgPHQ9Score",
				name: "Average PHQ-9 Score",
				description: "Population average depression score",
				currentValue: avgPHQ9Score,
				threshold: user?.threshold?.avgPHQ9Score,
				type:
					avgPHQ9Score >= user?.threshold?.avgPHQ9Score
						? "critical"
						: "warning",
				enabled: user?.threshold?.enableAvgPHQ9Score,
				icon: TrendingUp,
			},
			{
				id: "avgGAD7Score",
				name: "Average GAD-7 Score",
				description: "Population average anxiety score",
				currentValue: avgGAD7Score,
				threshold: user?.threshold?.avgGAD7Score,
				type:
					avgGAD7Score >= user?.threshold?.avgGAD7Score
						? "critical"
						: "warning",
				enabled: user?.threshold?.enableAvgGAD7Score,
				icon: TrendingUp,
			},
		],
		[
			stats,
			severeAssessmentsCount,
			moderateSevereCount,
			avgPHQ9Score,
			avgGAD7Score,
			user,
		]
	);

	const activeAlerts = alerts.filter(
		(alert) => alert.enabled && alert.currentValue >= alert.threshold
	);

	const criticalCount = activeAlerts.filter(
		(a) => a.type === "critical"
	).length;

	const warningCount = activeAlerts.filter((a) => a.type === "warning").length;

	return (
		<Card className="border-l-4 border-l-destructive/50">
			<CardHeader className="pb-3">
				<div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="p-2 rounded-lg bg-destructive/10">
							<Bell className="h-5 w-5 text-destructive" />
						</div>
						<div>
							<CardTitle className="text-lg">Alert Thresholds</CardTitle>
							<CardDescription>
								Monitor key metrics and receive alerts
							</CardDescription>
						</div>
					</div>
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Button variant="outline" size="sm" className="gap-2">
								<Settings className="h-4 w-4" />
								Configure
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle>Configure Alert Thresholds</DialogTitle>
								<DialogDescription>
									Set custom thresholds for monitoring key metrics
								</DialogDescription>
							</DialogHeader>
							<form
								id="threshold-form"
								onSubmit={form.handleSubmit(saveThreshold)}
							>
								<FieldGroup>
									<div className="space-y-4 py-4">
										{alerts.map((alert) => (
											<div
												key={alert?.id}
												className="flex items-center justify-between gap-4"
											>
												<Controller
													name={`enable${
														alert?.id?.charAt(0).toUpperCase() +
														alert?.id?.slice(1)
													}`}
													control={form.control}
													render={({ field, fieldState }) => (
														<div className="flex items-center gap-3 flex-1">
															<Switch
																onCheckedChange={field.onChange}
																aria-invalid={fieldState.invalid}
																checked={field.value}
															/>
															<div className="flex-1">
																<Label className="text-sm font-medium">
																	{alert.name}
																</Label>
																<p className="text-xs text-muted-foreground">
																	{alert.description}
																</p>
															</div>
														</div>
													)}
												/>
												<Controller
													name={alert?.id}
													className="border border-red-500"
													control={form.control}
													render={({ field, fieldState }) => (
														<Field
															data-invalid={fieldState.invalid}
															className="w-20"
														>
															<Input
																{...field}
																aria-invalid={fieldState.invalid}
																type="number"
																className="w-20"
																min={0}
															/>
														</Field>
													)}
												/>
											</div>
										))}
									</div>
									<div className="flex justify-end gap-2">
										<Button
											type="button"
											variant="outline"
											onClick={() => setIsOpen(false)}
										>
											Cancel
										</Button>
										<Button type="submit" disabled={!isDirty}>
											Save Thresholds
										</Button>
									</div>
								</FieldGroup>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</CardHeader>
			<CardContent>
				{activeAlerts.length === 0 ? (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<div className="w-2 h-2 rounded-full bg-green-500" />
						All metrics within normal thresholds
					</div>
				) : (
					<div className="space-y-3">
						<div className="flex gap-2">
							{criticalCount > 0 && (
								<Badge variant="destructive" className="gap-1">
									<AlertTriangle className="h-3 md:w-3 " />
									{criticalCount} Critical
								</Badge>
							)}
							{warningCount > 0 && (
								<Badge
									variant="secondary"
									className="gap-1 bg-yellow-500/20 text-yellow-700"
								>
									{warningCount} Warning
								</Badge>
							)}
						</div>
						<div className="space-y-2">
							{activeAlerts.map((alert) => (
								<div
									key={alert.id}
									className={`flex items-center justify-between p-3 rounded-lg ${
										alert.type === "critical"
											? "bg-destructive/10 border border-destructive/20"
											: "bg-yellow-500/10 border border-yellow-500/20"
									}`}
								>
									<div className="flex items-center gap-3">
										<alert.icon
											className={`h-4 w-4 ${
												alert.type === "critical"
													? "text-destructive"
													: "text-yellow-600"
											}`}
										/>
										<div>
											<p className="text-sm font-medium">{alert.name}</p>
											<p className="text-xs text-muted-foreground">
												{alert.description}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p
											className={`text-lg font-bold ${
												alert.type === "critical"
													? "text-destructive"
													: "text-yellow-600"
											}`}
										>
											{alert.currentValue}
										</p>
										<p className="text-xs text-muted-foreground">
											Threshold: {alert.threshold}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default AlertThresholdsPanel;
