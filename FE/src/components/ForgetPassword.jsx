import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Eye } from "lucide-react";
import { EyeClosed } from "lucide-react";
import useAppMutation from "@/hooks/useAppMutation";
import { resetUser } from "@/lib/apiServices";
import { toast } from "sonner";

const ForgetPassword = () => {
	const [open, setOpen] = useState(false);
	const [see, setSee] = useState(false);
	const form = useForm({
		defaultValues: {
			email: "",
			newPassword: "",
		},
	});

	const { mutate: forgetUser, isPending } = useAppMutation({
		mutationFn: resetUser,
		onSuccess: () => {
			setOpen(false);
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const handleReset = async (e) => {
		toast.promise(forgetUser(e), {
			loading: "Resetting password...",
			success: "Password reset ✅",
			error: "Failed to reset password ❌",
			position: "bottom-center",
		});
	};

	const togglePasswordType = () => {
		setSee((prev) => !prev);
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="hover:underline cursor-pointer underline-offset-2">
				Forget Password
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Do you want to reset password?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently reset your
						account and remove your data from our servers.
					</DialogDescription>
				</DialogHeader>
				<form
					id="reset-form"
					onSubmit={form.handleSubmit(handleReset)}
					className="flex flex-col gap-4 items-center"
				>
					<FieldGroup>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel className="text-lg" htmlFor="email">
										Email:{" "}
									</FieldLabel>
									<Input
										{...field}
										className="w-full"
										id="email"
										type="email"
										aria-invalid={fieldState.invalid}
										placeholder="Enter Your Email"
									/>
								</Field>
							)}
						/>
						<Controller
							name="newPassword"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel className="text-lg" htmlFor="newPassword">
										New Password:{" "}
									</FieldLabel>
									<div className="flex items-center gap-2">
										<Input
											{...field}
											className="w-full"
											type={see ? "text" : "password"}
											id="newPassword"
											minLength={8}
											aria-invalid={fieldState.invalid}
											placeholder="Enter Your New Password"
										/>
										<span className="cursor-pointer text-warm-gray">
											{see ? (
												<Eye onClick={togglePasswordType} />
											) : (
												<EyeClosed onClick={togglePasswordType} />
											)}
										</span>
									</div>
								</Field>
							)}
						/>
					</FieldGroup>

					<Button
						variant="hero"
						className="w-full text-lg font-bold tracking-wider cursor-pointer"
						type="submit"
					>
						{isPending ? <Loader className="animate-spin" /> : "Reset Password"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ForgetPassword;
