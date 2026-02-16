import { Progress } from "@/components/ui/progress";
import React from "react";

const ScoreBar = ({ label, score, icon: Icon }) => {
	const color =
		score >= 7
			? "text-green-600"
			: score >= 4
				? "text-yellow-600"
				: "text-red-600";
	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between text-sm">
				<span className="flex items-center gap-1.5">
					<Icon className="h-3.5 w-3.5 text-muted-foreground" />
					{label}
				</span>
				<span className={`font-semibold ${color}`}>{score}/10</span>
			</div>
			<Progress value={score * 10} className="h-1.5" />
		</div>
	);
};

export default ScoreBar;
