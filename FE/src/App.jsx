import {} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import {
	Assessments,
	Booking,
	ChatSupport,
	Community,
	Home,
	Login,
	NotFound,
	Resources,
	Signup,
} from "@/pages";
import ScrollToHash from "./components/ScrollToHash";
import ConfirmBooking from "./pages/ConfirmBooking";
import AdminLayout from "./components/layout/ACPLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Stats from "./pages/Admin/Stats";
import { queryClient } from "./lib/queryClient";
import useAuth from "./hooks/useAuth";
import ValidatePage from "./components/ValidatePage";
import { useNavigate } from "react-router";
import AppProvider from "./components/AppProvider";
import AppContent from "./components/AppContent";

function App() {
	return (
		<AppProvider>
			<AppContent />
		</AppProvider>
	);
}

export default App;
