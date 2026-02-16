import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck } from "lucide-react";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const StepBoundaries = ({ defaultValues, onNext, onBack, isPending }) => {
	const responses = defaultValues?.responses;
	const form = useForm({
		mode: "onChange",
		defaultValues: {
			dependencyHandling: responses?.dependencyHandling || "",
			qualifiedAdviceHandling: responses?.qualifiedAdviceHandling || "",
			comfortableReferring: responses?.comfortableReferring ?? true,
			healthyBoundaries: responses?.healthyBoundaries || "",
		},
	});

	const comfortableReferring = useWatch({
		control: form.control,
		name: "comfortableReferring",
	});

  const handleFormSubmit = async (formData) => {
		const credentials = {
			dependencyHandling: formData?.dependencyHandling,
			qualifiedAdviceHandling: formData?.qualifiedAdviceHandling,
			comfortableReferring: formData?.comfortableReferring,
			healthyBoundaries: formData?.healthyBoundaries,
		};
		onNext(4, credentials);
	};
	return (
		<form
			id="peer-application"
			onSubmit={form.handleSubmit(handleFormSubmit)}
			className="space-y-5"
		>
			<div className="p-4 rounded-lg bg-muted/50 border mb-2">
				<p className="text-sm text-muted-foreground flex items-center gap-2">
					<ShieldCheck className="h-4 w-4 text-primary" />
					Setting healthy boundaries is essential for sustainable peer support.
				</p>
			</div>
			<Controller
				name="dependencyHandling"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel
							className="flex items-center gap-2"
							htmlFor="dependencyHandling"
						>
							If someone becomes overly dependent on you, how would you handle
							it?
						</FieldLabel>
						<Textarea
							{...field}
							className="min-h-20"
							id="dependencyHandling"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Encourage independence and reinforce boundaries..."
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
				name="qualifiedAdviceHandling"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel
							className="flex items-center gap-2"
							htmlFor="qualifiedAdviceHandling"
						>
							What would you do if someone needs advice beyond your
							qualifications?
						</FieldLabel>
						<Textarea
							{...field}
							className="min-h-20"
							id="qualifiedAdviceHandling"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Refer to professionals..."
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
				name="comfortableReferring"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field
						data-invalid={fieldState.invalid}
						className="flex flex-row items-center gap-2"
					>
						<Checkbox
							className="max-w-4 rounded-full"
							id="comfortableReferring"
							checked={comfortableReferring}
							onCheckedChange={(v) =>
								form.setValue("comfortableReferring", !!v)
							}
						/>
						<FieldLabel className="font-normal" htmlFor="comfortableReferring">
							I'm comfortable referring users to professional help when needed
						</FieldLabel>
					</Field>
				)}
			/>
			<Controller
				name="healthyBoundaries"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel
							className="flex items-center gap-2"
							htmlFor="healthyBoundaries"
						>
							How do you define healthy boundaries in a peer support role?
						</FieldLabel>
						<Textarea
							{...field}
							className="min-h-20"
							id="healthyBoundaries"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Not acting as a therapist..."
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

export default StepBoundaries;
