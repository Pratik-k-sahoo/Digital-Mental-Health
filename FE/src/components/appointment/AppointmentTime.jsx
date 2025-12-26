import { Clock } from "lucide-react";
import React from "react";

const AppointmentTime = ({
	fetchSlotsError,
	fetchSlotsPending,
	isFetchSlotsError,
	slots,
	setSelectedTime,
	selectedTime,
}) => {
	return (
		<div>
			<p className="text-sm font-medium text-foreground mb-3">
				Available Times
			</p>
			<div className="grid grid-cols-3 md:grid-cols-6 gap-2">
				{fetchSlotsPending ? (
					<p className="text-sm text-accent">Fetching Slots...</p>
				) : isFetchSlotsError ? (
					<p className="text-sm text-destructive">{fetchSlotsError}</p>
				) : slots.length === 0 ? (
					<p className="text-sm text-foreground/50">No Slots found</p>
				) : (
					slots?.map((time) => (
						<button
							key={time}
							onClick={() => setSelectedTime(time)}
							className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
								selectedTime === time
									? "border-primary bg-sage-light text-foreground"
									: "border-border text-muted-foreground hover:border-primary/50"
							}`}
						>
							<Clock className="h-4 w-4 mx-auto mb-1" />
							{time}
						</button>
					))
				)}
			</div>
		</div>
	);
};

export default AppointmentTime;
