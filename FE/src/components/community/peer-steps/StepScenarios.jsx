import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const StepScenarios = ({ defaultValues, onNext, onBack, isPending }) => {
	const responses = defaultValues?.responses;
	const form = useForm({
		mode: "onChange",
		defaultValues: {
			scenario1: responses?.scenario1 || "",
			scenario2: responses?.scenario2 || "",
			scenario3: responses?.scenario3 || "",
		},
	});

  const handleFormSubmit = async (formData) => {
		const credentials = {
			scenario1: formData?.scenario1,
			scenario2: formData?.scenario2,
			scenario3: formData?.scenario3,
		};
		onNext(5, credentials);
	};
	return (
		<form
			id="peer-application"
			onSubmit={form.handleSubmit(handleFormSubmit)}
			className="space-y-5"
		>
			<div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-2">
				<p className="text-sm text-muted-foreground flex items-center gap-2">
					<AlertTriangle className="h-4 w-4 text-destructive" />
					These scenarios help us understand how you'd respond in challenging
					situations.
				</p>
			</div>
			<Controller
				name="scenario1"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field
						data-invalid={fieldState.invalid}
						className="space-y-2 p-4 bg-muted/50 rounded-lg border"
					>
						<FieldLabel className="font-medium" htmlFor="scenario1">
							Scenario 1: Crisis Situation
						</FieldLabel>
						<p className="text-sm text-muted-foreground mb-2">
							A user shares that they're feeling hopeless and mentions thoughts
							of self-harm. How would you respond?
						</p>
						<Textarea
							{...field}
							className="min-h-[100px]"
							id="scenario1"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Validate their feelings and suggest professional help..."
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
				name="scenario2"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field
						data-invalid={fieldState.invalid}
						className="space-y-2 p-4 bg-muted/50 rounded-lg border"
					>
						<FieldLabel className="font-medium" htmlFor="scenario2">
							Scenario 2: Boundary Testing
						</FieldLabel>
						<p className="text-sm text-muted-foreground mb-2">
							A user starts messaging you at all hours and expects immediate
							responses. How do you handle this?
						</p>
						<Textarea
							{...field}
							className="min-h-[100px]"
							id="scenario2"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Set clear availability expectations..."
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
				name="scenario3"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field
						data-invalid={fieldState.invalid}
						className="space-y-2 p-4 bg-muted/50 rounded-lg border"
					>
						<FieldLabel className="font-medium" htmlFor="scenario3">
							Scenario 3: Emotional Burnout
						</FieldLabel>
						<p className="text-sm text-muted-foreground mb-2">
							You've been supporting several people and start feeling
							emotionally drained. What do you do?
						</p>
						<Textarea
							{...field}
							className="min-h-[100px]"
							id="scenario3"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Take breaks and seek supervision..."
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

export default StepScenarios;
