import React from "react";
import Navbar from "./Navbar";
import Chat from "./Chat";
import Community from "./Community";

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-10 md:right-10 z-50 flex gap-3 sm:gap-4">
				<Chat className="bg-sage/30 backdrop-blur-lg animate-bounce cursor-pointer rounded-full w-fit p-2 sm:p-3 md:p-4" />
				<Community className="bg-sage/30 backdrop-blur-lg animate-bounce cursor-pointer rounded-full w-fit p-2 sm:p-3 md:p-4" />
			</div>
			<main className="flex-1">{children}</main>
		</div>
	);
};

export default Layout;
