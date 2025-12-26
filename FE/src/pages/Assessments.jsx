import QuestionnaireView from "@/components/assessments/QuestionnaireView";
import ResultsView from "@/components/assessments/ResultsView";
import TabView from "@/components/assessments/TabView";
import Layout from "@/components/layout/Layout";
import { ClipboardCheck } from "lucide-react";
import React from "react";
import { useState } from "react";

const Assessments = () => {
	const [selectedAssessment, setSelectedAssessment] = useState(null);
	const [result, setResult] = useState(null);

	return (
		<Layout>
			<main className="min-h-[calc(100vh-4.026rem)] bg-background">
				<section className="py-16 bg-linear-to-b from-sage/30 to-background">
					<div className="container text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
							<ClipboardCheck className="h-4 w-4" />
							Confidential & Anonymous
						</div>
						<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
							Mental Health Assessments
						</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Take standardized screening tests to understand your stress and
							anxiety levels. Your responses are completely private and
							confidential.
						</p>
					</div>
				</section>

				<section className="py-12 container">
					{!selectedAssessment ? (
						<TabView
							setSelectedAssessment={setSelectedAssessment}
							setResult={setResult}
						/>
					) : result ? (
						<ResultsView
							result={result}
							setResult={setResult}
							setSelectedAssessment={setSelectedAssessment}
						/>
					) : (
						<QuestionnaireView
							type={selectedAssessment}
							setResult={setResult}
							setSelectedAssessment={setSelectedAssessment}
						/>
					)}
				</section>
			</main>
		</Layout>
	);
};

export default Assessments;
