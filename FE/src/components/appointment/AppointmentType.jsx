import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle } from "lucide-react";

const AppointmentType = ({
	appointmentTypes,
	selectedType,
	setSelectedType,
}) => {
	return (
		<Card variant="feature">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
						3
					</div>
					<div>
						<CardTitle>Appointment Type</CardTitle>
						<CardDescription>Choose how you'd like to meet</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid md:grid-cols-2 gap-4">
					{appointmentTypes.map((type) => (
						<button
							key={type.id}
							onClick={() => setSelectedType(type.id)}
							className={`p-4 rounded-xl border-2 text-left flex items-start gap-4 transition-all ${
								selectedType === type.id
									? "border-primary bg-sage-light"
									: "border-border hover:border-primary/50"
							}`}
						>
							<div className="w-10 h-10 rounded-xl bg-sky-light text-sky flex items-center justify-center shrink-0">
								<type.icon className="h-5 w-5" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">{type.label}</h3>
								<p className="text-sm text-muted-foreground">
									{type.description}
								</p>
							</div>
							{selectedType === type.id && (
								<CheckCircle className="h-5 w-5 text-primary ml-auto" />
							)}
						</button>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default AppointmentType;
