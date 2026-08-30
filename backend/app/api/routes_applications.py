from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from app.db.session import get_db
from app.models.models import User, Application, Job
from app.schemas.schemas import ApplicationOut, ApplicationCreate, ApplicationUpdate
from app.api.routes_auth import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])

VALID_STAGES = ["saved", "applied", "screening", "interview", "offer", "rejected"]

@router.get("", response_model=List[ApplicationOut])
async def list_applications(
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Application).where(Application.user_id == current_user.id)
    if status and status != "all":
        query = query.where(Application.status == status.lower())
    
    query = query.order_by(Application.updated_at.desc())
    result = await db.execute(query)
    applications = result.scalars().all()
    return [ApplicationOut.model_validate(a) for a in applications]

@router.post("", response_model=ApplicationOut)
async def create_application(
    payload: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_app = Application(
        user_id=current_user.id,
        job_id=payload.job_id,
        company_name=payload.company_name,
        job_title=payload.job_title,
        location=payload.location or "Remote",
        job_url=payload.job_url,
        status=payload.status.lower() if payload.status.lower() in VALID_STAGES else "applied",
        applied_date=datetime.now(timezone.utc) if payload.status.lower() in ["applied", "screening", "interview"] else None,
        salary_offered=payload.salary_offered,
        recruiter_name=payload.recruiter_name,
        recruiter_email=payload.recruiter_email,
        interview_date=payload.interview_date,
        follow_up_date=payload.follow_up_date,
        notes=payload.notes,
        resume_id=payload.resume_id,
        match_score=payload.match_score or 85
    )
    db.add(new_app)
    await db.commit()
    await db.refresh(new_app)
    return ApplicationOut.model_validate(new_app)

@router.put("/{app_id}", response_model=ApplicationOut)
async def update_application(
    app_id: str,
    payload: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Application).where(Application.id == app_id, Application.user_id == current_user.id)
    )
    application = result.scalars().first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    update_data = payload.model_dump(exclude_unset=True)
    
    if "status" in update_data and update_data["status"]:
        new_status = update_data["status"].lower()
        if new_status in VALID_STAGES:
            application.status = new_status
            if new_status == "applied" and not application.applied_date:
                application.applied_date = datetime.now(timezone.utc)

    for field in ["company_name", "job_title", "location", "job_url", "salary_offered", 
                  "recruiter_name", "recruiter_email", "interview_date", "follow_up_date", "notes", "match_score"]:
        if field in update_data:
            setattr(application, field, update_data[field])

    application.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(application)
    return ApplicationOut.model_validate(application)

@router.delete("/{app_id}")
async def delete_application(
    app_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Application).where(Application.id == app_id, Application.user_id == current_user.id)
    )
    application = result.scalars().first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    await db.delete(application)
    await db.commit()
    return {"message": "Application removed successfully"}
