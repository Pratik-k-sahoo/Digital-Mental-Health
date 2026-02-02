import React from "react";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { EyeClosed, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import useAppMutation from "@/hooks/useAppMutation";
import { loginUser } from "@/lib/apiServices";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slice/authSlice";
import { useLocation } from "react-router";
import ForgetPassword from "@/components/ForgetPassword";
import { toast } from "sonner";

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";
	const [see, setSee] = useState(false);
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const {
		mutate: userLogin,
		isPending,
		isError,
		error,
	} = useAppMutation({
		mutationFn: loginUser,
		invalidateQueries: ["user"],
		onSuccess: (data) => {
			toast.success(`Welcome Back ${data?.user?.name} ✨`);
			dispatch(login(data?.user));
			navigate(from, { replace: true });
		},
		onError: () => {
			toast.error("Something went wrong", {
				description: "Please try again later⌚",
			});
		},
	});

	const handleLogin = async (e) => {
		await userLogin(e);
	};

	const togglePasswordType = () => {
		setSee((prev) => !prev);
	};

	return (
		<Layout>
			<section className="py-12 min-h-[calc(100vh-4.026rem)] bg-linear-to-br from-accent to-primary flex items-center">
				<div className="container flex flex-col gap-4 lg:gap-0 lg:flex-row justify-center md:items-stretch">
					<Card className="w-full lg:rounded-r-none lg:border-r-0 flex flex-col items-center lg:items-start justify-start py-20 bg-primary border-0 px-5 lg:px-32 ">
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
					<Card className="w-full lg:w-11/12 flex flex-col items-center justify-center px-5 lg:rounded-l-none lg:border-l-0">
						<span className="text-3xl md:text-4xl font-bold tracking-wider p-1 text-sage-dark">
							Login Page
						</span>
						<hr className="text-black bg-black w-full h-[0.15rem] m-1" />
						<div className="w-5/6 tracking-wide">
							<form
								id="login-form"
								onSubmit={form.handleSubmit(handleLogin)}
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
								</FieldGroup>

								<p className="self-end text-peach cursor-grab">
									<ForgetPassword />
								</p>

								{isError && (
									<p className="text-destructive">{error?.message}</p>
								)}
								<Button
									variant="hero"
									className="w-full text-lg font-bold tracking-wider cursor-pointer"
								>
									{isPending ? <Loader className="animate-spin" /> : "Sign In"}
								</Button>

								<p className="text-md">
									Don't have an account?{" "}
									<Link
										className="text-accent font-medium hover:underline underline-offset-2"
										to={"/signup"}
										state={{ from: location.state?.from }}
									>
										Signup Here
									</Link>
								</p>
							</form>
						</div>
					</Card>
				</div>
			</section>
		</Layout>
	);
};

export default Login;
