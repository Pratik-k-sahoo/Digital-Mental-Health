import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { Hourglass } from "lucide-react";
import { Flag, EyeOff, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React from "react";

const STATUS = [
	{ value: "under_review", label: "Under Review", icon: Hourglass, color: "bg-slate-500" },
	{ value: "visible", label: "Visible", icon: Eye, color: "bg-green-500" },
	{ value: "flagged", label: "Flagged", icon: Flag, color: "bg-yellow-500" },
	{ value: "hidden", label: "Hidden", icon: EyeOff, color: "bg-red-500" },
];

const SwitchStatus = ({ value, onChange }) => {
	const activeIndex = STATUS.findIndex((opt) => opt.value === value);
	return (
		<div className="relative w-full flex items-center bg-muted rounded-full p-1 gap-0.5">
			<AnimatePresence>
				<motion.div
					className={cn(
						"absolute h-[calc(100%-8px)] rounded-full",
						STATUS[activeIndex]?.color || "bg-primary",
					)}
					initial={false}
					animate={{
						x: activeIndex * 100 + 4,
						width: 100,
					}}
					transition={{
						type: "spring",
						stiffness: 500,
						damping: 30,
					}}
				/>
			</AnimatePresence>

			{STATUS.map((option) => (
				<button
					key={option.value}
					onClick={() => onChange(option.value)}
					className={cn(
						"relative z-10 px-3 py-1 text-xs font-medium rounded-full transition-colors w-[100px] text-center",
						value === option.value
							? "text-white"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
};

export default SwitchStatus;
