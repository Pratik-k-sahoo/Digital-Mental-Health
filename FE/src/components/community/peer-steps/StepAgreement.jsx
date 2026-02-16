import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { FileCheck } from "lucide-react";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const StepAgreement = ({
	defaultValues,
	onSubmit,
	onBack,
	isPending,
	isSubmitPending,
}) => {
	const responses = defaultValues?.responses;
	const form = useForm({
		mode: "onChange",
		defaultValues: {
			trainingConsent: responses?.trainingConsent ?? false,
			ruleConsent: responses?.ruleConsent ?? false,
			notTherapyAgreement: responses?.notTherapyAgreement ?? false,
			moderationConsent: responses?.moderationConsent ?? false,
		},
	});

	const [moderationConsent, notTherapyAgreement, ruleConsent, trainingConsent] =
		useWatch({
			control: form.control,
			name: [
				"moderationConsent",
				"notTherapyAgreement",
				"ruleConsent",
				"trainingConsent",
			],
		});

	const handleFormSubmit = async (formData) => {
		const credentials = {
			trainingConsent: formData?.trainingConsent,
			ruleConsent: formData?.ruleConsent,
			notTherapyAgreement: formData?.notTherapyAgreement,
			moderationConsent: formData?.moderationConsent,
		};
		onSubmit(7, credentials);
	};
	return (
		<form
			id="peer-application"
			onSubmit={form.handleSubmit(handleFormSubmit)}
			className="space-y-5"
		>
			<div className="p-4 rounded-lg bg-muted/50 border mb-2">
				<p className="text-sm text-muted-foreground flex items-center gap-2">
					<FileCheck className="h-4 w-4 text-primary" />
					Please review and agree to the following before submitting your
					application.
				</p>
			</div>
			<div className="space-y-4">
				<Controller
					name="trainingConsent"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field
							data-invalid={fieldState.invalid}
							className="flex flex-row items-start gap-3 p-3 rounded-lg border"
						>
							<Checkbox
								id="trainingConsent"
								checked={trainingConsent}
								onCheckedChange={(v) => form.setValue("trainingConsent", !!v)}
								className="mt-0.5 max-w-4 rounded-full"
							/>
							<div>
								<FieldLabel className="font-medium" htmlFor="trainingConsent">
									Training Commitment
								</FieldLabel>
								<p className="text-sm text-muted-foreground">
									I agree to complete the peer support training program before
									starting active support.
								</p>
								{fieldState.error && (
									<p className="text-sm text-destructive">
										{fieldState.error.message}
									</p>
								)}
							</div>
						</Field>
					)}
				/>
				<Controller
					name="ruleConsent"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field
							data-invalid={fieldState.invalid}
							className="flex flex-row items-start gap-3 p-3 rounded-lg border"
						>
							<Checkbox
								id="ruleConsent"
								checked={ruleConsent}
								onCheckedChange={(v) => form.setValue("ruleConsent", !!v)}
								className="mt-0.5 max-w-4 rounded-full"
							/>
							<div>
								<FieldLabel className="font-medium" htmlFor="ruleConsent">
									Community Rules
								</FieldLabel>
								<p className="text-sm text-muted-foreground">
									I agree to follow all community guidelines and rules of
									conduct.
								</p>
								{fieldState.error && (
									<p className="text-sm text-destructive">
										{fieldState.error.message}
									</p>
								)}
							</div>
						</Field>
					)}
				/>
				<Controller
					name="notTherapyAgreement"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field
							data-invalid={fieldState.invalid}
							className="flex flex-row items-start gap-3 p-3 rounded-lg border"
						>
							<Checkbox
								id="notTherapyAgreement"
								checked={notTherapyAgreement}
								onCheckedChange={(v) =>
									form.setValue("notTherapyAgreement", !!v)
								}
								className="mt-0.5 max-w-4 rounded-full"
							/>
							<div>
								<FieldLabel
									className="font-medium"
									htmlFor="notTherapyAgreement"
								>
									Not a Therapist
								</FieldLabel>
								<p className="text-sm text-muted-foreground">
									I understand that peer support is not therapy and I will not
									attempt to provide clinical advice.
								</p>
								{fieldState.error && (
									<p className="text-sm text-destructive">
										{fieldState.error.message}
									</p>
								)}
							</div>
						</Field>
					)}
				/>
				<Controller
					name="moderationConsent"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field
							data-invalid={fieldState.invalid}
							className="flex flex-row items-start gap-3 p-3 rounded-lg border"
						>
							<Checkbox
								id="moderationConsent"
								checked={moderationConsent}
								onCheckedChange={(v) => form.setValue("moderationConsent", !!v)}
								className="mt-0.5 max-w-4 rounded-full"
							/>
							<div>
								<FieldLabel className="font-medium" htmlFor="moderationConsent">
									Moderation & Supervision
								</FieldLabel>
								<p className="text-sm text-muted-foreground">
									I agree to be supervised and moderated by the admin team at
									all times.
								</p>
								{fieldState.error && (
									<p className="text-sm text-destructive">
										{fieldState.error.message}
									</p>
								)}
							</div>
						</Field>
					)}
				/>
			</div>

			<div className="flex justify-between pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					// disabled={submitting}
				>
					Back
				</Button>
				<Button type="submit" variant="hero">
					{isPending
						? "Saving the form..."
						: isSubmitPending
							? "Submitting the application"
							: "Next"}
				</Button>
			</div>
		</form>
	);
};

export default StepAgreement;
