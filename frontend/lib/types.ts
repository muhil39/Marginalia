export type AgentStatusValue = "pending" | "running" | "done" | "failed";

export interface AgentStep {
  name: string;
  status: AgentStatusValue;
  detail: string;
  started_at: string | null;
  finished_at: string | null;
}

export interface UploadResponse {
  paper_id: string;
  filename: string;
  word_count: number;
  sections_detected: string[];
}

export interface NoveltyResult {
  novelty_score: number;
  innovation_score: number;
  confidence_score: number;
  strengths: string[];
  weaknesses: string[];
  research_gap_notes: string;
}

export interface SectionSuggestion {
  section: string;
  present: boolean;
  suggestions: string[];
}

export interface ImprovementResult {
  overall_quality_score: number;
  section_feedback: SectionSuggestion[];
  missing_information: string[];
  writing_suggestions: string[];
}

export interface FutureScopeResult {
  short_term: string[];
  medium_term: string[];
  long_term: string[];
  industrial_applications: string[];
  startup_opportunities: string[];
  patent_ideas: string[];
  phd_extensions: string[];
  grant_opportunities: string[];
}

export interface ReproducibilityChecklistItem {
  item: string;
  found: boolean;
  note: string;
}

export interface ReproducibilityResult {
  reproducibility_score: number;
  checklist: ReproducibilityChecklistItem[];
  summary: string;
}

export type PublicationRecommendation =
  | "Accept"
  | "Minor Revision"
  | "Major Revision"
  | "Reject";

export interface PublicationResult {
  recommendation: PublicationRecommendation;
  major_strengths: string[];
  major_weaknesses: string[];
  reviewer_comments: string[];
}

export interface AnalysisReport {
  paper_id: string;
  filename: string;
  generated_at: string;
  novelty: NoveltyResult;
  improvement: ImprovementResult;
  future_scope: FutureScopeResult;
  reproducibility: ReproducibilityResult;
  publication: PublicationResult;
}

export interface PipelineStatus {
  paper_id: string;
  steps: AgentStep[];
  complete: boolean;
  report: AnalysisReport | null;
}
