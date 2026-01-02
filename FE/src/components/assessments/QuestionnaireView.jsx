import { getGad7Result, getPhq9Result } from "@/lib/getScores";
import React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import data from "@/assets/data.json";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import useAppMutation from "@/hooks/useAppMutation";
import { createAssessment as createAssessmentApi } from "@/lib/apiServices";

const QuestionnaireView = ({ type, setResult, setSelectedAssessment }) => {
	const {
		mutate: createAssessment,
		isPending,
		isError,
		error,
	} = useAppMutation({
		mutationFn: createAssessmentApi,
		invalidateQueries: ["assessments"],
		onSuccess: (data) => {
			console.log(data);
			toast.success(data.message || "Assessment saved successfully.");
		},
		onError: (error) => {
			console.error(error);
			toast.error(error?.message || "Failed to save assessment.");
		},
	});

	const questionKeys =
		type === "phq9"
			? [
					"phq9.q1",
					"phq9.q2",
					"phq9.q3",
					"phq9.q4",
					"phq9.q5",
					"phq9.q6",
					"phq9.q7",
					"phq9.q8",
					"phq9.q9",
			  ]
			: [
					"gad7.q1",
					"gad7.q2",
					"gad7.q3",
					"gad7.q4",
					"gad7.q5",
					"gad7.q6",
					"gad7.q7",
			  ];

	const answerOptions = [
		{ value: "0", label: data["answer.notAtAll"], score: 0 },
		{ value: "1", label: data["answer.severalDays"], score: 1 },
		{ value: "2", label: data["answer.moreThanHalf"], score: 2 },
		{ value: "3", label: data["answer.nearlyEveryDay"], score: 3 },
	];

	const [currQuestion, setCurrQuestion] = useState(0);
	const [answers, setAnswers] = useState(
		new Array(questionKeys.length).fill(-1)
	);

	const handleAnswer = (ans) => {
		const newAnswer = [...answers];
		newAnswer[currQuestion] = parseInt(ans);
		setAnswers(newAnswer);
	};

	const handleNext = () => {
		if (currQuestion < questionKeys.length - 1)
			setCurrQuestion((prev) => prev + 1);
		else {
			const totalScore = answers.reduce((sum, score) => sum + score, 0);
			const resultData =
				type === "phq9" ? getPhq9Result(totalScore) : getGad7Result(totalScore);
			handleComplete({ type, answers, ...resultData });
		}
	};

	const handlePrevious = () => {
		if (currQuestion > 0) {
			setCurrQuestion((prev) => prev - 1);
		}
	};

	const handleComplete = async (assessmentResult) => {
		setResult(assessmentResult);
		await createAssessment({
			type: assessmentResult.type.toUpperCase(),
			answers: assessmentResult.answers,
		});
	};

	const handleBackToAssessments = () => {
		setSelectedAssessment(null);
		setResult(null);
	};

	const progress = ((currQuestion + 1) / questionKeys.length) * 100;
	const isAnswered = answers[currQuestion] !== -1;
	return (
		<div className="max-w-2xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<Button
					variant="ghost"
					onClick={handleBackToAssessments}
					className="gap-2"
				>
					<ArrowLeft className="w-4 h-4" /> Back To Assessments
				</Button>
				<span className="text-sm text-muted-foreground">
					Question {currQuestion + 1} of {questionKeys.length}
				</span>
			</div>
			<Progress value={progress} className="mb-8 h-2" />

			<Card className="border-2 border-primary/20">
				<CardHeader>
					<CardTitle className="text-lg font-medium text-muted-foreground">
						Over the last 2 weeks, how often have you been bothered by:
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-xl font-medium text-foreground leading-relaxed">
						{data[questionKeys[currQuestion]]}
					</p>

					<RadioGroup
						value={
							answers[currQuestion] !== -1
								? answers[currQuestion].toString()
								: ""
						}
						onValueChange={handleAnswer}
						className="space-y-3"
					>
						{answerOptions.map((option) => (
							<div
								key={option.value}
								className={cn(
									"flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
									answers[currQuestion].toString() === option.value
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50 hover:bg-muted/50"
								)}
							>
								<RadioGroupItem
									value={option.value}
									id={`option-${option.value}`}
								/>
								<Label
									htmlFor={`option-${option.value}`}
									className="flex-1 cursor-pointer text-base"
								>
									{option.label}
								</Label>
							</div>
						))}
					</RadioGroup>

					<div className="flex flex-col md:flex-row gap-3 pt-4">
						<Button
							variant="outline"
							onClick={handlePrevious}
							disabled={currQuestion === 0}
							className="flex-1"
						>
							<ArrowLeft className="mr-2 h-4 w-4" /> Previous
						</Button>
						<Button
							variant="hero"
							onClick={handleNext}
							disabled={!isAnswered}
							className="flex-1"
						>
							{currQuestion === questionKeys.length - 1 ? "See Result" : "Next"}
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</CardContent>
			</Card>

			{type === "phq9" && currQuestion === 8 && (
				<Alert className="mt-6 border-orange-200 bg-orange-50">
					<AlertTriangle className="h-5 w-5 text-orange-600" />
					<AlertTitle className="text-orange-800">Important Notes: </AlertTitle>
					<AlertDescription className="text-orange-700">
						Self Harm Warning
					</AlertDescription>
				</Alert>
			)}

			{isPending && toast("Saving you assessments")}
			{isError && <p className="text-destructive">{error}</p>}
		</div>
	);
};

export default QuestionnaireView;
