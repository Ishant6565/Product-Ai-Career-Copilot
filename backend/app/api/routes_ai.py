from datetime import datetime, timezone
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.models import User, Resume, Job, UserProfile, UserSkill, AIAnalysis
from app.schemas.schemas import (
    ResumeOptimizeRequest, ResumeOptimizeResponse,
    CoverLetterGenerateRequest, CoverLetterResponse,
    InterviewPrepRequest, InterviewPrepResponse,
    InterviewAnswerEvaluateRequest, InterviewAnswerEvaluateResponse
)
from app.api.routes_auth import get_current_user
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI Copilot Tools"])

@router.post("/optimize-resume", response_model=ResumeOptimizeResponse)
async def optimize_resume(
    payload: ResumeOptimizeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch Resume
    resume = None
    if payload.resume_id:
        res_result = await db.execute(select(Resume).where(Resume.id == payload.resume_id, Resume.user_id == current_user.id))
        resume = res_result.scalars().first()
    if not resume:
        res_result = await db.execute(select(Resume).where(Resume.user_id == current_user.id).order_by(Resume.is_primary.desc()))
        resume = res_result.scalars().first()

    # Fetch Job
    job_data = {}
    if payload.job_id:
        job_result = await db.execute(select(Job).where(Job.id == payload.job_id))
        job = job_result.scalars().first()
        if job:
            job_data = {
                "title": job.title,
                "company": job.company,
                "description": job.description,
                "required_skills": job.required_skills or []
            }
    elif payload.job_description:
        job_data = {
            "title": payload.target_role or "Software Engineer",
            "company": "Target Company",
            "description": payload.job_description,
            "required_skills": ["TypeScript", "React", "Python", "FastAPI", "PostgreSQL"]
        }
    else:
        job_data = {
            "title": "Senior Full-Stack Engineer",
            "company": "Top Tier Tech",
            "description": "Building scalable web platforms with React and FastAPI.",
            "required_skills": ["TypeScript", "React", "Python", "FastAPI", "PostgreSQL", "Docker"]
        }

    resume_dict = {
        "title": resume.title if resume else "Standard Resume",
        "parsed_content": resume.parsed_content if resume else {},
        "raw_text": resume.raw_text if resume else ""
    }

    result = await ai_service.optimize_resume_bullets(resume_dict, job_data)
    
    # Store AI Analysis record
    analysis = AIAnalysis(
        user_id=current_user.id,
        analysis_type="resume_optimization",
        job_id=payload.job_id,
        resume_id=resume.id if resume else None,
        title=f"Resume Optimization for {job_data.get('title', 'Target Role')}",
        input_params={"job": job_data},
        result_data=result
    )
    db.add(analysis)
    await db.commit()

    return ResumeOptimizeResponse(**result)

@router.post("/generate-cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(
    payload: CoverLetterGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile_result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = profile_result.scalars().first()

    skill_result = await db.execute(select(UserSkill.skill_name).where(UserSkill.user_id == current_user.id))
    skills = skill_result.scalars().all() or ["TypeScript", "React", "Python", "FastAPI", "PostgreSQL"]

    profile_dict = {
        "full_name": current_user.full_name,
        "email": current_user.email,
        "location": profile.location if profile else "San Francisco, CA",
        "skills": skills,
        "experience": profile.experience if profile else []
    }

    job_title = payload.job_title
    company_name = payload.company_name
    job_description = payload.job_description or ""

    if payload.job_id:
        job_result = await db.execute(select(Job).where(Job.id == payload.job_id))
        job = job_result.scalars().first()
        if job:
            job_title = job.title
            company_name = job.company
            job_description = job.description

    job_dict = {
        "title": job_title or "Full-Stack Software Engineer",
        "company": company_name or "Innovative Tech Co",
        "description": job_description
    }

    result = await ai_service.generate_cover_letter(
        profile_dict,
        job_dict,
        tone=payload.tone,
        extra_notes=payload.extra_notes or ""
    )

    analysis = AIAnalysis(
        user_id=current_user.id,
        analysis_type="cover_letter",
        job_id=payload.job_id,
        title=f"Cover Letter for {job_dict['title']} at {job_dict['company']}",
        input_params={"tone": payload.tone, "job": job_dict},
        result_data=result
    )
    db.add(analysis)
    await db.commit()

    return CoverLetterResponse(**result)

@router.post("/interview-prep", response_model=InterviewPrepResponse)
async def generate_interview_prep(
    payload: InterviewPrepRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile_result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = profile_result.scalars().first()

    skill_result = await db.execute(select(UserSkill.skill_name).where(UserSkill.user_id == current_user.id))
    skills = skill_result.scalars().all()

    profile_dict = {
        "full_name": current_user.full_name,
        "target_role": profile.target_role if profile else "Software Engineer",
        "skills": skills or ["TypeScript", "Python", "System Design", "PostgreSQL"]
    }

    job_title = payload.job_title
    company_name = payload.company_name
    job_desc = payload.job_description or ""

    if payload.job_id:
        job_res = await db.execute(select(Job).where(Job.id == payload.job_id))
        job = job_res.scalars().first()
        if job:
            job_title = job.title
            company_name = job.company
            job_desc = job.description

    job_dict = {
        "title": job_title or "Software Engineer",
        "company": company_name or "Tech Leader",
        "description": job_desc
    }

    result = await ai_service.generate_interview_prep(profile_dict, job_dict, count=payload.question_count)
    return InterviewPrepResponse(**result)

@router.post("/evaluate-answer", response_model=InterviewAnswerEvaluateResponse)
async def evaluate_interview_answer(
    payload: InterviewAnswerEvaluateRequest,
    current_user: User = Depends(get_current_user)
):
    result = await ai_service.evaluate_interview_answer(
        question=payload.question,
        question_type=payload.question_type,
        answer=payload.user_answer
    )
    return InterviewAnswerEvaluateResponse(**result)
