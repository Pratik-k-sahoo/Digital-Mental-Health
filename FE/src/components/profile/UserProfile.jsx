import React from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSelector } from "react-redux";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Controller, useForm } from "react-hook-form";
import useAppMutation from "@/hooks/useAppMutation";
import { updateUser as updateUserApi } from "@/lib/apiServices";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { Save } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useState } from "react";
import ShowPasswordChange from "./ShowPasswordChange";
import { updateUser as updateUserRedux } from "@/redux/slice/authSlice";
import { toast } from "sonner";

const UserProfile = () => {
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const [passwordDialog, setPasswordDialog] = useState(false);
	const form = useForm({
		defaultValues: {
			...user,
			password: "",
			currentPassword: "",
		},
	});

	const {
		reset,
		formState: { dirtyFields, isDirty },
	} = form;

	const {
		mutate: updateUser,
		isPending,
		isError,
		error,
	} = useAppMutation({
		mutationFn: updateUserApi,
		invalidateQueries: ["user"],
		onSuccess: (data) => {
			toast.success(data?.message);
			dispatch(updateUserRedux(data?.user));
			reset(
				{
					...user,
					...data?.user,
				},
				{ keepDirty: false }
			);
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const handleSaveProfile = async (e) => {
		if (!isDirty) return;
		const payload = {};
		Object.keys(dirtyFields).forEach((key) => {
			const value = e[key];

			if (typeof value === "string" && value !== "") payload[key] = value;
			else payload[key] = value;
		});

		if (Object.keys(payload).length === 0) {
			reset({
				...user,
			});
			return;
		}
		await updateUser(payload);
	};

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>Update your personal information</CardDescription>
				</CardHeader>

				<CardContent className="flex flex-col gap-3">
					<form
						id="profile-form"
						onSubmit={form.handleSubmit(handleSaveProfile)}
					>
						<FieldGroup>
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="name">Name</FieldLabel>
										<Input
											{...field}
											id="name"
											type="text"
											aria-invalid={fieldState.invalid}
										/>
									</Field>
								)}
							/>
							<Controller
								name="email"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="email">Email*</FieldLabel>
										<Tooltip>
											<TooltipTrigger>
												<Input
													{...field}
													id="email"
													disabled
													className="bg-muted"
													type="text"
													aria-invalid={fieldState.invalid}
												/>
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-xs text-primary-foreground">
													Email cannot be changed
												</p>
											</TooltipContent>
										</Tooltip>
									</Field>
								)}
							/>
							<Controller
								name="department"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="department">Department</FieldLabel>
										<Input
											{...field}
											id="department"
											type="text"
											aria-invalid={fieldState.invalid}
										/>
									</Field>
								)}
							/>
							<Controller
								name="year"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="year">Passout Year</FieldLabel>
										<div className="grid md:grid-cols-2 gap-4 justify-between">
											<Tooltip>
												<TooltipTrigger>
													<Input
														{...field}
														type="text"
														disabled
														aria-invalid={fieldState.invalid}
													/>
												</TooltipTrigger>
												<TooltipContent>
													Select the pass-out year from the drop down 👉
												</TooltipContent>
											</Tooltip>

											<Select
												id="year"
												value={field.value?.toString() ?? ""}
												aria-invalid={fieldState.invalid}
												onValueChange={field.onChange}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Select Year" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value={"2025"}>2025</SelectItem>
													<SelectItem value={"2026"}>2026</SelectItem>
													<SelectItem value={"2027"}>2027</SelectItem>
													<SelectItem value={"2028"}>2028</SelectItem>
													<SelectItem value={"2029"}>2029</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</Field>
								)}
							/>
							<Separator />
							<div className="flex items-center gap-8">
								<Button type="submit" disabled={isPending} className="w-fit">
									{isPending ? (
										<>
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Save className="h-4 w-4 mr-2" />
											Save Changes
										</>
									)}
								</Button>
								<ShowPasswordChange />
							</div>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Account Details</CardTitle>
					<CardDescription>Your account information</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex justify-between items-center py-2">
						<span className="text-muted-foreground">User ID</span>
						<span className="font-mono text-sm">
							{user?.id}
							...
						</span>
					</div>
					<Separator />
					<div className="flex justify-between items-center py-2">
						<span className="text-muted-foreground">Account Created</span>
						<span>
							{user?.createdAt
								? format(new Date(user.createdAt), "MMM d, yyyy")
								: "N/A"}
						</span>
					</div>
					<Separator />
					<div className="flex justify-between items-center py-2">
						<span className="text-muted-foreground">Total Assessments</span>
						<Badge variant="secondary">{user?.assessments}</Badge>
					</div>
					<Separator />
					<div className="flex justify-between items-center py-2">
						<span className="text-muted-foreground">Total Appointments</span>
						<Badge variant="secondary">{user?.appointments}</Badge>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default UserProfile;
