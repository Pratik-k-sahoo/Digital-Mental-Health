import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { User } from "lucide-react";
import { CheckCircle } from "lucide-react";

const AppointmentCounsellor = ({
	fetchCounsellorsError,
	fetchCounsellorsPending,
	isFetchCounsellorsError,
	counsellors,
	setSelectedCounsellor,
	selectedCounsellor,
}) => {
	return (
		<Card variant="feature">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
						1
					</div>
					<div>
						<CardTitle>Choose a Counsellor</CardTitle>
						<CardDescription>
							Select based on their specialization
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid md:grid-cols-3 gap-4">
					{fetchCounsellorsPending ? (
						<p>Fetching Counsellors...</p>
					) : isFetchCounsellorsError ? (
						<p>{fetchCounsellorsError?.message}</p>
					) : counsellors.length === 0 ? (
						<p>No Counsellor Found</p>
					) : (
						counsellors?.map((counsellor) => (
							<button
								key={counsellor?.id}
								onClick={() => setSelectedCounsellor(counsellor?.id)}
								className={`p-4 rounded-xl border-2 text-left transition-all ${
									selectedCounsellor === counsellor?.id
										? "border-primary bg-sage-light"
										: "border-border hover:border-primary/50"
								}`}
							>
								<div className="flex items-center gap-3 mb-2">
									<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
										<User className="h-5 w-5 text-muted-foreground" />
									</div>
									{selectedCounsellor === counsellor?.id && (
										<CheckCircle className="h-5 w-5 text-primary ml-auto" />
									)}
								</div>
								<h3 className="font-semibold text-foreground">
									{counsellor?.name}
								</h3>
								<p className="text-sm text-muted-foreground">
									{counsellor?.specialization}
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									{counsellor?.availability}
								</p>
							</button>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default AppointmentCounsellor;
