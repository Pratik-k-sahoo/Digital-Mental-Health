import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Heart } from "lucide-react";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const StepLivedExperience = ({ defaultValues, onNext, onBack, isPending }) => {
	const responses = defaultValues?.responses;
	const form = useForm({
		mode: "onChange",
		defaultValues: {
			experiencedChallenges:
				responses?.experiencedChallenges === true
					? "yes"
					: responses?.experiencedChallenges === false
						? "no"
						: responses?.experiencedChallenges || "",
			stableNow: responses?.stableNow || "",
			copingMethods: responses?.copingMethods || "",
		},
	});

	const experiencedChallenges = useWatch({
		control: form.control,
		name: "experiencedChallenges",
	});

	const stableNow = useWatch({
		control: form.control,
		name: "stableNow",
	});

	const handleFormSubmit = async (formData) => {
		const credentials = {
			experiencedChallenges: formData.experiencedChallenges,
			stableNow: formData?.stableNow,
			copingMethods: formData?.copingMethods,
		};
		onNext(3, credentials);
	};

	return (
		<form
			id="peer-application"
			onSubmit={form.handleSubmit(handleFormSubmit)}
			className="space-y-5"
		>
			<div className="p-4 rounded-lg bg-muted/50 border mb-2">
				<p className="text-sm text-muted-foreground flex items-center gap-2">
					<Heart className="h-4 w-4 text-primary" />
					This section is optional but helps us understand your perspective.
					Your answers are kept confidential.
				</p>
			</div>
			<Controller
				name="experiencedChallenges"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel
							className="flex items-center gap-2"
							htmlFor="experiencedChallenges"
						>
							Have you personally experienced mental health challenges?
						</FieldLabel>
						<Select
							value={experiencedChallenges}
							onValueChange={(v) => form.setValue("experiencedChallenges", v)}
							id="experiencedChallenges"
						>
							<SelectTrigger>
								<SelectValue placeholder="Select..." />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="yes">Yes</SelectItem>
								<SelectItem value="no">No</SelectItem>
							</SelectContent>
						</Select>
						{fieldState.error && (
							<p className="text-sm text-destructive">
								{fieldState.error.message}
							</p>
						)}
					</Field>
				)}
			/>

			<Controller
				name="stableNow"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel className="flex items-center gap-2" htmlFor="stableNow">
							Do you feel emotionally stable enough to support others right now?
						</FieldLabel>
						<Select
							value={stableNow}
							onValueChange={(v) => form.setValue("stableNow", v)}
							id="stableNow"
						>
							<SelectTrigger>
								<SelectValue placeholder="Select..." />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Yes">Yes</SelectItem>
								<SelectItem value="Mostly">Mostly</SelectItem>
								<SelectItem value="Not sure">Not Sure</SelectItem>
							</SelectContent>
						</Select>
						{fieldState.error && (
							<p className="text-sm text-destructive">
								{fieldState.error.message}
							</p>
						)}
					</Field>
				)}
			/>

			<Controller
				name="copingMethods"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel
							className="flex items-center gap-2"
							htmlFor="copingMethods"
						>
							What coping methods or support have helped you?
						</FieldLabel>
						<Textarea
							{...field}
							className="min-h-[100px]"
							id="copingMethods"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Therapy, journaling, talking to friends..."
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

export default StepLivedExperience;
