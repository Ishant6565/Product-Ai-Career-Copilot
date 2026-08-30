from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_
from app.db.session import get_db
from app.models.models import User, Job, SavedJob, UserSkill, UserProfile, Resume
from app.schemas.schemas import JobOut, JobMatchDetail, CustomJDAnalyzeRequest
from app.api.routes_auth import get_current_user
from app.services.ai_service import ai_service

router = APIRouter(prefix="/jobs", tags=["Jobs"])

async def calculate_job_match(user_skills: List[str], job: Job) -> tuple[int, List[str], List[str]]:
    user_skills_lower = {s.lower(): s for s in user_skills}
    req_skills = job.required_skills or []
    pref_skills = job.preferred_skills or []
    
    matching = []
    missing = []
    
    for s in req_skills:
        if s.lower() in user_skills_lower:
            matching.append(s)
        else:
            missing.append(s)
            
    for s in pref_skills:
        if s.lower() in user_skills_lower and s not in matching:
            matching.append(s)
            
    total = max(1, len(req_skills) + len(pref_skills))
    match_pct = int((len(matching) / total) * 45 + 50)
    match_pct = min(98, max(55, match_pct))
    
    return match_pct, matching, missing

@router.get("", response_model=List[JobOut])
async def list_jobs(
    search: Optional[str] = Query(None),
    job_type: Optional[str] = Query(None),
    experience_level: Optional[str] = Query(None),
    is_remote: Optional[bool] = Query(None),
    min_match: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch User Skills
    skill_result = await db.execute(select(UserSkill.skill_name).where(UserSkill.user_id == current_user.id))
    user_skills = skill_result.scalars().all()
    if not user_skills:
        user_skills = ["TypeScript", "React", "Python", "FastAPI", "PostgreSQL", "Docker"]

    # Fetch Saved Job IDs
    saved_result = await db.execute(select(SavedJob.job_id).where(SavedJob.user_id == current_user.id))
    saved_job_ids = set(saved_result.scalars().all())

    # Build Query
    query = select(Job)
    conditions = []
    
    if search:
        search_fmt = f"%{search.lower()}%"
        conditions.append(
            or_(
                Job.title.ilike(search_fmt),
                Job.company.ilike(search_fmt),
                Job.description.ilike(search_fmt)
            )
        )
    if job_type and job_type != "All":
        conditions.append(Job.job_type == job_type)
    if experience_level and experience_level != "All":
        conditions.append(Job.experience_level == experience_level)
    if is_remote is not None:
        conditions.append(Job.is_remote == is_remote)

    if conditions:
        query = query.where(and_(*conditions))

    query = query.order_by(Job.is_featured.desc(), Job.posted_at.desc())
    result = await db.execute(query)
    jobs = result.scalars().all()

    output = []
    for job in jobs:
        match_score, matching, missing = await calculate_job_match(user_skills, job)
        if min_match and match_score < min_match:
            continue
        
        job_dict = {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "is_remote": job.is_remote,
            "job_type": job.job_type,
            "experience_level": job.experience_level,
            "salary_range": job.salary_range,
            "min_salary": job.min_salary,
            "max_salary": job.max_salary,
            "description": job.description,
            "responsibilities": job.responsibilities or [],
            "requirements": job.requirements or [],
            "required_skills": job.required_skills or [],
            "preferred_skills": job.preferred_skills or [],
            "company_logo": job.company_logo,
            "apply_url": job.apply_url,
            "posted_at": job.posted_at,
            "is_featured": job.is_featured,
            "is_saved": job.id in saved_job_ids,
            "match_score": match_score,
            "matching_skills": matching,
            "missing_skills": missing
        }
        output.append(JobOut(**job_dict))

    return output

@router.get("/saved/list", response_model=List[JobOut])
async def list_saved_jobs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    saved_result = await db.execute(
        select(Job).join(SavedJob, SavedJob.job_id == Job.id).where(SavedJob.user_id == current_user.id)
    )
    jobs = saved_result.scalars().all()
    
    skill_result = await db.execute(select(UserSkill.skill_name).where(UserSkill.user_id == current_user.id))
    user_skills = skill_result.scalars().all()

    output = []
    for job in jobs:
        match_score, matching, missing = await calculate_job_match(user_skills, job)
        job_dict = {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "is_remote": job.is_remote,
            "job_type": job.job_type,
            "experience_level": job.experience_level,
            "salary_range": job.salary_range,
            "min_salary": job.min_salary,
            "max_salary": job.max_salary,
            "description": job.description,
            "responsibilities": job.responsibilities or [],
            "requirements": job.requirements or [],
            "required_skills": job.required_skills or [],
            "preferred_skills": job.preferred_skills or [],
            "company_logo": job.company_logo,
            "apply_url": job.apply_url,
            "posted_at": job.posted_at,
            "is_featured": job.is_featured,
            "is_saved": True,
            "match_score": match_score,
            "matching_skills": matching,
            "missing_skills": missing
        }
        output.append(JobOut(**job_dict))
    return output

@router.get("/{job_id}", response_model=JobOut)
async def get_job_detail(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    skill_result = await db.execute(select(UserSkill.skill_name).where(UserSkill.user_id == current_user.id))
    user_skills = skill_result.scalars().all()

    saved_check = await db.execute(
        select(SavedJob).where(SavedJob.user_id == current_user.id, SavedJob.job_id == job.id)
    )
    is_saved = bool(saved_check.scalars().first())

    match_score, matching, missing = await calculate_job_match(user_skills, job)

    job_dict = {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "is_remote": job.is_remote,
        "job_type": job.job_type,
        "experience_level": job.experience_level,
        "salary_range": job.salary_range,
        "min_salary": job.min_salary,
        "max_salary": job.max_salary,
        "description": job.description,
        "responsibilities": job.responsibilities or [],
        "requirements": job.requirements or [],
        "required_skills": job.required_skills or [],
        "preferred_skills": job.preferred_skills or [],
        "company_logo": job.company_logo,
        "apply_url": job.apply_url,
        "posted_at": job.posted_at,
        "is_featured": job.is_featured,
        "is_saved": is_saved,
        "match_score": match_score,
        "matching_skills": matching,
        "missing_skills": missing
    }
    return JobOut(**job_dict)

@router.get("/{job_id}/match-report", response_model=JobMatchDetail)
async def get_job_match_report(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Fetch User Profile & Skills
    profile_res = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = profile_res.scalars().first()
    
    skill_res = await db.execute(select(UserSkill.skill_name).where(UserSkill.user_id == current_user.id))
    user_skills = skill_res.scalars().all()

    profile_dict = {
        "full_name": current_user.full_name,
        "target_role": profile.target_role if profile else "Software Engineer",
        "skills": user_skills or ["TypeScript", "React", "Python", "PostgreSQL", "Docker"],
        "experience": profile.experience if profile else []
    }

    job_dict = {
        "title": job.title,
        "company": job.company,
        "description": job.description,
        "required_skills": job.required_skills or [],
        "preferred_skills": job.preferred_skills or []
    }

    match_analysis = await ai_service.match_job_to_profile(profile_dict, job_dict)
    return JobMatchDetail(**match_analysis)

@router.post("/{job_id}/save")
async def toggle_save_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(SavedJob).where(SavedJob.user_id == current_user.id, SavedJob.job_id == job_id)
    )
    existing = result.scalars().first()
    if existing:
        await db.delete(existing)
        await db.commit()
        return {"saved": False, "message": "Job removed from saved list."}
    else:
        new_save = SavedJob(user_id=current_user.id, job_id=job_id)
        db.add(new_save)
        await db.commit()
        return {"saved": True, "message": "Job saved successfully."}

@router.post("/analyze-jd", response_model=JobMatchDetail)
async def analyze_custom_jd(
    payload: CustomJDAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Instant AI analysis of custom pasted Job Description"""
    skill_res = await db.execute(select(UserSkill.skill_name).where(UserSkill.user_id == current_user.id))
    user_skills = skill_res.scalars().all() or ["TypeScript", "React", "Python", "FastAPI", "Docker"]

    profile_res = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = profile_res.scalars().first()

    profile_dict = {
        "full_name": current_user.full_name,
        "skills": user_skills,
        "target_role": profile.target_role if profile else "Software Engineer"
    }

    job_dict = {
        "title": payload.title or "Target Job",
        "company": payload.company or "Target Company",
        "description": payload.description
    }

    match_analysis = await ai_service.match_job_to_profile(profile_dict, job_dict)
    return JobMatchDetail(**match_analysis)
