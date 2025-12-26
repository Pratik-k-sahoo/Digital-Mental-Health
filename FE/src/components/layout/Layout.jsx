import React from "react";
import Navbar from "./Navbar";
import Chat from "./Chat";

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<Chat />
			<main className="flex-1">{children}</main>
		</div>
	);
};

export default Layout;
