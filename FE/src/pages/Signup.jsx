import React from "react";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { EyeClosed, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import useAppMutation from "@/hooks/useAppMutation";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { login } from "@/redux/slice/authSlice";
import { useLocation } from "react-router";
import { createUser as createUserApi } from "@/lib/apiServices";

const Signup = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";
	const [see, setSee] = useState(false);
	const [isStudent, setIsStudent] = useState(false);
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "",
			department: "",
			year: "",
		},
	});
	const {
		mutate: createUser,
		isPending,
		isError,
		error,
	} = useAppMutation({
		mutationFn: createUserApi,
		invalidateQueries: ["user"],
		onSuccess: (data) => {
			dispatch(login(data?.user));
			console.log(from);
			navigate(from, { replace: true });
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const handleSignup = async (e) => {
		console.log(e);
		await createUser(e);
	};

	const togglePasswordType = () => {
		setSee((prev) => !prev);
	};

	return (
		<Layout>
			<section className="py-12 min-h-[calc(100vh-4.026rem)] bg-linear-to-br from-accent to-primary flex items-center">
				<div className="container flex md:flex-row justify-center items-stretch">
					<Card className="w-full rounded-r-none border-r-0 flex flex-col items-start justify-start py-20 bg-primary border-0 px-32">
						<h1 className="text-4xl text-primary-foreground tracking-widest font-extrabold font-serif h-5">
							WELCOME
						</h1>
						<h3 className="text-slate-200 italic font-mono">
							"Your wellbeing, your space"
						</h3>
						<h5 className="tracking-wide">
							Welcome to{" "}
							<Link to={"/"} className="text-peach-light">
								e-Psycho Support
							</Link>
							, your space for mental wellbeing. Check in with yourself, explore
							helpful resources, talk to our AI support assistant, connect with
							counsellors, and find peer support — privately and safely.
						</h5>

						<h5 className="tracking-wide">
							<Link to={"/"} className="text-peach-light">
								e-Psycho Support
							</Link>{" "}
							में आपका स्वागत है — यह आपका मानसिक स्वास्थ्य और कल्याण का
							सुरक्षित स्थान है। अपनी भावनाओं को समझें, सहायक संसाधनों को देखें,
							AI सहायता से बात करें, काउंसलर से जुड़ें और साथियों से समर्थन पाएँ
							— पूरी तरह निजी और सुरक्षित तरीके से।
						</h5>

						<p className="text-xs">*Available in multi-language</p>
					</Card>
					<Card className="w-11/12 flex flex-col items-center justify-center px-5 rounded-l-none border-l-0">
						<span className="text-4xl font-bold tracking-wider p-1 text-sage-dark">
							Signup Page
						</span>
						<hr className="text-black bg-black w-full h-[0.15rem] m-1" />
						<div className="w-5/6 tracking-wide">
							<form
								id="login-form"
								onSubmit={form.handleSubmit(handleSignup)}
								className="flex flex-col gap-4 items-center"
							>
								<FieldGroup>
									<div className="flex gap-4">
										<Controller
											name="name"
											control={form.control}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel className="text-lg" htmlFor="name">
														Name:{" "}
													</FieldLabel>
													<Input
														{...field}
														className="w-full"
														id="name"
														type="text"
														aria-invalid={fieldState.invalid}
														placeholder="Enter Your Fullname"
													/>
												</Field>
											)}
										/>
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
									</div>
									<div className="flex gap-4">
										<Controller
											name="password"
											control={form.control}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel className="text-lg" htmlFor="password">
														Password:{" "}
													</FieldLabel>
													<div className="flex items-center gap-2">
														<Input
															{...field}
															className="w-full"
															type={see ? "text" : "password"}
															id="password"
															minLength={8}
															aria-invalid={fieldState.invalid}
															placeholder="Enter Your Password"
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
										<Controller
											name="role"
											control={form.control}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel className="text-lg" htmlFor="role">
														Role:{" "}
													</FieldLabel>
													<Select
														id="role"
														{...field}
														aria-invalid={fieldState.invalid}
														defaultValue="student"
														onValueChange={(e) => {
															form.setValue("role", e);
															setIsStudent(e === "student");
														}}
													>
														<SelectTrigger className="w-[180px]">
															<SelectValue placeholder="Select Role" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="student">Student</SelectItem>
															<SelectItem value="counsellor">
																Councellor
															</SelectItem>
															<SelectItem value="admin">Admin</SelectItem>
															<SelectItem value="peer_volunteer">
																Peer Volunteer
															</SelectItem>
														</SelectContent>
													</Select>
												</Field>
											)}
										/>
									</div>

									{isStudent && (
										<div className="flex gap-4">
											<Controller
												name="department"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field data-invalid={fieldState.invalid}>
														<FieldLabel
															className="text-lg"
															htmlFor="department"
														>
															Department:{" "}
														</FieldLabel>
														<Input
															{...field}
															className="w-full"
															id="department"
															type="text"
															aria-invalid={fieldState.invalid}
															placeholder="Enter Your Department"
														/>
													</Field>
												)}
											/>
											<Controller
												name="year"
												control={form.control}
												render={({ field, fieldState }) => (
													<Field data-invalid={fieldState.invalid}>
														<FieldLabel className="text-lg" htmlFor="year">
															Year:{" "}
														</FieldLabel>
														<Select
															id="year"
															{...field}
															aria-invalid={fieldState.invalid}
															defaultValue="2025"
															onValueChange={(e) => form.setValue("year", e)}
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
													</Field>
												)}
											/>
										</div>
									)}
								</FieldGroup>

								<Button
									variant="hero"
									className="w-full text-lg font-bold tracking-wider cursor-pointer"
								>
									{isPending ? <Loader className="animate-spin" /> : "Sign up"}
								</Button>

								<p className="text-md">
									Already have an account?{" "}
									<Link
										className="text-accent font-medium hover:underline underline-offset-2"
										to={"/login"}
									>
										Login Here
									</Link>
								</p>
							</form>
							{isError && <p className="text-destructive">{error}</p>}
						</div>
					</Card>
				</div>
			</section>
		</Layout>
	);
};

export default Signup;
