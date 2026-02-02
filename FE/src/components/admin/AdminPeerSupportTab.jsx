import useAnonymization from "@/hooks/useAnonymization";
import React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useSelector } from "react-redux";
import { OctagonAlert } from "lucide-react";
import { MessageSquareWarning } from "lucide-react";
import { Rss } from "lucide-react";
import { UserCheck } from "lucide-react";
import ReportedPosts from "./Peer/ReportedPosts";
import ReportedComments from "./Peer/ReportedComments";
import ForumPosts from "./Peer/ForumPosts";
import PeersApplied from "./Peer/PeersApplied";
import { Card, CardContent, CardHeader } from "../ui/card";

const TABS = [
	{
		id: "reported-posts",
		label: "Reported Posts",
		icon: OctagonAlert,
		required: ["ADMIN", "COUNSELLOR", "PEER_VOLUNTEER"],
	},
	{
		id: "reported-comments",
		label: "Reported Comments",
		icon: MessageSquareWarning,
		required: ["ADMIN", "COUNSELLOR", "PEER_VOLUNTEER"],
	},
	{
		id: "posts",
		label: "Forum Posts",
		icon: Rss,
		required: ["ADMIN", "COUNSELLOR"],
	},
	{
		id: "peer-apply",
		label: "Peer Applications",
		icon: UserCheck,
		required: ["ADMIN", "COUNSELLOR"],
	},
];

const AdminPeerSupportTab = () => {

	const { user } = useSelector((state) => state.auth);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const TABSSHOW = TABS.filter((tab) =>
		tab.required.includes(user?.role?.toUpperCase()),
	);
	const [activeTab, setActiveTab] = useState(
		TABSSHOW?.[0]?.id || "reported-posts",
	);

	return (
		<Card>
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<CardHeader>
					<TabsList
						className={`grid mx-auto ${
							user?.role === "peer_volunteer" ? "grid-cols-2" : "grid-cols-4"
						} lg:inline-grid self-start wrap-normal`}
					>
						{TABSSHOW.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="flex items-center gap-2"
							>
								<tab.icon className="h-4 w-4" />
								<span className="hidden md:inline">{tab.label}</span>
							</TabsTrigger>
						))}
					</TabsList>
				</CardHeader>
				<CardContent>
					<TabsContent value="reported-posts">
						<ReportedPosts />
					</TabsContent>
					<TabsContent value="reported-comments">
						<ReportedComments />
					</TabsContent>
					<TabsContent value="posts">
						<ForumPosts />
					</TabsContent>
					<TabsContent value="peer-apply">
						<PeersApplied />
					</TabsContent>
				</CardContent>
			</Tabs>
		</Card>
	);
};

export default AdminPeerSupportTab;
