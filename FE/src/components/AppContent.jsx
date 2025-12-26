import React from "react";
import ScrollToHash from "./ScrollToHash";
import { Navigate, Route, Routes } from "react-router";
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
import ConfirmBooking from "@/pages/ConfirmBooking";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "@/pages/Admin/Dashboard";
import Stats from "@/pages/Admin/Stats";
import ValidatePage from "./ValidatePage";
import Profile from "@/pages/Profile";
import ProtectedRoutes from "./ProtectedRoutes";

const AppContent = () => {

	return (
		<>
			<ScrollToHash />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/confirm-booking/:token" element={<ConfirmBooking />} />

				<Route element={<ProtectedRoutes />}>
					<Route path="/profile" element={<Profile />} />
					<Route path="/assessments" element={<Assessments />} />
					<Route path="/chat" element={<ChatSupport />} />
					<Route path="/resources" element={<Resources />} />
					<Route path="/booking" element={<Booking />} />
					<Route path="/community" element={<Community />} />

					<Route path="/admin" element={<AdminLayout />}>
						<Route index element={<Navigate to="dashboard" replace />} />
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="stats" element={<Stats />} />
					</Route>
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	);
};

export default AppContent;
