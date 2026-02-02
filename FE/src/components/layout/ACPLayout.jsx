import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Layout from "./Layout";

const ACPLayout = () => {
	const { user } = useSelector((state) => state.auth);

	if (user?.role === "student") return <Navigate to="/404" replace />;
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
};

export default ACPLayout;
