import React from "react";

const AppointmentDate = ({ dates, selectedDate, setSelectedDate }) => {
	return (
		<div>
			<p className="text-sm font-medium text-foreground mb-3">
				Available Dates
			</p>
			<div className="flex gap-2 overflow-x-auto pb-2">
				{dates.map((date) => {
					const dateStr = date?.toISOString().split("T")[0];
					const isSelected = selectedDate === dateStr;
					return (
						<button
							key={dateStr}
							onClick={() => setSelectedDate(dateStr)}
							className={`shrink-0 p-3 rounded-xl border-2 text-center min-w-20 transition-all ${
								isSelected
									? "border-primary bg-sage-light"
									: "border-border hover:border-primary/50"
							}`}
						>
							<div className="text-xs text-muted-foreground">
								{date.toLocaleDateString("en-US", {
									weekday: "short",
								})}
							</div>
							<div className="text-lg font-bold text-foreground">
								{date.getDate()}
							</div>
							<div className="text-xs text-muted-foreground">
								{date.toLocaleDateString("en-US", {
									month: "short",
								})}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default AppointmentDate;
