import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { History } from "lucide-react";
import AssessmentCard from "./AssessmentCard";
import { Brain } from "lucide-react";
import AssessmentHistory from "./AssessmentHistory";
import { Heart } from "lucide-react";

const TabView = ({ setSelectedAssessment, setResult }) => {
	const [activeTab, setActiveTab] = useState("assessments");

	const handleSelectAssessment = (type) => {
		setSelectedAssessment(type);
		setResult(null);
	};

	return (
		<Tabs
			value={activeTab}
			onValueChange={setActiveTab}
			className="max-w-4xl mx-auto"
		>
			<TabsList className="grid w-full grid-cols-2 mb-8">
				<TabsTrigger value="assessments" className="gap-2 cursor-pointer">
					<ClipboardCheck className="h-4 2-4" />
					Mental Health Assessments
				</TabsTrigger>
				<TabsTrigger value="history" className="gap-2 cursor-pointer">
					<History className="h-4 w-4" />
					History
				</TabsTrigger>
			</TabsList>
			<TabsContent value="assessments">
				<div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
					<AssessmentCard
						title="PHQ-9 Depression Screening"
						description="A 9-question assessment to evaluate symptoms of depression over the past 2 weeks. Takes about 3-5 minutes."
						icon={Brain}
						color="bg-sky"
						onClick={() => handleSelectAssessment("phq9")}
					/>
					<AssessmentCard
						title="GAD-7 Anxiety Screening"
						description="A 7-question assessment to measure anxiety symptoms and their severity. Takes about 2-4 minutes."
						icon={Heart}
						color="bg-lavender"
						onClick={() => handleSelectAssessment("gad7")}
					/>
				</div>
			</TabsContent>
			<TabsContent value="history">
				<AssessmentHistory />
			</TabsContent>
		</Tabs>
	);
};

export default TabView;
