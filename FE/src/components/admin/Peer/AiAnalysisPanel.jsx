import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { Clock } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { Heart } from 'lucide-react';
import { Brain } from 'lucide-react';
import React from 'react'
import ScoreBar from './ScoreBar';

const AiAnalysisPanel = ({analysis}) => {
  const recColor =
		{
			approve: "bg-green-500",
			approve_supervised: "bg-green-400",
			interview: "bg-yellow-500",
			reject: "bg-red-500",
		}[analysis.decision] || "bg-muted";
  return (
		<div className="space-y-4 p-4 rounded-lg border bg-linear-to-br from-primary/5 to-transparent">
			<div className="flex items-center justify-between">
				<h4 className="font-semibold flex items-center gap-2">
					<Brain className="h-4 w-4 text-primary" /> AI Analysis
				</h4>
				<div className="flex items-center gap-2">
					<Badge className={recColor}>
						{analysis.decision.replace("_", " ")}
					</Badge>
					<span className="text-lg font-bold text-primary">
						{analysis.confidenceScore}/10
					</span>
				</div>
			</div>

			<p className="text-sm text-muted-foreground">{analysis.summary}</p>

			<div className="grid gap-2">
				<ScoreBar label="Empathy" score={analysis.empathy} icon={Heart} />
				<ScoreBar
					label="Boundaries"
					score={analysis.boundaryAwareness}
					icon={ShieldCheck}
				/>
				<ScoreBar
					label="Crisis Handling"
					score={analysis.crisisHandling}
					icon={AlertTriangle}
				/>
				<ScoreBar
					label="Communication"
					score={analysis.communication}
					icon={MessageCircle}
				/>
				<ScoreBar
					label="Emotional Stability"
					score={analysis.emotionalStability}
					icon={Clock}
				/>
			</div>

			{analysis.strength.length > 0 && (
				<div>
					<Label className="text-xs font-medium text-green-700">
						Strengths
					</Label>
					<ul className="text-sm text-muted-foreground list-disc pl-4 mt-1 space-y-0.5">
						{analysis.strength.map((s, i) => (
							<li key={i}>{s}</li>
						))}
					</ul>
				</div>
			)}

			{analysis.concern.length > 0 && (
				<div>
					<Label className="text-xs font-medium text-yellow-700">
						Concerns
					</Label>
					<ul className="text-sm text-muted-foreground list-disc pl-4 mt-1 space-y-0.5">
						{analysis.concern.map((c, i) => (
							<li key={i}>{c}</li>
						))}
					</ul>
				</div>
			)}

			{analysis.riskFlags.length > 0 && (
				<div>
					<Label className="text-xs font-medium text-red-700">Red Flags</Label>
					<ul className="text-sm text-destructive list-disc pl-4 mt-1 space-y-0.5">
						{analysis.riskFlags.map((r, i) => (
							<li key={i}>{r}</li>
						))}
					</ul>
				</div>
			)}

			{analysis.recommendationNotes && (
				<p className="text-xs text-muted-foreground italic border-t pt-2">
					{analysis.recommendationNotes}
				</p>
			)}
		</div>
	);
}

export default AiAnalysisPanel