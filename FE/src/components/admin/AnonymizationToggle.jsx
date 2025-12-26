import useAnonymization from "@/hooks/useAnonymization";
import React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { Shield } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { EyeOff } from "lucide-react";

const AnonymizationToggle = () => {
	const { isAnonymized, setIsAnonymized } = useAnonymization();
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border">
						<Shield className="h-4 w-4 text-muted-foreground" />
						<Label
							htmlFor="anonymize-toggle"
							className="text-sm cursor-pointer"
						>
							Privacy Mode
						</Label>
						<Switch
							id="anonymize-toggle"
							checked={isAnonymized}
							onCheckedChange={setIsAnonymized}
						/>
						{isAnonymized && <EyeOff className="h-4 w-4 text-primary" />}
					</div>
				</TooltipTrigger>
				<TooltipContent side="bottom" className="max-w-xs">
					<p className="text-sm">
						{isAnonymized
							? "Privacy mode enabled: User data is masked to prevent accidental exposure"
							: "Enable privacy mode to anonymize user names and emails"}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default AnonymizationToggle;
