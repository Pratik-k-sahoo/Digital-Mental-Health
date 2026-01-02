import { Info } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Phone } from "lucide-react";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";
import data from "@/assets/data.json"

const ResultsView = ({ result, setResult, setSelectedAssessment }) => {
	const assessmentName = result.type === "phq9" ? "PHQ-9" : "GAD-7";
	const maxScore = result.type === "phq9" ? 27 : 21;

	const handleRetake = () => setResult(null);

	const handleBackToAssessments = () => {
		setSelectedAssessment(null);
		setResult(null);
	};

	const getSeverityIcon = () => {
		if (result?.score <= 4)
			return <CheckCircle2 className="h-8 w-8 text-green-600" />;
		else if (result?.score <= 9)
			return <Info className="h-8 w-8 text-yellow-600" />;
		else if (result?.score <= 14)
			return <AlertTriangle className="h-8 w-8 text-orange-600" />;
		return <AlertTriangle className="h-8 w-8 text-red-600" />;
	};
	return (
		<div className="max-w-2xl mx-auto">
			<Card className="border-2 border-primary/20 overflow-hidden py-0">
				<div className="bg-linear-to-r from-sage to-sage-light p-6">
					<h2 className="text-2xl font-bold text-foregroundmb-2">
						Your Assessment Results
					</h2>
					<p className="text-muted">{assessmentName}</p>
				</div>
				<CardContent className="p-6 space-y-6">
					<div className="flex items-center gap-4 p-6 rounded-2xl bg-muted/50">
						{getSeverityIcon()}
						<div>
							<p className="text-sm text-muted-foreground mb-1">Your Score</p>
							<p className="text-3xl font-bold text-foreground">
								{result.score}{" "}
								<span className="text-lg text-muted-foreground">
									/ {maxScore}
								</span>
							</p>
							<p className={cn("text-lg font-semibold", result.color)}>
								{data[result.severity]}
							</p>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<Heart className="h-5 w-5 text-primary" />
							Personalized Recommendations
						</h3>
						<ul className="space-y-3">
							{result.recommendationKeys.map((key, idx) => (
								<li key={idx} className="flex gap-3 text-muted-foreground">
									<span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">
										{idx + 1}
									</span>
									{data[key]}
								</li>
							))}
						</ul>
					</div>

					{result.score >= 10 && (
						<Alert className="border-primary/30 bg-primary/15">
							<Phone className="h-5 w-5 text-primary" />
							<AlertTitle>Need to Talk?</AlertTitle>
							<AlertDescription>
								Our campus counsellors are here to help. Book an appointment or
								use our 24/7 chat support for immediate assistance.
							</AlertDescription>
						</Alert>
					)}

					<div className="flex md:flex-row flex-col gap-3 pt-4">
						<Button variant="outline" onClick={handleRetake} className="flex-1">
							<RotateCcw className="mr-2 h-4 w-4" />
							Retake Assessment
						</Button>
						<Button
							variant="hero"
							onClick={handleBackToAssessments}
							className="flex-1"
						>
							Take Another Assessment
						</Button>
					</div>
				</CardContent>
			</Card>
			<div className="mt-6 text-center text-sm text-muted-foreground">
				<p>
					<strong>Disclaimer: </strong>This screening tool is for educational
					purposes only and is not a substitute for professional diagnosis.
					Please consult a mental health professional for proper evaluation.
				</p>
			</div>
		</div>
	);
};

export default ResultsView;
