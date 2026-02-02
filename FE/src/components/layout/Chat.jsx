import { cn } from "@/lib/utils";
import { MessageCircleMore } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const Chat = ({ className }) => {
	return (
		<Link className={`${cn(className)} p-2 sm:p-3 md:p-4 delay-300`} to="/chat">
			<MessageCircleMore className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-sage-dark" />
		</Link>
	);
};

export default Chat;
