import { Controller, useForm, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { User, Globe, Clock } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { SheetClose } from "@/components/ui/sheet";

const StepBasicInfo = ({
	defaultValues,
	onNext,
	onCancel,
	isPending,
	isCreatePending,
}) => {
	const responses = defaultValues?.responses;
	const form = useForm({
		mode: "onChange",
		defaultValues: {
			fullName: responses?.fullName || "",
			age: responses?.age || "",
			country: responses?.country || "",
			timezone:
				responses?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
			languages: Array.isArray(responses?.languages)
				? responses?.languages.join(", ")
				: responses?.languages || "",
			weekdays: responses?.availability?.weekdays || false,
			weekends: responses?.availability?.weekends || false,
			timePreference: Array.isArray(responses?.availability?.timePreference)
				? responses?.availability.timePreference.join(", ")
				: responses?.availability?.timePreference || "",
			hoursPerWeek: responses?.hoursPerWeek || "",
		},
	});

	const weekdays = useWatch({
		control: form.control,
		name: "weekdays",
	});

	const weekends = useWatch({
		control: form.control,
		name: "weekends",
	});

	const handleFormSubmit = async (formData) => {
		const credentials = {
			fullName: formData?.fullName,
			age: formData?.age,
			country: formData?.country,
			timeZone: formData?.timeZone,
			languages: formData?.languages.split(", "),
			availability: {
				weekdays: formData?.weekdays,
				weekends: formData?.weekends,
				timePreference: formData?.timePreference.split(", "),
			},
			hoursPerWeek: formData?.hoursPerWeek,
		};
		onNext(1, credentials);
	};

	return (
		<form
			id="peer-application"
			onSubmit={form.handleSubmit(handleFormSubmit)}
			className="space-y-5"
		>
			<Controller
				name="fullName"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid} className="space-y-2">
						<FieldLabel className="flex items-center gap-2" htmlFor="fullName">
							<User className="h-4 w-4 text-primary" /> Full Name
						</FieldLabel>
						<Input
							{...field}
							className="w-full"
							id="fullName"
							type="text"
							aria-invalid={fieldState.invalid}
							placeholder="Enter your full name"
						/>
						{fieldState.error && (
							<p className="text-sm text-destructive">
								{fieldState.error.message}
							</p>
						)}
					</Field>
				)}
			/>
			<div className="grid grid-cols-2 gap-4">
				<Controller
					name="age"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className="space-y-2">
							<FieldLabel className="flex items-center gap-2" htmlFor="age">
								Age
							</FieldLabel>
							<Input
								{...field}
								className="w-full"
								id="age"
								type="number"
								aria-invalid={fieldState.invalid}
								placeholder="24"
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
					name="country"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className="space-y-2">
							<FieldLabel className="flex items-center gap-2" htmlFor="country">
								<Globe className="h-4 w-4 text-primary" /> Country
							</FieldLabel>
							<Input
								{...field}
								className="w-full"
								id="country"
								type="text"
								aria-invalid={fieldState.invalid}
								placeholder="India"
							/>
							{fieldState.error && (
								<p className="text-sm text-destructive">
									{fieldState.error.message}
								</p>
							)}
						</Field>
					)}
				/>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<Controller
					name="timezone"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className="space-y-2">
							<FieldLabel
								className="flex items-center gap-2"
								htmlFor="timezone"
							>
								<Clock className="h-4 w-4 text-primary" /> Timezone
							</FieldLabel>
							<Input
								{...field}
								className="w-full"
								id="timezone"
								type="text"
								aria-invalid={fieldState.invalid}
								placeholder="Asia/Kolkata"
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
					name="languages"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className="space-y-2">
							<FieldLabel
								className="flex items-center gap-2"
								htmlFor="languages"
							>
								Languages (comma-separated)
							</FieldLabel>
							<Input
								{...field}
								className="w-full"
								id="languages"
								type="text"
								aria-invalid={fieldState.invalid}
								placeholder="English, Hindi"
							/>
							{fieldState.error && (
								<p className="text-sm text-destructive">
									{fieldState.error.message}
								</p>
							)}
						</Field>
					)}
				/>
			</div>
			<div className="space-y-3 p-4 rounded-lg bg-muted/50 border">
				<Field>
					<FieldLabel className="font-medium">Availability</FieldLabel>

					<div className="flex items-center gap-6">
						<Controller
							name="weekdays"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									className="flex flex-row items-center gap-2 w-fit"
								>
									<Checkbox
										className="max-w-4"
										id="weekdays"
										checked={weekdays}
										onCheckedChange={(v) => form.setValue("weekdays", !!v)}
									/>
									<FieldLabel className="font-normal" htmlFor="weekdays">
										Weekdays
									</FieldLabel>
									{fieldState.error && (
										<p className="text-sm text-destructive">
											{fieldState.error.message}
										</p>
									)}
								</Field>
							)}
						/>
						<Controller
							name="weekends"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									className="flex flex-row items-center gap-2 w-fit"
								>
									<Checkbox
										className="max-w-4"
										id="weekends"
										checked={weekends}
										onCheckedChange={(v) => form.setValue("weekends", !!v)}
									/>
									<FieldLabel className="font-normal" htmlFor="weekends">
										Weekends
									</FieldLabel>
									{fieldState.error && (
										<p className="text-sm text-destructive">
											{fieldState.error.message}
										</p>
									)}
								</Field>
							)}
						/>
					</div>
				</Field>
				<div className="grid grid-cols-2 gap-4">
					<Controller
						name="timePreference"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid} className="space-y-2">
								<FieldLabel
									className="flex items-center gap-2"
									htmlFor="timePreference"
								>
									Time Preference
								</FieldLabel>
								<Input
									{...field}
									className="w-full"
									id="timePreference"
									type="text"
									aria-invalid={fieldState.invalid}
									placeholder="Morning, Evening"
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
						name="hoursPerWeek"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid} className="space-y-2">
								<FieldLabel
									className="flex items-center gap-2"
									htmlFor="hoursPerWeek"
								>
									Hours per Week
								</FieldLabel>
								<Input
									{...field}
									className="w-full"
									id="hoursPerWeek"
									type="number"
									aria-invalid={fieldState.invalid}
									placeholder="6"
								/>
								{fieldState.error && (
									<p className="text-sm text-destructive">
										{fieldState.error.message}
									</p>
								)}
							</Field>
						)}
					/>
				</div>
			</div>

			<div className="flex justify-between pt-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" variant="hero">
					{isCreatePending
						? "Creating the application..."
						: isPending
							? "Saving the form..."
							: "Next"}
				</Button>
			</div>
		</form>
	);
};

export default StepBasicInfo;
