import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { setResources } from "@/redux/slice/resourceSlice";
import { ExternalLink } from "lucide-react";
import { Clock } from "lucide-react";
import { Globe } from "lucide-react";
import { Play } from "lucide-react";
import { Info } from "lucide-react";
import { Video } from "lucide-react";
import { Headphones } from "lucide-react";
import { FileText } from "lucide-react";
import { BookOpen } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import useGetQuery from "@/hooks/useGetQuery";
import { createResourceUsage, fetchResources } from "@/lib/apiServices";
import useAppMutation from "@/hooks/useAppMutation";

const CATEGORIES = [
	{ id: "all", label: "All Resouces" },
	{ id: "stress", label: "Stress" },
	{ id: "anxiety", label: "Anxiety" },
	{ id: "sleep", label: "Sleep" },
	{ id: "exam_pressure", label: "Exam Pressure" },
	{ id: "relationship", label: "Relationship" },
];

const TYPE = [
	{ id: "article", label: "Article", Icon: FileText },
	{ id: "video", label: "Video", Icon: Video },
	{ id: "audio", label: "Audio", Icon: Headphones },
	{ id: "NA", label: "NIL" },
];

const Resources = () => {
	const dispatch = useDispatch();
	const [resourceCat, setResourceCat] = useState("all");
	const [resourceType, setResourceType] = useState("");
	const [selectedResource, setSelectedResource] = useState("");
	const [open, setOpen] = useState(false);

	const handleResourceCat = (e) => {
		setResourceCat(e);
	};

	const handleResourceType = (e) => {
		setResourceType(e);
	};

	const { data: resources, isSuccess: isFetchResourcesSuccess } = useGetQuery({
		queryKey: ["resources"],
		queryFn: fetchResources,
		staleTime: 1 * 60 * 1000,
	});

	const {
		mutate: resourceUsage,
		isError: isResourceUsageError,
		error: resourceUsageError,
	} = useAppMutation({
		mutationFn: createResourceUsage,
		invalidateQueries: {
			queryKey: ["resources", "topResources"],
		},
	});

	useEffect(() => {
		if (!isFetchResourcesSuccess) return;

		dispatch(setResources(resources));
	}, [isFetchResourcesSuccess, dispatch, resources]);

	const ResourceIcon = ({ type }) => {
		const typeConfig = TYPE.find((t) => t.id === type);

		if (!typeConfig?.Icon) return <Info />;

		const Icon = typeConfig.Icon;

		return <Icon className="h-6 w-6" />;
	};

	const handleClick = (resource) => {
		if (resource.type === "article")
			window.open(resource.url, "_blank", "noopener,noreferrer");
		else {
			setSelectedResource(resource);
			setOpen(true);
		}
		resourceUsage({ resourceId: resource?.id });
	};

	const getYouTubeId = (url) => {
		try {
			const parsedUrl = new URL(url);

			if (parsedUrl.hostname === "youtu.be") {
				return parsedUrl.pathname.slice(1);
			}

			return parsedUrl.searchParams.get("v");
		} catch {
			return null;
		}
	};

	return (
		<Layout>
			<div className="container py-12 md:py-16">
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light border border-sage/20 text-sm font-medium mb-4">
						<BookOpen className="h-4 w-4 text-primary" />
						<span>Wellness Library</span>
					</div>
					<h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
						Resource Center
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Access guided meditations, wellness videos, and mental health guides
						in multiple languages to support your journey.
					</p>
				</div>

				<div className="flex flex-wrap justify-center gap-2 mb-10">
					{CATEGORIES.map((category) => (
						<Button
							key={category.id}
							variant={category.id === resourceCat ? "hero" : "calm"}
							size={"sm"}
							className={"cursor-pointer"}
							onClick={() => handleResourceCat(category.id)}
						>
							{category.label}
						</Button>
					))}
				</div>

				<div className="flex gap-3 justify-center items-center mb-10">
					<Input type="text" placeholder="Type to search" className={"w-72"} />
					<Select onValueChange={handleResourceType}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Type of Content" />
						</SelectTrigger>
						<SelectContent>
							{TYPE.map((type) => (
								<SelectItem key={type.id} value={type.id}>
									{type.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{resources?.map((resource) => (
						<Card
							variant="resource"
							key={resource?.id}
							className={"group cursor-pointer"}
						>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3">
										<ResourceIcon type={resource?.type} />
									</div>
									<Button
										variant={"ghost"}
										size={"icon"}
										className={
											"opacity-0 group-hover:opacity-100 transition-opacity"
										}
										onClick={() => handleClick(resource)}
									>
										{resource.type === "article" ? (
											<ExternalLink className="h-5 w-5" />
										) : (
											<Play className="h-5 w-5" />
										)}
									</Button>
								</div>
								<CardTitle className="group-hover:text-primary transition-colors">
									{resource?.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<CardDescription className="text-base">
									{resource?.description}
								</CardDescription>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									{resource?.type !== "article" && (
										<div className="flex items-center gap-1">
											<Clock className="h-4 w-4" />
										</div>
									)}
									<div className="flex items-center gap-1">
										<Globe className="h-4 w-4" />
										<span>{resource.language}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{selectedResource?.title}</DialogTitle>
							<DialogDescription>
								{selectedResource?.description}
								<iframe
									height="315"
									className="w-full"
									src={`https://www.youtube.com/embed/${getYouTubeId(
										selectedResource?.url
									)}`}
									title="YouTube video player"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									referrerPolicy="strict-origin-when-cross-origin"
									allowFullScreen
								></iframe>
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
		</Layout>
	);
};

export default Resources;
