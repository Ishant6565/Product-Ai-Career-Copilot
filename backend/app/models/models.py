import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    role = Column(String(50), default="job_seeker")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
    ai_analyses = relationship("AIAnalysis", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    target_role = Column(String(255), default="Full-Stack Software Engineer")
    experience_level = Column(String(50), default="Entry-Level / Graduate")
    phone = Column(String(50), nullable=True)
    location = Column(String(255), default="San Francisco, CA / Remote")
    preferred_locations = Column(JSON, default=list)
    job_types = Column(JSON, default=lambda: ["Full-time", "Remote"])
    min_salary = Column(Integer, default=95000)
    max_salary = Column(Integer, default=140000)
    currency = Column(String(10), default="USD")
    bio = Column(Text, nullable=True)
    education = Column(JSON, default=list)
    experience = Column(JSON, default=list)
    projects = Column(JSON, default=list)
    certifications = Column(JSON, default=list)
    links = Column(JSON, default=dict)
    profile_completion = Column(Integer, default=85)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="profile")


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False, index=True)
    category = Column(String(50), default="backend") # frontend, backend, cloud, ai_ml, database, soft
    proficiency = Column(String(50), default="Intermediate") # Beginner, Intermediate, Advanced, Expert
    years_experience = Column(Float, default=1.0)
    is_highlighted = Column(Boolean, default=False)

    user = relationship("User", back_populates="skills")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), default="Software Engineer General Resume")
    original_filename = Column(String(255), default="resume.pdf")
    file_path = Column(String(500), nullable=True)
    version = Column(Integer, default=1)
    is_primary = Column(Boolean, default=True)
    
    # Structured breakdown
    parsed_content = Column(JSON, default=dict)
    raw_text = Column(Text, nullable=True)
    
    # AI Audit Scores & Feedback
    overall_score = Column(Integer, default=88)
    ats_score = Column(Integer, default=92)
    impact_score = Column(Integer, default=84)
    structure_score = Column(Integer, default=90)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    missing_keywords = Column(JSON, default=list)
    improvement_suggestions = Column(JSON, default=list)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="resumes")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=False, index=True)
    location = Column(String(255), default="San Francisco, CA / Remote")
    is_remote = Column(Boolean, default=True)
    job_type = Column(String(50), default="Full-time") # Full-time, Internship, Contract
    experience_level = Column(String(50), default="Entry-level") # Entry-level, Mid-level, Senior
    salary_range = Column(String(100), default="$110k - $145k")
    min_salary = Column(Integer, default=110000)
    max_salary = Column(Integer, default=145000)
    description = Column(Text, nullable=False)
    responsibilities = Column(JSON, default=list)
    requirements = Column(JSON, default=list)
    required_skills = Column(JSON, default=list)
    preferred_skills = Column(JSON, default=list)
    company_logo = Column(String(500), nullable=True)
    apply_url = Column(String(500), default="https://careers.example.com")
    posted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    saved_by = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(String(36), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_by")


class Application(Base):
    __tablename__ = "applications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(String(36), ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True)
    company_name = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False)
    location = Column(String(255), default="Remote")
    job_url = Column(String(500), nullable=True)
    status = Column(String(50), default="applied") # saved, applied, screening, interview, offer, rejected
    applied_date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    salary_offered = Column(String(100), nullable=True)
    recruiter_name = Column(String(255), nullable=True)
    recruiter_email = Column(String(255), nullable=True)
    interview_date = Column(DateTime(timezone=True), nullable=True)
    follow_up_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    resume_id = Column(String(36), nullable=True)
    match_score = Column(Integer, default=85)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="applications")


class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    analysis_type = Column(String(50), nullable=False) # resume_optimization, cover_letter, interview_prep, skill_gap, job_match
    job_id = Column(String(36), nullable=True)
    resume_id = Column(String(36), nullable=True)
    title = Column(String(255), nullable=False)
    input_params = Column(JSON, default=dict)
    result_data = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="ai_analyses")
