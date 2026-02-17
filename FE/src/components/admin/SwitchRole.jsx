import { cn } from "@/lib/utils";
import { UserRoundPlus } from "lucide-react";
import { Headset } from "lucide-react";
import { UserRoundPen } from "lucide-react";
import { UserRoundCog } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

const ROLE = [
	{
		value: "admin",
		label: "Admin",
		icon: UserRoundCog,
		color: "bg-slate-500",
	},
	{
		value: "counsellor",
		label: "Counsellor",
		icon: UserRoundPlus,
		color: "bg-green-500",
	},
	{
		value: "peer_volunteer",
		label: "Volunteer",
		icon: Headset,
		color: "bg-yellow-500",
	},
	{
		value: "student",
		label: "Student",
		icon: UserRoundPen,
		color: "bg-red-500",
	},
];

const SwitchRole = ({ value, onChange }) => {
	const activeIndex = ROLE.findIndex((opt) => opt.value === value?.role);
	return (
		<div className="relative w-fit flex items-center bg-muted rounded-full p-1 gap-0.5">
			<AnimatePresence>
				<motion.div
					className={cn(
						"absolute h-[calc(100%-8px)] rounded-full",
						ROLE[activeIndex]?.color || "bg-primary",
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

			{ROLE.map((option) => (
				<button
					key={option.value}
					onClick={() => onChange(option.value, value.id)}
					className={cn(
						"relative z-10 px-3 py-1 text-xs font-medium rounded-full transition-colors w-[100px] text-center",
						value?.role === option.value
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

export default SwitchRole;
