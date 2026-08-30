from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# ==================== Auth & User Schemas ====================
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    target_role: Optional[str] = "Full-Stack Software Engineer"
    experience_level: Optional[str] = "Entry-Level / Graduate"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    role: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ==================== Profile Schemas ====================
class SkillItem(BaseModel):
    skill_name: str
    category: str = "backend" # frontend, backend, cloud, database, soft
    proficiency: str = "Intermediate" # Beginner, Intermediate, Advanced, Expert
    years_experience: float = 1.0
    is_highlighted: bool = False

class EducationItem(BaseModel):
    degree: str
    institution: str
    year: str
    gpa: Optional[str] = None
    highlights: Optional[str] = None

class ExperienceItem(BaseModel):
    role: str
    company: str
    location: Optional[str] = None
    startDate: str
    endDate: str
    current: bool = False
    bullets: List[str] = []

class ProjectItem(BaseModel):
    title: str
    tech: List[str] = []
    description: str
    github: Optional[str] = None
    demo: Optional[str] = None

class CertificationItem(BaseModel):
    name: str
    issuer: str
    year: str

class UserProfileUpdate(BaseModel):
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    preferred_locations: Optional[List[str]] = None
    job_types: Optional[List[str]] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: Optional[str] = "USD"
    bio: Optional[str] = None
    education: Optional[List[EducationItem]] = None
    experience: Optional[List[ExperienceItem]] = None
    projects: Optional[List[ProjectItem]] = None
    certifications: Optional[List[CertificationItem]] = None
    links: Optional[Dict[str, str]] = None
    skills: Optional[List[SkillItem]] = None

class UserProfileOut(BaseModel):
    id: str
    user_id: str
    target_role: str
    experience_level: str
    phone: Optional[str] = None
    location: str
    preferred_locations: List[str] = []
    job_types: List[str] = []
    min_salary: int
    max_salary: int
    currency: str
    bio: Optional[str] = None
    education: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    certifications: List[Dict[str, Any]] = []
    links: Dict[str, str] = {}
    profile_completion: int
    skills: List[SkillItem] = []
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ==================== Resume Schemas ====================
class ImprovementSuggestion(BaseModel):
    section: str
    current: str
    suggested: str
    impact: str = "High"

class ResumeOut(BaseModel):
    id: str
    user_id: str
    title: str
    original_filename: str
    version: int
    is_primary: bool
    overall_score: int
    ats_score: int
    impact_score: int
    structure_score: int
    strengths: List[str] = []
    weaknesses: List[str] = []
    missing_keywords: List[str] = []
    improvement_suggestions: List[Dict[str, Any]] = []
    parsed_content: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ResumeUploadResponse(BaseModel):
    message: str
    resume: ResumeOut

# ==================== Job Schemas ====================
class JobOut(BaseModel):
    id: str
    title: str
    company: str
    location: str
    is_remote: bool
    job_type: str
    experience_level: str
    salary_range: str
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    description: str
    responsibilities: List[str] = []
    requirements: List[str] = []
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    company_logo: Optional[str] = None
    apply_url: Optional[str] = None
    posted_at: datetime
    is_featured: bool
    is_saved: Optional[bool] = False
    match_score: Optional[int] = 85
    matching_skills: Optional[List[str]] = []
    missing_skills: Optional[List[str]] = []

    model_config = ConfigDict(from_attributes=True)

class CustomJDAnalyzeRequest(BaseModel):
    title: Optional[str] = "Target Job Description"
    company: Optional[str] = "Target Company"
    description: str
    resume_id: Optional[str] = None

class JobMatchDetail(BaseModel):
    overall_match: int
    skill_fit_score: int
    experience_fit_score: int
    education_fit_score: int
    matching_skills: List[str]
    missing_skills: List[str]
    why_it_matches: str
    recommended_resume_version: str
    key_recommendations: List[str]

