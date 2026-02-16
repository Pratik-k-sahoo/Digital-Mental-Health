import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Heart } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import StepBasicInfo from "./peer-steps/StepBasicInfo";
import StepMotivation from "./peer-steps/StepMotivation";
import StepLivedExperience from "./peer-steps/StepLivedExperience";
import StepBoundaries from "./peer-steps/StepBoundaries";
import StepScenarios from "./peer-steps/StepScenarios";
import StepCommunication from "./peer-steps/StepCommunication";
import StepAgreement from "./peer-steps/StepAgreement";
import { useForm } from "react-hook-form";
import { Badge } from "../ui/badge";
import { Save } from "lucide-react";
import useGetQuery from "@/hooks/useGetQuery";
import { useSelector } from "react-redux";
import {
	createPeerApplication,
	getPeerApplication,
	saveApplicationStep,
	submitApplication,
} from "@/lib/apiServices";
import useAppMutation from "@/hooks/useAppMutation";
import { useEffect } from "react";
import { toast } from "sonner";

const STEP_LABELS = [
	"Basic Info",
	"Motivation",
	"Lived Experience",
	"Boundaries",
	"Scenarios",
	"Communication",
	"Agreement",
];

const PeerApplication = ({ data, title }) => {
	const { user } = useSelector((state) => state.auth);
	const [open, setOpen] = useState(false);

	const isDraft = data?.isDraft;
	const [currentStep, setCurrentStep] = useState(1);
	const [applicationId, setApplicationId] = useState(null);
	console.log(currentStep, data?.currentStep);
	useEffect(() => {
		if (data) {
			if (data.isDraft && data.currentStep) {
				setCurrentStep(Math.min(data.currentStep, 7));
			}
			setApplicationId(data.id);
		}
	}, [data]);

	const {
		mutateAsync: createApplicationAsync,
		isPending: isApplicationCreatePending,
	} = useAppMutation({
		mutationFn: createPeerApplication,
		invalidateQueries: {
			queryKey: ["peer-application", user?.id],
		},
		onSuccess: () => {
			toast.success("Application created");
		},
	});

	const { mutateAsync: saveStepAsync, isPending: isStepSavingPending } =
		useAppMutation({
			mutationFn: saveApplicationStep,
			invalidateQueries: {
				queryKey: ["peer-application", user?.id],
			},
			onSuccess: () => {
				toast.success("Progress saved", {
					description: "Your draft has been saved.",
					duration: 2000,
				});
			},
		});

	const { mutate: applicationSubmit, isPending: isSubmitPending } =
		useAppMutation({
			mutationFn: submitApplication,
			invalidateQueries: {
				queryKey: ["peer-application", user?.id],
			},
			onSuccess: () => {
				toast.success("Application submitted", {
					description: "Your application is submitted for review.",
					duration: 2000,
				});
			},
		});

	const handleNext = async (stepNumber, credentials) => {
		let id = applicationId;

		if (!id) {
			const created = await createApplicationAsync();
			id = created.id;
			setApplicationId(id);
		}

		await saveStepAsync({ applicationId: id, stepNumber, credentials });
		setCurrentStep((prev) => prev + 1);
	};
	const handleCancel = () => {};
	const handleBack = () => {
		setCurrentStep((prev) => prev - 1);
	};
	const handleFinalSubmit = async (stepNumber, credentials) => {
		await saveStepAsync({ applicationId, stepNumber, credentials });
		await applicationSubmit({ applicationId });
		setOpen(false);
	};

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<StepBasicInfo
						isCreatePending={isApplicationCreatePending}
						isPending={isStepSavingPending}
						defaultValues={data?.StepResponses?.[0]}
						onNext={handleNext}
						onCancel={handleCancel}
					/>
				);
			case 2:
				return (
					<StepMotivation
						isPending={isStepSavingPending}
						defaultValues={data?.StepResponses?.[1]}
						onNext={handleNext}
						onBack={handleBack}
					/>
				);
			case 3:
				return (
					<StepLivedExperience
						isPending={isStepSavingPending}
						defaultValues={data?.StepResponses?.[2]}
						onNext={handleNext}
						onBack={handleBack}
					/>
				);
			case 4:
				return (
					<StepBoundaries
						isPending={isStepSavingPending}
						defaultValues={data?.StepResponses?.[3]}
						onNext={handleNext}
						onBack={handleBack}
					/>
				);
			case 5:
				return (
					<StepScenarios
						isPending={isStepSavingPending}
						defaultValues={data?.StepResponses?.[4]}
						onNext={handleNext}
						onBack={handleBack}
					/>
				);
			case 6:
				return (
					<StepCommunication
						isPending={isStepSavingPending}
						defaultValues={data?.StepResponses?.[5]}
						onNext={handleNext}
						onBack={handleBack}
					/>
				);
			case 7:
				return (
					<StepAgreement
						isPending={isStepSavingPending}
						isSubmitPending={isSubmitPending}
						defaultValues={data?.StepResponses?.[6]}
						onSubmit={handleFinalSubmit}
						onBack={handleBack}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="rounded-2xl px-3 py-2 flex bg-primary text-primary-foreground border-0 outline-none cursor-pointer">
				{title}
			</DialogTrigger>
			<DialogContent className="max-w-2xl w-full border border-red- max-h-[90vh]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Heart className="h-5 w-5 text-primary" />
						Peer Supporter Application
					</DialogTitle>
					<DialogDescription>
						Step {currentStep} of 7 — {STEP_LABELS[currentStep - 1]}
					</DialogDescription>
				</DialogHeader>
				<div className="flex gap-1.5 mb-2">
					{STEP_LABELS.map((label, i) => (
						<div
							key={label}
							className={`h-1.5 flex-1 rounded-full transition-colors ${
								i + 1 <= currentStep ? "bg-primary" : "bg-muted"
							}`}
						/>
					))}
				</div>
				{isDraft && (
					<Badge variant="secondary" className="w-fit flex items-center gap-1">
						<Save className="h-3 w-3" /> Draft saved
					</Badge>
				)}

				<ScrollArea className="max-h-[55vh] pr-4">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentStep}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.2 }}
						>
							{renderStep()}
						</motion.div>
					</AnimatePresence>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default PeerApplication;
