import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const StepMotivation = ({ defaultValues, onNext, onBack, isPending }) => {
	const responses = defaultValues?.responses;
	const form = useForm({
		mode: "onChange",
		defaultValues: {
			whyVolunteer: responses?.whyVolunteer || "",
			peerSupportMeaning: responses?.peerSupportMeaning || "",
			userFeelingGoal: responses?.userFeelingGoal || "",
		},
	});

	const handleFormSubmit = async (formData) => {
		const credentials = {
			whyVolunteer: formData.whyVolunteer,
			peerSupportMeaning: formData.peerSupportMeaning,
			userFeelingGoal: formData.userFeelingGoal,
		};
		onNext(2, credentials);
	};
	return (
		<form
			id="peer-application"
			onSubmit={form.handleSubmit(handleFormSubmit)}
			className="space-y-5"
		>
			<Controller
				name="whyVolunteer"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel
							className="flex items-center gap-2"
							htmlFor="whyVolunteer"
						>
							<Sparkles className="h-4 w-4 text-primary" /> Why do you want to
							volunteer as a peer supporter?
						</FieldLabel>
						<Textarea
							{...field}
							className="min-h-[100px]"
							id="whyVolunteer"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="I want to help people feel less alone..."
						/>
						{fieldState.error && (
							<p className="text-sm text-destructive">
								{fieldState.error.message}
							</p>
						)}
					</Field>
				)}
			/>
			<Controller
				name="peerSupportMeaning"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel
							className="flex items-center gap-2"
							htmlFor="peerSupportMeaning"
						>
							What does peer support mean to you?
						</FieldLabel>
						<Textarea
							{...field}
							className="min-h-20"
							id="peerSupportMeaning"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Listening without judging..."
						/>
						{fieldState.error && (
							<p className="text-sm text-destructive">
								{fieldState.error.message}
							</p>
						)}
					</Field>
				)}
			/>
			<Controller
				name="userFeelingGoal"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel
							className="flex items-center gap-2"
							htmlFor="userFeelingGoal"
						>
							How do you want users to feel after talking to you?
						</FieldLabel>
						<Textarea
							{...field}
							className="min-h-20"
							id="userFeelingGoal"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Understood and safe..."
						/>
						{fieldState.error && (
							<p className="text-sm text-destructive">
								{fieldState.error.message}
							</p>
						)}
					</Field>
				)}
			/>

			<div className="flex justify-between pt-4">
				<Button type="button" variant="outline" onClick={onBack}>
					Back
				</Button>
				<Button type="submit" variant="hero">
					{isPending ? "Saving the form..." : "Next"}
				</Button>
			</div>
		</form>
	);
};

export default StepMotivation;
