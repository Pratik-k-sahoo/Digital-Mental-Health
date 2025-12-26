import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

const DisplayConfirmation = ({
	details,
	resetAfterRedirect,
	redir,
	confirmationDetails,
	isCancelled,
}) => {
	const navigate = useNavigate();
	return (
		<div className="container py-12 md:py-16 fixed top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] flex flex-col items-center backdrop-blur-lg h-full justify-center gap-10">
			<div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
				<h2 className="text-2xl font-bold text-green-600">
					{confirmationDetails.heading}
				</h2>
				<h2 className="text-lg font-bold text-accent/60 text-left">
					{confirmationDetails?.subheading}
				</h2>

				<div className="text-left space-y-2 text-sm">
					<p className="text-sm text-gray-600 italic">
						{confirmationDetails?.quote1}
					</p>
					<p>
						<strong>Counsellor:</strong> {details?.Counsellor?.name}
					</p>
					<p>
						<strong>Date:</strong> {details?.datetime.split("T")[0]}
					</p>
					<p>
						<strong>Time:</strong>{" "}
						{details?.datetime.split("T")[1].substring(0, 5)}
						{` ${
							details?.datetime.split("T")[1].substring(0, 5) >= 12 &&
							details?.datetime.split("T")[1].substring(0, 5) <= 24
								? "PM"
								: "AM"
						}`}
					</p>
					<p>
						<strong>Type:</strong> {details?.appointmentType.toUpperCase()}
					</p>
				</div>

				<Button
					onClick={() => {
						resetAfterRedirect();
						isCancelled ? navigate("/booking") : navigate("/");
					}}
				>
					{isCancelled ? "Go to Appointment" : "Go to Dashboard"}
				</Button>
				<p className="mx-auto text-muted-foreground text-sm">
					Taking you back in <span className="text-destructive">{redir}</span>{" "}
					seconds
				</p>
				<p className="text-sm text-gray-600 italic">
					{confirmationDetails?.quote2}
				</p>
			</div>
		</div>
	);
};

export default DisplayConfirmation;
