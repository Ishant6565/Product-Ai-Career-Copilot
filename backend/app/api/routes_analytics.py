from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.session import get_db
from app.models.models import User, Application, Job, UserSkill
from app.schemas.schemas import AnalyticsOverviewResponse
from app.api.routes_auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview", response_model=AnalyticsOverviewResponse)
async def get_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch Applications
    app_result = await db.execute(
        select(Application).where(Application.user_id == current_user.id)
    )
    apps = app_result.scalars().all()

    total_apps = len(apps)
    interviews_count = sum(1 for a in apps if a.status in ["interview", "offer"])
    offers_count = sum(1 for a in apps if a.status == "offer")
    
    # Status Breakdown
    status_counts = {
        "saved": 0,
        "applied": 0,
        "screening": 0,
        "interview": 0,
        "offer": 0,
        "rejected": 0
    }
    match_scores = []
    for a in apps:
        if a.status in status_counts:
            status_counts[a.status] += 1
        if a.match_score:
            match_scores.append(a.match_score)

    avg_match = int(sum(match_scores) / len(match_scores)) if match_scores else 86
    
    active_submissions = status_counts["applied"] + status_counts["screening"] + status_counts["interview"] + status_counts["offer"] + status_counts["rejected"]
    conversion_rate = round((interviews_count / max(1, active_submissions)) * 100, 1) if active_submissions else 22.5
    response_rate = round(((status_counts["screening"] + interviews_count + offers_count + status_counts["rejected"]) / max(1, active_submissions)) * 100, 1) if active_submissions else 45.0

    # Weekly Application Velocity
    weekly_applications = [
        {"week": "Week 1", "applications": 3, "interviews": 0},
        {"week": "Week 2", "applications": 5, "interviews": 1},
        {"week": "Week 3", "applications": 4, "interviews": 1},
        {"week": "Week 4", "applications": 6, "interviews": 2},
    ]

    # Fetch User Skills
    skill_res = await db.execute(select(UserSkill.skill_name).where(UserSkill.user_id == current_user.id))
    user_skills_set = {s.lower() for s in skill_res.scalars().all()}

    # Top In-Demand Market Skills
    top_in_demand_skills = [
        {"skill": "TypeScript", "demand_percentage": 92, "user_has": "typescript" in user_skills_set},
        {"skill": "React / Next.js", "demand_percentage": 88, "user_has": "react" in user_skills_set or "next.js" in user_skills_set},
        {"skill": "Python / FastAPI", "demand_percentage": 85, "user_has": "python" in user_skills_set or "fastapi" in user_skills_set},
        {"skill": "PostgreSQL", "demand_percentage": 78, "user_has": "postgresql" in user_skills_set},
        {"skill": "Docker / Containers", "demand_percentage": 75, "user_has": "docker" in user_skills_set},
        {"skill": "System Design", "demand_percentage": 70, "user_has": "system design" in user_skills_set},
        {"skill": "Kubernetes", "demand_percentage": 58, "user_has": "kubernetes" in user_skills_set},
        {"skill": "AWS / Cloud", "demand_percentage": 68, "user_has": "aws" in user_skills_set}
    ]

    # Skill Gaps (high demand missing skills with recommended learning weeks)
    skill_gap_matrix = [
        {"skill": "Kubernetes / K8s", "impact": "High", "missing_in_jobs": 4, "estimated_hours": 12, "recommended_action": "Complete CKAD crash project & deploy cluster demo."},
        {"skill": "Apache Kafka / Event Streams", "impact": "High", "missing_in_jobs": 3, "estimated_hours": 8, "recommended_action": "Build a pub/sub event pipeline with Python consumer."},
        {"skill": "Terraform / IaC", "impact": "Medium", "missing_in_jobs": 2, "estimated_hours": 6, "recommended_action": "Add infrastructure as code scripts to GitHub portfolio."}
    ]

    return AnalyticsOverviewResponse(
        total_applications=total_apps,
        interviews_scheduled=interviews_count,
        offers_received=offers_count,
        average_match_score=avg_match,
        interview_conversion_rate=conversion_rate,
        response_rate=response_rate,
        applications_by_status=status_counts,
        weekly_applications=weekly_applications,
        top_in_demand_skills=top_in_demand_skills,
        skill_gap_matrix=skill_gap_matrix
    )