# ==================== Application Schemas ====================
class ApplicationCreate(BaseModel):
    job_id: Optional[str] = None
    company_name: str
    job_title: str
    location: Optional[str] = "Remote"
    job_url: Optional[str] = None
    status: str = "applied"
    salary_offered: Optional[str] = None
    recruiter_name: Optional[str] = None
    recruiter_email: Optional[str] = None
    interview_date: Optional[datetime] = None
    follow_up_date: Optional[datetime] = None
    notes: Optional[str] = None
    resume_id: Optional[str] = None
    match_score: Optional[int] = 85

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    location: Optional[str] = None
    job_url: Optional[str] = None
    salary_offered: Optional[str] = None
    recruiter_name: Optional[str] = None
    recruiter_email: Optional[str] = None
    interview_date: Optional[datetime] = None
    follow_up_date: Optional[datetime] = None
    notes: Optional[str] = None
    match_score: Optional[int] = None

class ApplicationOut(BaseModel):
    id: str
    user_id: str
    job_id: Optional[str] = None
    company_name: str
    job_title: str
    location: str
    job_url: Optional[str] = None
    status: str
    applied_date: Optional[datetime] = None
    salary_offered: Optional[str] = None
    recruiter_name: Optional[str] = None
    recruiter_email: Optional[str] = None
    interview_date: Optional[datetime] = None
    follow_up_date: Optional[datetime] = None
    notes: Optional[str] = None
    resume_id: Optional[str] = None
    match_score: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ==================== AI Copilot Schemas ====================
class ResumeOptimizeRequest(BaseModel):
    resume_id: Optional[str] = None
    job_id: Optional[str] = None
    job_description: Optional[str] = None
    target_role: Optional[str] = None

class BulletOptimization(BaseModel):
    original: str
    optimized: str
    impact_explanation: str
    added_keywords: List[str]

class ResumeOptimizeResponse(BaseModel):
    target_job: str
    ats_score_before: int
    ats_score_projected: int
    matching_keywords: List[str]
    missing_critical_keywords: List[str]
    optimized_summary: str
    bullet_improvements: List[BulletOptimization]
    skills_to_highlight: List[str]

class CoverLetterGenerateRequest(BaseModel):
    job_id: Optional[str] = None
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    job_description: Optional[str] = None
    resume_id: Optional[str] = None
    tone: str = "Confident & Impact-Driven"
    extra_notes: Optional[str] = None

class CoverLetterResponse(BaseModel):
    recipient: str
    subject_line: str
    opening_hook: str
    body_paragraphs: List[str]
    call_to_action: str
    full_markdown: str

class InterviewPrepRequest(BaseModel):
    job_id: Optional[str] = None
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    job_description: Optional[str] = None
    question_count: int = 5
    type: str = "all"

class InterviewQuestion(BaseModel):
    id: str
    type: str
    question: str
    context_rationale: str
    star_guide: Dict[str, str]
    ideal_talking_points: List[str]
    sample_strong_response: str

class InterviewPrepResponse(BaseModel):
    role: str
    company: str
    readiness_score: int
    questions: List[InterviewQuestion]

class InterviewAnswerEvaluateRequest(BaseModel):
    question: str
    question_type: str
    user_answer: str
    target_role: Optional[str] = "Software Engineer"

class InterviewAnswerEvaluateResponse(BaseModel):
    score: int
    star_breakdown: Dict[str, str]
    strengths: List[str]
    weaknesses: List[str]
    suggested_rewrite: str
    coach_tip: str

# ==================== Analytics Schemas ====================
class AnalyticsOverviewResponse(BaseModel):
    total_applications: int
    interviews_scheduled: int
    offers_received: int
    average_match_score: int
    interview_conversion_rate: float
    response_rate: float
    applications_by_status: Dict[str, int]
    weekly_applications: List[Dict[str, Any]]
    top_in_demand_skills: List[Dict[str, Any]]
    skill_gap_matrix: List[Dict[str, Any]]
