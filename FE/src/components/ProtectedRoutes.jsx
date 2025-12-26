import useAuth from "@/hooks/useAuth";
import { logout as resourceLogout } from "@/redux/slice/resourceSlice";
import { logout } from "@/redux/slice/authSlice";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router";
import { useLocation } from "react-router";
import ValidatePage from "./ValidatePage";

const ProtectedRoutes = () => {
	const { user } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [redirecting, setRedirecting] = useState(false);
	const { isLoading, isError } = useAuth(!!user);
	const location = useLocation();

	useEffect(() => {
		if (isError && user) {
			setRedirecting(true);
			const t = setTimeout(() => {
				dispatch(logout());
				dispatch(resourceLogout());
				navigate("/login", { replace: true, state: { from: location } });
			}, 800);

			const g = setTimeout(() => {
				setRedirecting(false);
			}, 1600);

			return () => {
				clearTimeout(t);
				clearTimeout(g);
			};
		}
	}, [isError, navigate, dispatch, user]);

	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	if (isLoading) {
		return <ValidatePage />;
	}

	if (redirecting) {
		return <ValidatePage message="Session expired. Redirecting..." />;
	}
	return <Outlet />;
};

export default ProtectedRoutes;
