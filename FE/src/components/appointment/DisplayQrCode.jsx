import React from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router";
import { ReactTyped } from "react-typed";
import { Button } from "../ui/button";
import useAppMutation from "@/hooks/useAppMutation";
import { cancelBooking as cancelBookingApi } from "@/lib/apiServices";

const DisplayQrCode = ({
	time,
	qrCode,
	setIsConfirmedStatus,
	setConfirmationDetails,
	setIsCancelled,
}) => {
	const {
		mutate: cancelBooking,
		isError: isCancelError,
		error: cancelError,
	} = useAppMutation({
		mutationFn: cancelBookingApi,
		invalidateQueries: {
			queryKey: ["appointments", "availableSlots"],
		},
	});

	const handleCancelBooking = async () => {
		await cancelBooking(qrCode.split("/")[4]);
		setIsConfirmedStatus(true);
		setConfirmationDetails({
			heading: "Appointment Cancelled",
			subheading: "That’s okay — we’re here when you’re ready 🌱",
			quote1: `“Taking care of yourself also means listening to what you need
          right now.”`,
			quote2: `“You can always come back and schedule a session when it feels right.”`,
		});
		setIsCancelled(true);
	};

	return (
		<div className="container py-12 md:py-16 fixed top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] flex flex-col items-center backdrop-blur-lg h-full justify-center gap-10">
			<h3 className="text-2xl font-bold">Scan to confirm booking</h3>
			<p>{time} remaining</p>
			<QRCode value={qrCode} size={200} className="w-42 h-42" />
			<Link to={qrCode}>Path</Link>
			<div>
				<ReactTyped
					strings={["Waiting for confirmation . . . . . . ."]}
					typeSpeed={100}
					loop
					backSpeed={20}
					cursorChar=""
					showCursor={true}
				/>
			</div>
			<Button
				variant={"destructive"}
				className={"cursor-pointer"}
				onClick={handleCancelBooking}
			>
				Cancel Booking
			</Button>
			{isCancelError && <p className="text-destructive">{cancelError}</p>}
		</div>
	);
};

export default DisplayQrCode;
