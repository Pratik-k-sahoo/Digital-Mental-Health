import { cn } from "@/lib/utils";
import React from "react";
import { NavLink } from "react-router";

const RouterNavLink = ({ className, activeClassName, to, ...props }, ref) => {
	return (
		<NavLink
			ref={ref}
			to={to}
			className={({ isActive }) => cn(className, isActive && activeClassName)}
			{...props}
		/>
	);
};

export default RouterNavLink;
