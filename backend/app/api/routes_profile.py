from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.db.session import get_db
from app.models.models import User, UserProfile, UserSkill
from app.schemas.schemas import UserProfileOut, UserProfileUpdate, SkillItem
from app.api.routes_auth import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

def calculate_completion(profile: UserProfile, skills_count: int) -> int:
    score = 40
    if profile.bio and len(profile.bio) > 20:
        score += 10
    if profile.education and len(profile.education) > 0:
        score += 15
    if profile.experience and len(profile.experience) > 0:
        score += 15
    if profile.projects and len(profile.projects) > 0:
        score += 10
    if skills_count >= 5:
        score += 10
    return min(100, score)

@router.get("/me", response_model=UserProfileOut)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch Profile
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        profile = UserProfile(
            user_id=current_user.id,
            target_role="Full-Stack Software Engineer",
            experience_level="Entry-Level / Graduate",
            location="San Francisco, CA / Remote"
        )
        db.add(profile)
        await db.commit()
        await db.refresh(profile)

    # Fetch User Skills
    skill_result = await db.execute(select(UserSkill).where(UserSkill.user_id == current_user.id))
    skills = skill_result.scalars().all()
    
    skill_items = [
        SkillItem(
            skill_name=s.skill_name,
            category=s.category,
            proficiency=s.proficiency,
            years_experience=s.years_experience,
            is_highlighted=s.is_highlighted
        ) for s in skills
    ]

    profile.profile_completion = calculate_completion(profile, len(skills))
    
    return UserProfileOut(
        id=profile.id,
        user_id=profile.user_id,
        target_role=profile.target_role,
        experience_level=profile.experience_level,
        phone=profile.phone,
        location=profile.location,
        preferred_locations=profile.preferred_locations or [],
        job_types=profile.job_types or [],
        min_salary=profile.min_salary,
        max_salary=profile.max_salary,
        currency=profile.currency,
        bio=profile.bio,
        education=profile.education or [],
        experience=profile.experience or [],
        projects=profile.projects or [],
        certifications=profile.certifications or [],
        links=profile.links or {},
        profile_completion=profile.profile_completion,
        skills=skill_items,
        updated_at=profile.updated_at
    )

@router.put("/me", response_model=UserProfileOut)
async def update_my_profile(
    payload: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_dict = payload.model_dump(exclude_unset=True)
    
    # Handle direct fields
    for field in ["target_role", "experience_level", "phone", "location", "preferred_locations", 
                  "job_types", "min_salary", "max_salary", "currency", "bio", "links"]:
        if field in update_dict:
            setattr(profile, field, update_dict[field])

    # Handle structured arrays (education, experience, projects, certifications)
    if "education" in update_dict:
        profile.education = [e.model_dump() if hasattr(e, "model_dump") else e for e in payload.education]
    if "experience" in update_dict:
        profile.experience = [e.model_dump() if hasattr(e, "model_dump") else e for e in payload.experience]
    if "projects" in update_dict:
        profile.projects = [p.model_dump() if hasattr(p, "model_dump") else p for p in payload.projects]
    if "certifications" in update_dict:
        profile.certifications = [c.model_dump() if hasattr(c, "model_dump") else c for c in payload.certifications]

    # Handle skills replacement if provided
    if payload.skills is not None:
        await db.execute(delete(UserSkill).where(UserSkill.user_id == current_user.id))
        for s in payload.skills:
            db.add(UserSkill(
                user_id=current_user.id,
                skill_name=s.skill_name,
                category=s.category,
                proficiency=s.proficiency,
                years_experience=s.years_experience,
                is_highlighted=s.is_highlighted
            ))

    # Recalculate completion
    skill_result = await db.execute(select(UserSkill).where(UserSkill.user_id == current_user.id))
    skills = skill_result.scalars().all()
    profile.profile_completion = calculate_completion(profile, len(skills))
    profile.updated_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(profile)

    return await get_my_profile(current_user=current_user, db=db)

@router.post("/skills", response_model=SkillItem)
async def add_skill(
    skill: SkillItem,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check if skill exists
    result = await db.execute(
        select(UserSkill).where(
            UserSkill.user_id == current_user.id,
            UserSkill.skill_name == skill.skill_name
        )
    )
    existing = result.scalars().first()
    if existing:
        existing.proficiency = skill.proficiency
        existing.years_experience = skill.years_experience
        existing.is_highlighted = skill.is_highlighted
    else:
        new_skill = UserSkill(
            user_id=current_user.id,
            skill_name=skill.skill_name,
            category=skill.category,
            proficiency=skill.proficiency,
            years_experience=skill.years_experience,
            is_highlighted=skill.is_highlighted
        )
        db.add(new_skill)
    
    await db.commit()
    return skill

@router.delete("/skills/{skill_name}")
async def delete_skill(
    skill_name: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await db.execute(
        delete(UserSkill).where(
            UserSkill.user_id == current_user.id,
            UserSkill.skill_name == skill_name
        )
    )
    await db.commit()
    return {"message": f"Skill {skill_name} removed successfully"}
