import RouterNavLink from "@/components/RouterNavLink";
import { Brain } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slice/authSlice";
import { logout as resourceLogout } from "@/redux/slice/resourceSlice";
import { useNavigate } from "react-router";
import { Shield } from "lucide-react";
import { X } from "lucide-react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
	{ label: "Home", href: "/" },
	{ label: "Assessments", href: "/assessments" },
	{ label: "Resources", href: "/resources" },
	{ label: "Book Appointment", href: "/booking" },
];

const Navbar = () => {
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [mobileMenu, setMobileMenu] = useState(false);

	const handleLogout = async () => {
		console.log("logging out");
		dispatch(logout());
		dispatch(resourceLogout());
		navigate("/login", { replace: true });
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
			<div className="container flex h-16 items-center justify-between">
				<Link to="/" className="flex items-center gap-2 group">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
						<Brain className="h-5 w-5" />
					</div>
					<span className="text-xl font-semibold text-foreground">
						e-Psycho Support
					</span>
				</Link>

				{user && (
					<nav className="hidden md:flex items-center gap-1">
						{navItems.map((item) => (
							<RouterNavLink
								key={item.href}
								to={item.href}
								className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
								activeClassName="bg-sage-light text-foreground"
							>
								{item.label}
							</RouterNavLink>
						))}
					</nav>
				)}

				{!user && (
					<div className={`${user ? "hidden" : ""} flex items-center gap-3`}>
						<Link to={"/#crisis"}>
							<Button
								variant="calm"
								size="sm"
								className="cursor-pointer hidden sm:block"
							>
								Crisis Help
							</Button>
						</Link>
						<Link to={"/login"}>
							<Button variant="hero" size="sm" className="cursor-pointer">
								Get Started
							</Button>
						</Link>
					</div>
				)}

				{user && (
					<div className="hidden md:flex items-center gap-3">
						{user?.role !== "student" && (
							<Button
								variant="calm"
								size="sm"
								className="cursor-pointer"
								asChild
							>
								<Link to={"/admin"}>
									<Shield /> Admin
								</Link>
							</Button>
						)}
						<Button variant="calm" size="sm" className="cursor-pointer" asChild>
							<Link to={"/#crisis"}>Crisis Help</Link>
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Avatar>
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel className="font-bold">
									My Account
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="focus:bg-sage">
									<Link to="/profile">Profile</Link>
								</DropdownMenuItem>
								{user?.role === "student" && (
									<DropdownMenuItem className="focus:bg-sage" asChild>
										<Link to={"/profile?tab=appointment"}>Appointments</Link>
									</DropdownMenuItem>
								)}
								{user?.role === "student" && (
									<DropdownMenuItem className="focus:bg-sage" asChild>
										<Link to={"/profile?tab=history"}>Assessments</Link>
									</DropdownMenuItem>
								)}
								<DropdownMenuItem className="focus:bg-sage" asChild>
									<Link to={"/profile?tab=settings"}>Setting</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleLogout}
									className="focus:bg-sage cursor-pointer"
								>
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}

				{user && (
					<div className="md:hidden p-2 rounded-lg hover:bg-muted flex items-center gap-3">
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Avatar>
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel className="font-bold">
									My Account
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="focus:bg-sage">
									<Link to="/profile">Profile</Link>
								</DropdownMenuItem>
								{user?.role === "student" && (
									<DropdownMenuItem className="focus:bg-sage" asChild>
										<Link to={"/profile?tab=appointment"}>Appointments</Link>
									</DropdownMenuItem>
								)}
								{user?.role === "student" && (
									<DropdownMenuItem className="focus:bg-sage" asChild>
										<Link to={"/profile?tab=history"}>Assessments</Link>
									</DropdownMenuItem>
								)}
								<DropdownMenuItem className="focus:bg-sage" asChild>
									<Link to={"/profile?tab=settings"}>Setting</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleLogout}
									className="focus:bg-sage cursor-pointer"
								>
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<button
							className="md:hidden p-2 rounded-lg hover:bg-muted"
							onClick={() => setMobileMenu(!mobileMenu)}
						>
							{mobileMenu ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				)}
			</div>

			{mobileMenu && (
				<div className="md:hidden border-t border-border bg-background">
					<nav className="container py-4 flex flex-col gap-2">
						{user && (
							<div className="flex items-center justify-between gap-3">
								{user?.role !== "student" && (
									<Button
										variant="calm"
										size="sm"
										className="cursor-pointer"
										asChild
									>
										<Link to={"/admin"}>
											<Shield /> Admin
										</Link>
									</Button>
								)}
							</div>
						)}
						{user &&
							navItems.map((item) => (
								<Link
									key={item.href}
									to={item.href}
									onClick={() => setMobileMenu(false)}
									className={cn(
										"px-4 py-3 rounded-lg text-sm font-medium transition-colors",
										location.pathname === item.href
											? "bg-sage-light text-foreground"
											: "text-muted-foreground hover:text-foreground hover:bg-muted"
									)}
								>
									{item.label}
								</Link>
							))}
					</nav>
				</div>
			)}
		</header>
	);
};

export default Navbar;
