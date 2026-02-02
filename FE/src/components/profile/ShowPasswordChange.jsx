import React from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import useAppMutation from "@/hooks/useAppMutation";
import { updateUser as updateUserApi } from "@/lib/apiServices";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { useState } from "react";

const ShowPasswordChange = () => {
	const [open, setOpen] = useState(false);
	const form = useForm({
		mode: "onChange",
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});
	const { reset, getValues } = form;

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
			reset();
			setOpen(false);
		},
		onError: () => {
			toast.error("Something went wrong", {
				description: "Please try again later⌚",
			});
		},
	});

	const handleChangePassword = async (e) => {
		await updateUser(e);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild className="w-fit hover:bg-primary cursor-pointer">
				<Button variant="outline">Change Password</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Change Password</DialogTitle>
					<DialogDescription>
						Secure your profile here. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={form.handleSubmit(handleChangePassword)}
					className="space-y-4"
				>
					<FieldGroup>
						<Controller
							name="currentPassword"
							control={form.control}
							rules={{ required: "Current password is required" }}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="currentPassword">
										Old Password:
									</FieldLabel>
									<Input
										{...field}
										id="currentPassword"
										type="password"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error && (
										<p className="text-xs text-destructive mt-1">
											{fieldState.error.message}
										</p>
									)}
								</Field>
							)}
						/>
						<Controller
							name="newPassword"
							control={form.control}
							rules={{
								required: "New password is required",
								minLength: {
									value: 8,
									message: "Password must be at least 8 characters",
								},
							}}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="newPassword">New Password:</FieldLabel>
									<Input
										{...field}
										id="newPassword"
										type="password"
										required
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error && (
										<p className="text-xs text-destructive mt-1">
											{fieldState.error.message}
										</p>
									)}
								</Field>
							)}
						/>
						<Controller
							name="confirmPassword"
							control={form.control}
							rules={{
								required: "Please confirm your password",
								validate: (value) =>
									value === getValues("newPassword") ||
									"Passwords do not match",
							}}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="confirmPassword">
										Confirm Password:
									</FieldLabel>
									<Input
										{...field}
										id="confirmPassword"
										type="password"
										required
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.error && (
										<p className="text-xs text-destructive mt-1">
											{fieldState.error.message}
										</p>
									)}
								</Field>
							)}
						/>
					</FieldGroup>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline" type="button">
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="submit"
							disabled={isPending || !form.formState.isValid}
						>
							{isPending ? "Saving..." : "Change Password"}
						</Button>
						{isError && <p>{error?.message}</p>}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ShowPasswordChange;
