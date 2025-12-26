import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { MapPin } from "lucide-react";
import { Video } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import AppointmentType from "@/components/appointment/AppointmentType";
import AppointmentSlot from "@/components/appointment/AppointmentSlot";
import AppointmentCounsellor from "@/components/appointment/AppointmentCounsellor";
import { toast } from "sonner";
import { useCallback } from "react";
import DisplayQrCode from "@/components/appointment/DisplayQrCode";
import { formatTime } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import DisplayConfirmation from "@/components/appointment/DisplayConfirmation";
import useGetQuery from "@/hooks/useGetQuery";
import {
	bookAppointment as bookAppointmentApi,
	fetchAvailableSlots,
	fetchBookingDetailsByToken,
	fetchBookingStatusByToken,
	fetchCounsellors,
} from "@/lib/apiServices";
import useAppMutation from "@/hooks/useAppMutation";

const appointmentTypes = [
	{
		id: "in-person",
		label: "In-Person",
		icon: MapPin,
		description: "Visit the counselling center",
	},
	{
		id: "virtual",
		label: "Video Call",
		icon: Video,
		description: "Online consultation",
	},
];

const Booking = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [selectedCounsellor, setSelectedCounsellor] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);
	const [selectedType, setSelectedType] = useState(null);
	const [timer, setTimer] = useState(240);
	const [isConfirmedStatus, setIsConfirmedStatus] = useState(false);
	const [redir, setRedir] = useState(10);
	const [confirmationDetails, setConfirmationDetails] = useState({});
	const [isCancelled, setIsCancelled] = useState(false);

	const {
		isPending: fetchCounsellorsPending,
		isError: isFetchCounsellorsError,
		data: counsellors,
		error: fetchCounsellorsError,
	} = useGetQuery({
		queryKey: ["counsellors"],
		queryFn: fetchCounsellors,
		staleTime: 1 * 60 * 1000,
	});

	const {
		isPending: fetchSlotsPending,
		isError: isFetchSlotsError,
		data: slots,
		error: fetchSlotsError,
	} = useGetQuery({
		queryKey: [
			"appointments",
			"availableSlots",
			selectedCounsellor,
			selectedDate,
		],

		queryFn: () => fetchAvailableSlots(selectedCounsellor, selectedDate),
		enabled: !!selectedCounsellor && !!selectedDate,
		staleTime: 0,
	});

	const dates = Array.from({ length: 7 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() + i + 1);
		return date;
	});

	const {
		mutate: bookAppointment,
		data,
		isPending,
		isError,
		error,
		reset: resetBookAppointment,
	} = useAppMutation({
		mutationFn: bookAppointmentApi,
		invalidateQueries: {
			queryKey: ["appointments", "availableSlots"],
		},
		onSuccess: (data) => {
			console.log("Appointment booked successfully:", data);
		},
		onError: (error) => {
			console.error("Error booking appointment:", error);
		},
	});

	const qrCode = data?.qrUrl ?? null;
	const startTimer = Boolean(data?.qrUrl);
	const getToken = data?.appointment?.qr_token ?? null;

	const { data: statusData } = useGetQuery({
		queryKey: ["appointments", "bookingStatus", getToken],
		queryFn: () => fetchBookingStatusByToken(getToken),
		enabled: !!getToken,
		refetchInterval: (data, query) => {
			if (data?.state?.data?.status === "confirmed") return false;
			return 30000;
		},
		retry: false,
	});
	// const { data: statusData } = useGetBookingStatus({ getToken });
	const { data: details } = useGetQuery({
		queryKey: ["appointments", "bookingDetails"],
		queryFn: () => fetchBookingDetailsByToken(getToken),
		enabled: !!getToken,
		staleTime: 1 * 60 * 1000,
	});

	const handleBookAppointment = async () => {
		setTimer(240);
		await bookAppointment({
			counsellorId: selectedCounsellor,
			date: selectedDate,
			time: selectedTime,
			appointmentType: selectedType,
		});
	};

	const resetBooking = useCallback(() => {
		setSelectedCounsellor(null);
		setSelectedDate(null);
		setSelectedTime(null);
		setSelectedType(null);
	}, []);

	const stopQrFlow = useCallback(() => {
		resetBooking();
		resetBookAppointment();
		setTimer(240);
	}, [resetBookAppointment, resetBooking]);

	const resetAfterRedirect = useCallback(() => {
		stopQrFlow();
		setIsConfirmedStatus(false);
		setRedir(10);
		setConfirmationDetails({});

		queryClient.removeQueries({
			queryKey: ["appointments", "bookingDetails"],
		});

		queryClient.removeQueries({
			queryKey: ["appointments", "bookingStatus"],
		});
	}, [stopQrFlow, queryClient]);

	useEffect(() => {
		if (isFetchCounsellorsError) {
			if (fetchCounsellorsError.status === 401) {
				navigate(fetchCounsellorsError?.redirectTo);
			}
		}
	}, [isFetchCounsellorsError, fetchCounsellorsError, navigate]);

	useEffect(() => {
		if (!startTimer) return;

		const countTimer = setInterval(() => {
			setTimer((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(countTimer);
	}, [startTimer]);

	useEffect(() => {
		if (timer !== 0) return;

		resetAfterRedirect();
		toast.error("QR Code expires");
	}, [timer, resetAfterRedirect]);

	useEffect(() => {
		if (statusData?.status === "confirmed") {
			stopQrFlow();
			setConfirmationDetails({
				heading: "Appointment Confirmed ✅",
				subheading: "Your session on with us 🌿",
				quote1: `“You’ve taken a meaningful step toward caring for yourself. We’re
						here with you.”`,
				quote2: `“Reaching out is a sign of strength.”`,
			});
			setIsCancelled(false);
			setIsConfirmedStatus(true);
			toast.error("Booking Confirmed");
		}
	}, [statusData, navigate, stopQrFlow]);

	useEffect(() => {
		if (!isConfirmedStatus) return;
		setRedir(10);
		const interval = setInterval(() => {
			setRedir((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isConfirmedStatus]);

	useEffect(() => {
		if (!isConfirmedStatus) return;
		if (redir !== 0) return;

		resetAfterRedirect();
		if (isCancelled) {
			navigate("/booking", { replace: true });
			return;
		}
		navigate("/", { replace: true });
	}, [redir, isConfirmedStatus, navigate, resetAfterRedirect, isCancelled]);

	return (
		<Layout>
			<div className="container py-12 md:py-16">
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light border border-sage/20 text-sm font-medium mb-4">
						<Calendar className="h-4 w-4 text-primary" />
						<span>Confidential Sessions</span>
					</div>
					<h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Book an Appointment
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Schedule a confidential session with one of our trained campus
						counsellors. All appointments are free for students.
					</p>
				</div>

				<div className="max-w-4xl mx-auto space-y-8">
					<AppointmentCounsellor
						fetchCounsellorsError={fetchCounsellorsError}
						fetchCounsellorsPending={fetchCounsellorsPending}
						isFetchCounsellorsError={isFetchCounsellorsError}
						counsellors={counsellors}
						setSelectedCounsellor={setSelectedCounsellor}
						selectedCounsellor={selectedCounsellor}
					/>

					{selectedCounsellor && (
						<AppointmentSlot
							dates={dates}
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
							selectedTime={selectedTime}
							setSelectedTime={setSelectedTime}
							fetchSlotsPending={fetchSlotsPending}
							fetchSlotsError={fetchSlotsError}
							isFetchSlotsError={isFetchSlotsError}
							slots={slots}
						/>
					)}

					{selectedTime && (
						<AppointmentType
							appointmentTypes={appointmentTypes}
							selectedType={selectedType}
							setSelectedType={setSelectedType}
						/>
					)}

					<div className="text-center">
						<Button
							variant="hero"
							size="xl"
							disabled={
								!selectedCounsellor ||
								!selectedDate ||
								!selectedTime ||
								!selectedType
							}
							onClick={handleBookAppointment}
						>
							Proceed
						</Button>
						<p className="text-sm text-muted-foreground mt-3">
							You'll receive a confirmation email with meeting details
						</p>
						{isError && (
							<p className="text-sm text-destructive mt-3">{error.message}</p>
						)}
						{isPending && (
							<p className="text-sm text-destructive mt-3">Pending...</p>
						)}
					</div>
				</div>
			</div>
			{qrCode && (
				<DisplayQrCode
					time={formatTime(timer)}
					qrCode={qrCode}
					setIsConfirmedStatus={setIsConfirmedStatus}
					setConfirmationDetails={setConfirmationDetails}
					setIsCancelled={setIsCancelled}
				/>
			)}
			{isConfirmedStatus && (
				<DisplayConfirmation
					details={details}
					resetAfterRedirect={resetAfterRedirect}
					redir={redir}
					confirmationDetails={confirmationDetails}
					isCancelled={isCancelled}
				/>
			)}
		</Layout>
	);
};

export default Booking;
