import { MessageCircleMore } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const Chat = () => {
	return (
		<div className="fixed bottom-0 right-0 mx-10 my-10 z-50 border rounded-full bg-sage/30 backdrop-blur-lg w-fit p-4 animate-bounce cursor-pointer">
			<Link to="/chat">
				<MessageCircleMore className="w-8 h-8 text-sage-dark" />
			</Link>
		</div>
	);
};

export default Chat;
