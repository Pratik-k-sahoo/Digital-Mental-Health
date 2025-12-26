import React from "react";
import AppointmentDate from "./AppointmentDate";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import AppointmentTime from "./AppointmentTime";

const AppointmentSlot = ({
	dates,
	selectedDate,
	setSelectedDate,
	fetchSlotsPending,
	fetchSlotsError,
	isFetchSlotsError,
	slots,
	selectedTime,
	setSelectedTime,
}) => {
	return (
		<Card variant="feature">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
						2
					</div>
					<div>
						<CardTitle>Select Date & Time</CardTitle>
						<CardDescription>Choose your preferred slot</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				<AppointmentDate
					dates={dates}
					setSelectedDate={setSelectedDate}
					selectedDate={selectedDate}
				/>

				{selectedDate && (
					<AppointmentTime
						fetchSlotsError={fetchSlotsError}
						isFetchSlotsError={isFetchSlotsError}
						fetchSlotsPending={fetchSlotsPending}
						slots={slots}
						selectedTime={selectedTime}
						setSelectedTime={setSelectedTime}
					/>
				)}
			</CardContent>
		</Card>
	);
};

export default AppointmentSlot;
