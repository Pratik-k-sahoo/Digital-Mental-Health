import Layout from "@/components/layout/Layout";
import Appointment from "@/components/profile/Appointment";
import Assessment from "@/components/profile/Assessment";
import UserProfile from "@/components/profile/UserProfile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import {
	fetchAssessmentHistory,
	fetchMyAppointments,
	updateUser as updateUserApi,
} from "@/lib/apiServices";
import { login } from "@/redux/slice/authSlice";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import { Calendar } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { Settings } from "lucide-react";
import { User } from "lucide-react";
import { Brain } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Minus } from "lucide-react";
import { History } from "lucide-react";
import { TrendingDown } from "lucide-react";
import { Save } from "lucide-react";
import { Heart } from "lucide-react";
import React from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

const Profile = () => {
	const { user } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const tabFromUrl = searchParams.get("tab");

	const defaultValue =
		tabFromUrl ?? (user?.role === "student" ? "history" : "settings");
	return (
		<Layout>
			<div className="container py-12 max-w-4xl">
				<div className="flex items-center gap-3 mb-8">
					<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
						<User className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h1 className="text-3xl font-bold text-foreground">My Profile</h1>
						<p className="text-muted-foreground">
							View your assessment history and manage your account
						</p>
					</div>
				</div>

				<Tabs
					value={defaultValue}
					onValueChange={(val) => navigate(`/profile?tab=${val}`)}
					className="space-y-6"
				>
					<TabsList
						className={`grid w-fit sm:w-full mx-auto h-auto ${
							user?.role === "student"
								? "sm:grid-cols-3 grid-cols-1"
								: "grid-cols-1"
						}`}
					>
						{user?.role === "student" && (
							<TabsTrigger
								value="history"
								className="w-full flex items-center justify-start sm:justify-center text-center whitespace-normal leading-tight gap-2 cursor-pointer"
							>
								<History className="h-4 w-4" />
								Assessment History
							</TabsTrigger>
						)}
						{user?.role === "student" && (
							<TabsTrigger
								value="appointment"
								className="w-full flex items-center justify-start sm:justify-center text-center whitespace-normal leading-tight gap-2 cursor-pointer"
							>
								<History className="h-4 w-4" />
								Appointment History
							</TabsTrigger>
						)}
						<TabsTrigger
							value="settings"
							className="w-full flex items-center justify-start sm:justify-center text-center whitespace-normal leading-tight gap-2 cursor-pointer"
						>
							<Settings className="h-4 w-4" />
							Account Settings
						</TabsTrigger>
					</TabsList>

					{user?.role === "student" && (
						<TabsContent value="history" className="space-y-6">
							<Assessment />
						</TabsContent>
					)}
					{user?.role === "student" && (
						<TabsContent value="appointment" className="space-y-6">
							<Appointment />
						</TabsContent>
					)}
					<TabsContent value="settings" className="space-y-6">
						<UserProfile />
					</TabsContent>
				</Tabs>
			</div>
		</Layout>
	);
};

export default Profile;
