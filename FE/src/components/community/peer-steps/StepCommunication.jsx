import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const StepCommunication = ({ defaultValues, onNext, onBack, isPending }) => {
	const responses = defaultValues?.responses;
	const form = useForm({
		mode: "onChange",
		defaultValues: {
			showEmpathy: responses?.showEmpathy || "",
			comfortableStyle: responses?.comfortableStyle || "",
			avoidPhrases: Array.isArray(responses?.avoidPhrases)
				? responses?.avoidPhrases.join(", ")
				: responses?.avoidPhrases || "",
		},
	});

	const comfortableStyle = useWatch({
		control: form.control,
		name: "comfortableStyle",
	});

	const handleFormSubmit = async (formData) => {
		const credentials = {
			showEmpathy: formData?.showEmpathy,
			comfortableStyle: formData?.comfortableStyle,
			avoidPhrases: formData.avoidPhrases.split(", "),
		};
		onNext(6, credentials);
	};
	return (
		<form
			id="peer-application"
			onSubmit={form.handleSubmit(handleFormSubmit)}
			className="space-y-5"
		>
			<div className="p-4 rounded-lg bg-muted/50 border mb-2">
				<p className="text-sm text-muted-foreground flex items-center gap-2">
					<MessageCircle className="h-4 w-4 text-primary" />
					Effective communication is the foundation of good peer support.
				</p>
			</div>
			<Controller
				name="showEmpathy"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel
							className="flex items-center gap-2"
							htmlFor="showEmpathy"
						>
							How do you show empathy in a conversation?
						</FieldLabel>
						<Textarea
							{...field}
							className="min-h-20"
							id="showEmpathy"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Reflect feelings and validate..."
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
				name="comfortableStyle"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel
							className="flex items-center gap-2"
							htmlFor="comfortableStyle"
						>
							What communication style are you most comfortable with?
						</FieldLabel>
						<Select
							value={comfortableStyle}
							onValueChange={(v) => form.setValue("comfortableStyle", v)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select your style..." />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Listening">Active Listening</SelectItem>
								<SelectItem value="Guiding">Gentle Guiding</SelectItem>
								<SelectItem value="Problem-solving">Problem-solving</SelectItem>
								<SelectItem value="Motivating">
									Motivating & Encouraging
								</SelectItem>
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
				name="avoidPhrases"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel
							className="flex items-center gap-2"
							htmlFor="avoidPhrases"
						>
							Phrases you'd avoid saying (comma-separated)
						</FieldLabel>
						<Input
							{...field}
							className="w-full"
							id="avoidPhrases"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Everything happens for a reason, Just stay positive"
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

export default StepCommunication;
