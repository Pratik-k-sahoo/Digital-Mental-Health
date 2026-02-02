import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import useAppMutation from "@/hooks/useAppMutation";
import {
	confirmBooking as confirmBookingApi,
	fetchBookingDetailsByToken,
} from "@/lib/apiServices";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { Check } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { toast } from "sonner";

const ConfirmBooking = () => {
	const navigate = useNavigate();
	const { token } = useParams();
	const {
		isPending: fetchDetailsPending,
		isError: isFetchDetailsError,
		data: details,
		error: fetchDetailsError,
	} = useQuery({
		queryKey: ["appointments", "bookingDetails", token],
		queryFn: () => fetchBookingDetailsByToken(token),
		enabled: !!token,
	});

	const [timer, setTimer] = useState(10);

	const { mutate: confirmBooking, isSuccess } = useAppMutation({
		mutationFn: confirmBookingApi,
		invalidateQueries: {
			queryKey: ["appointments", "availableSlots"],
		},
		onSuccess: () => {
			toast("Appointment confirmed successfully:");
			setTimeout(() => {
				navigate("/");
			}, 10000);
		},
		onError: (error) => {
			toast.error("Something went wrong", {
				description: "Please try again later⌚",
			});
			if (error?.status === 410) {
				navigate("/booking");
			}
		},
	});

	const handleConfirmBooking = async () => {
		await confirmBooking(token);
	};

	useEffect(() => {
		if (timer !== 0 && isSuccess) {
			const time = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);

			return () => {
				clearInterval(time);
			};
		}
	}, [isSuccess, timer, navigate]);

	return (
		<Layout>
			<div className="container py-12 md:py-16">
				<div className="max-w-4xl mx-auto space-y-8">
					{!isSuccess && (
						<Card variant="feature">
							<CardHeader>
								<div className="flex items-center gap-3">
									<div>
										<CardTitle>Your Booking Details</CardTitle>
										<CardDescription>
											Check the details and confirm below{" "}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{fetchDetailsPending && <p>Pending...</p>}
								{isFetchDetailsError && <p>{fetchDetailsError.message}</p>}
								<div className="grid md:grid-cols-3 gap-4">
									<div className="flex gap-2">
										<h2>Counsellor: </h2>
										<p>{details?.Counsellor?.name}</p>
									</div>
									<div className="flex gap-2">
										<h2>Patient: </h2>
										<p>{details?.Student?.name}</p>
									</div>
									<div className="flex gap-2">
										<h2>Appointment Type: </h2>
										<p>{details?.appointmentType.toUpperCase()}</p>
									</div>
									<div className="flex gap-2">
										<h2>Date: </h2>
										<p>{details?.datetime.split("T")[0]}</p>
									</div>
									<div className="flex gap-2">
										<h2>Time: </h2>
										<p>
											{details?.datetime.split("T")[1].substring(0, 5)}
											{` ${
												details?.datetime.split("T")[1].substring(0, 5) >= 12 &&
												details?.datetime.split("T")[1].substring(0, 5) <= 24
													? "PM"
													: "AM"
											}`}
										</p>
									</div>
									<div className="flex gap-2">
										<h2>Status: </h2>
										<p>{details?.status}</p>
									</div>
									<div className="flex gap-2">
										<h2>Notes: </h2>
										<p>
											{details?.notes?.length === 0 || !details?.notes
												? "NA"
												: details?.notes}
										</p>
									</div>
								</div>
								<Button
									onClick={handleConfirmBooking}
									className="mx-auto w-full mt-4"
									disabled={isSuccess}
								>
									{isSuccess ? "Booking confirmed" : "Confirm"}
								</Button>
							</CardContent>
							{isSuccess && (
								<p className="mx-auto text-red-400">
									Redirecting in {timer} sec
								</p>
							)}
						</Card>
					)}
					{(isSuccess || details?.status === "confirmed") && (
						<Card variant="feature">
							<CardHeader>
								<div className="flex items-center gap-3">
									<div>
										<CardTitle>Your Booking Details</CardTitle>
										<CardDescription className="flex items-center gap-4">
											Booking is confirmed
											<span>
												<BadgeCheck className="text-primary font-bold" />
											</span>
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{fetchDetailsPending && <p>Pending...</p>}
								{isFetchDetailsError && <p>{fetchDetailsError.message}</p>}
								<div className="grid md:grid-cols-3 gap-4">
									<div className="flex gap-2">
										<h2>Counsellor: </h2>
										<p>{details?.Counsellor?.name}</p>
									</div>
									<div className="flex gap-2">
										<h2>Patient: </h2>
										<p>{details?.Student?.name}</p>
									</div>
									<div className="flex gap-2">
										<h2>Appointment Type: </h2>
										<p>{details?.appointmentType.toUpperCase()}</p>
									</div>
									<div className="flex gap-2">
										<h2>Date: </h2>
										<p>{details?.datetime.split("T")[0]}</p>
									</div>
									<div className="flex gap-2">
										<h2>Time: </h2>
										<p>
											{details?.datetime.split("T")[1].substring(0, 5)}
											{` ${
												details?.datetime.split("T")[1].substring(0, 5) > 12 &&
												details?.datetime.split("T")[1].substring(0, 5) <= 24
													? "AM"
													: "PM"
											}`}
										</p>
									</div>
									<div className="flex gap-2">
										<h2>Status: </h2>
										<p>Confirmed</p>
									</div>
									<div className="flex gap-2">
										<h2>Notes: </h2>
										<p>
											{details?.notes?.length === 0 || !details?.notes
												? "NA"
												: details?.notes}
										</p>
									</div>
								</div>
							</CardContent>
							{isSuccess && (
								<p className="mx-auto text-red-400">
									Redirecting in {timer} sec
								</p>
							)}
						</Card>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default ConfirmBooking;
