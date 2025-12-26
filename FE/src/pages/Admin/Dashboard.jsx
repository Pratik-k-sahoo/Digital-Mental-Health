import AdminAnalyticsTab from "@/components/admin/AdminAnalyticsTab";
import AdminAppointmentsTab from "@/components/admin/AdminAppointmentsTab";
import AdminPeerSupportTab from "@/components/admin/AdminPeerSupportTab";
import AdminResourcesTab from "@/components/admin/AdminResourcesTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import { Card, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import { Shield } from "lucide-react";
import { FileText } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { Users } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Calendar } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const TABS = [
	{ id: "analytics", label: "Analytics", icon: BarChart3, required: ["ADMIN"] },
	{ id: "users", label: "Users", icon: Users, required: ["ADMIN"] },
	{ id: "resources", label: "Resources", icon: FileText, required: ["ADMIN"] },
	{
		id: "appointments",
		label: "Appointments",
		icon: Calendar,
		required: ["ADMIN", "COUNSELLOR"],
	},
	{
		id: "peer-support",
		label: "Peer Support",
		icon: MessageSquare,
		required: ["ADMIN", "COUNSELLOR"],
	},
];

const Dashboard = () => {
	const { user } = useSelector((state) => state.auth);

	const TABSSHOW = TABS.filter((tab) =>
		tab.required.includes(user?.role?.toUpperCase())
	);
	const [activeTab, setActiveTab] = useState(TABSSHOW?.[0]?.id || "analytics");

	return (
		<div className="container py-8">
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 rounded-lg bg-primary/10">
						<Shield className="h-6 w-6 text-primary" />
					</div>
					<h1 className="text-3xl font-bold text-foreground">
						Admin Dashboard
						<Link
							to="/admin/stats"
							className="ml-2 underline underline-offset-2 text-xl text-peach"
						>
							See Stats
						</Link>
					</h1>
				</div>
				<p className="text-muted-foreground">
					Manage users, content, appointments, and view analytics
				</p>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="grid w-fit mx-auto grid-cols-5 lg:w-auto lg:inline-grid self-start">
					{TABSSHOW.map((tab) => (
						<TabsTrigger
							key={tab.id}
							value={tab.id}
							className="flex items-center gap-2"
						>
							<tab.icon className="h-4 w-4" />
							<span className="hidden sm:inline">{tab.label}</span>
						</TabsTrigger>
					))}
				</TabsList>
				<TabsContent value="analytics">
					<AdminAnalyticsTab />
				</TabsContent>
				<TabsContent value="users">
					<AdminUsersTab />
				</TabsContent>
				<TabsContent value="resources">
					<AdminResourcesTab />
				</TabsContent>
				<TabsContent value="appointments">
					<AdminAppointmentsTab />
				</TabsContent>
				<TabsContent value="peer-support">
					<AdminPeerSupportTab />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Dashboard;
