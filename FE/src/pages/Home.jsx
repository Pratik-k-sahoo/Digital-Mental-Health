import Layout from "@/components/layout/Layout";
import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { MessageCircle } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Calendar } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Heart } from "lucide-react";
import { Phone } from "lucide-react";

const stats = [
	{ value: "24/7", label: "Support Available" },
	{ value: "100%", label: "Confidential" },
	{ value: "5min", label: "Avg Response Time" },
	{ value: "10+", label: "Languages Supported" },
];

const features = [
	{
		icon: MessageCircle,
		title: "AI Support Chat",
		description:
			"Get instant, confidential support with our AI-powered chat assistant trained in mental health first aid.",
		href: "/chat",
		color: "bg-sky-light text-sky",
	},
	{
		icon: Calendar,
		title: "Book Appointments",
		description:
			"Schedule confidential sessions with campus counsellors at your convenience.",
		href: "/booking",
		color: "bg-lavender-light text-lavender",
	},
	{
		icon: BookOpen,
		title: "Resource Hub",
		description:
			"Access guided meditations, wellness videos, and mental health guides in multiple languages.",
		href: "/resources",
		color: "bg-peach-light text-peach",
	},
	{
		icon: Users,
		title: "Peer Support",
		description:
			"Connect with trained student volunteers in our moderated peer support community.",
		href: "/community",
		color: "bg-sage-light text-sage",
	},
];

const moods = ["😊 Great", "🙂 Good", "😐 Okay", "😔 Low", "😢 Struggling"];

const Home = () => {
	return (
		<Layout>
			<div className="min-h-[calc(100vh-4.026rem)]">
				<section className="py-20 md:py-37">
					<div className="container flex md:flex-row justify-center items-center">
						<div className="max-w-3xl mx-auto text-center animate-fade-in">
							<div className="inline-flex items-center bg-sage-light border border-sage/20 py-2 px-5 text-foreground font-extrabold text-sm font-mono rounded-full gap-2 mb-6">
								<Sparkles className="text-primary h-4 w-4" />
								<span>Your wellbeing, your space</span>
							</div>

							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
								Your Safe Space for{" "}
							</h1>
							<h1 className="text-primary text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
								Mental Wellness
							</h1>

							<p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
								A confidential, stigma-free platform designed for students. Get
								AI-powered support, access resources, and connect with
								professionals—all in one place.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link to="/chat">
									<Button variant="hero" size="xl" className="cursor-pointer">
										<MessageCircle className="h-5 w-5" />
										Start Chatting Now
									</Button>
								</Link>
								<Link to="/resources">
									<Button
										variant="outline"
										size="xl"
										className="cursor-pointer"
									>
										Explore Resources
										<ArrowRight className="h-5 w-5" />
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section className="py-12 border-y border-border bg-muted">
					<div className="container">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
							{stats.map((stat, idx) => (
								<div
									key={idx}
									className={`text-center animate-fade-in-delay-2`}
								>
									<div className="text-3xl md:text-4xl font-bold text-primary mb-1">
										{stat.value}
									</div>
									<div className="text-sm text-muted-foreground">
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="py-20 md:py-28">
					<div className="container">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
								How We Support You ?
							</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
								Comprehensive mental health support tailored for students in
								higher education.
							</p>
						</div>
						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
							{features.map((feature) => (
								<Link key={feature.title} to={feature.href}>
									<Card
										variant="feature"
										className={`h-full cursor-pointer animate-fade-in-delay-1`}
									>
										<CardHeader>
											<div
												className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-3`}
											>
												<feature.icon className="h-6 w-6" />
											</div>
											<CardTitle>{feature.title}</CardTitle>
										</CardHeader>
										<CardContent className="text-base">
											{feature.description}
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</div>
				</section>

				<section className="py-20 gradient-calm" id="crisis">
					<div className="container">
						<div className="max-w-3xl mx-auto text-center">
							<div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-card border border-border text-sm font-semibold mb-6">
								<Shield className="h-4 w-4 text-primary" />
								<span>100% Confidential & Secure</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
								You're Not Alone in This
							</h2>
							<p className="text-lg text-muted-foreground mb-8">
								Whether you're dealing with stress, anxiety, or just need
								someone to talk to, we're here for you. Take the first step
								towards better mental health today.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link to="/chat">
									<Button variant="hero" size="lg" className="cursor-pointer">
										<Heart className="h-5 w-5" />
										Get Support Now
									</Button>
								</Link>
								<Link to="tel:988">
									<Button variant="calm" size="lg" className="cursor-pointer">
										<Phone className="h-5 w-5" />
										Crisis Helpline: 988
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section className="py-20">
					<div className="container">
						<Card
							variant="feature"
							className="max-w-2xl mx-auto overflow-hidden p-0"
						>
							<div className="bg-linear-to-r from-sage-light to-sky-light p-8 md:p-10 h-full">
								<h3 className="text-2xl font-bold text-foreground mb-2">
									How are you feeling today ?
								</h3>
								<p className="text-muted-foreground mb-6">
									Take a quick mood check to get personalized recommendations.
								</p>
								<div className="flex flex-wrap gap-3">
									{moods.map((mood) => (
										<Button
											key={mood}
											variant="calm"
											className="text-base"
											asChild
										>
											<Link to="/chat">{mood}</Link>
										</Button>
									))}
								</div>
							</div>
						</Card>
					</div>
				</section>
			</div>
		</Layout>
	);
};

export default Home;
