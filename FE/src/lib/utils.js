import { clsx } from "clsx";
import { TrendingUp } from "lucide-react";
import { Minus } from "lucide-react";
import { Brain } from "lucide-react";
import { Heart } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const formatTime = (secs) => {
	const getSeconds = `0${secs % 60}`.slice(-2);
	const minutes = `${Math.floor(secs / 60)}`;
	const getMinutes = `0${minutes % 60}`.slice(-2);

	return `${getMinutes}:${getSeconds}`;
};

export const getSeverityCount = (data, severity) =>
	data?.find((item) => item.severity === severity)?.count ?? 0;

export const getTypeCount = (data, type) =>
	data?.filter((item) => item.type.toLowerCase() === type) ?? [];

export const getSeverityColor = (severity) => {
	const s = severity.toLowerCase();
	if (s.includes("minimal") || s.includes("none")) return "bg-sage text-white";
	if (s.includes("mild")) return "bg-sky text-white";
	if (s.includes("moderate")) return "bg-peach text-white";
	if (s.includes("severe")) return "bg-destructive text-destructive-foreground";
	return "bg-muted text-muted-foreground";
};

export const getLatestAssessment = (type, assessments) => {
	return assessments?.find((a) => a.type.toLowerCase() === type.toLowerCase());
};
