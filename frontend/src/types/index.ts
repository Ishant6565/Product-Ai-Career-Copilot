export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

export interface SkillItem {
  skill_name: string;
  category: 'frontend' | 'backend' | 'cloud' | 'database' | 'ai_ml' | 'soft' | string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | string;
  years_experience: number;
  is_highlighted: boolean;
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
  highlights?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ProjectItem {
  title: string;
  tech: string[];
  description: string;
  github?: string;
  demo?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  target_role: string;
  experience_level: string;
  phone?: string;
  location: string;
  preferred_locations: string[];
  job_types: string[];
  min_salary: number;
  max_salary: number;
  currency: string;
  bio?: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  links: Record<string, string>;
  profile_completion: number;
  skills: SkillItem[];
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  original_filename: string;
  version: number;
  is_primary: boolean;
  overall_score: number;
  ats_score: number;
  impact_score: number;
  structure_score: number;
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  improvement_suggestions: Array<{
    section: string;
    current: string;
    suggested: string;
    impact: string;
  }>;
  raw_text?: string;
  parsed_content: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  is_remote: boolean;
  job_type: string;
  experience_level: string;
  salary_range: string;
  min_salary?: number;
  max_salary?: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  required_skills: string[];
  preferred_skills: string[];
  company_logo?: string;
  apply_url?: string;
  posted_at: string;
  is_featured: boolean;
  is_saved?: boolean;
  match_score?: number;
  matching_skills?: string[];
  missing_skills?: string[];
}

export interface JobMatchDetail {
  overall_match: number;
  skill_fit_score: number;
  experience_fit_score: number;
  education_fit_score: number;
  matching_skills: string[];
  missing_skills: string[];
  why_it_matches: string;
  recommended_resume_version: string;
  key_recommendations: string[];
}

export type ApplicationStage = 'saved' | 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id: string;
  user_id: string;
  job_id?: string;
  company_name: string;
  job_title: string;
  location: string;
  job_url?: string;
  status: ApplicationStage;
  applied_date?: string;
  salary_offered?: string;
  recruiter_name?: string;
  recruiter_email?: string;
  interview_date?: string;
  follow_up_date?: string;
  notes?: string;
  resume_id?: string;
  match_score: number;
  created_at: string;
  updated_at: string;
}

export interface BulletOptimization {
  original: string;
  optimized: string;
  impact_explanation: string;
  added_keywords: string[];
}

export interface ResumeOptimizeResponse {
  target_job: string;
  ats_score_before: number;
  ats_score_projected: number;
  matching_keywords: string[];
  missing_critical_keywords: string[];
  optimized_summary: string;
  bullet_improvements: BulletOptimization[];
  skills_to_highlight: string[];
}

export interface CoverLetterResponse {
  recipient: string;
  subject_line: string;
  opening_hook: string;
  body_paragraphs: string[];
  call_to_action: string;
  full_markdown: string;
}

export interface InterviewQuestion {
  id: string;
  type: 'behavioral' | 'technical' | 'situational' | string;
  question: string;
  context_rationale: string;
  star_guide: {
    Situation: string;
    Task: string;
    Action: string;
    Result: string;
  };
  ideal_talking_points: string[];
  sample_strong_response: string;
}

export interface InterviewPrepResponse {
  role: string;
  company: string;
  readiness_score: number;
  questions: InterviewQuestion[];
}

export interface InterviewAnswerEvaluation {
  score: number;
  star_breakdown: {
    Situation: string;
    Task: string;
    Action: string;
    Result: string;
  };
  strengths: string[];
  weaknesses: string[];
  suggested_rewrite: string;
  coach_tip: string;
}

export interface AnalyticsOverview {
  total_applications: number;
  interviews_scheduled: number;
  offers_received: number;
  average_match_score: number;
  interview_conversion_rate: number;
  response_rate: number;
  applications_by_status: Record<string, number>;
  weekly_applications: Array<{ week: string; applications: number; interviews: number }>;
  top_in_demand_skills: Array<{ skill: string; demand_percentage: number; user_has: boolean }>;
  skill_gap_matrix: Array<{ skill: string; impact: string; missing_in_jobs: number; estimated_hours: number; recommended_action: string }>;
}
