import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const AssessmentCard = ({ title, description, icon:Icon, onClick, color }) => {
	return (
		<Card
			className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group"
			onClick={onClick}
		>
			<CardHeader>
				<div
					className={cn(
						"w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
						color
					)}
				>
					<Icon className="h-7 w-7 text-white" />
				</div>
				<CardTitle className="text-xl">{title}</CardTitle>
				<CardDescription className="text-base">{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<Button
					variant="hero"
					className="w-full group-hover:bg-primary/90 cursor-pointer"
				>
					Start The Test
					<ArrowRight className="ml-2 h-4 w-4" />
				</Button>
			</CardContent>
		</Card>
	);
};

export default AssessmentCard;
