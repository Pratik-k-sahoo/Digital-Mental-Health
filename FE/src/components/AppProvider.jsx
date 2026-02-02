import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter } from "react-router";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/sonner";

const AppProvider = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<TooltipProvider>
					{children}
				</TooltipProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
};

export default AppProvider;
