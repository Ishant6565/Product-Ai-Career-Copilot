from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.models import User, UserProfile, UserSkill, Resume
from app.schemas.schemas import UserCreate, UserLogin, UserOut, TokenResponse
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token, get_current_user_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

async def get_current_user(
    token: str = Depends(get_current_user_token),
    db: AsyncSession = Depends(get_db)
) -> User:
    if not token:
        # Fallback to demo user if no token is provided in local testing
        result = await db.execute(select(User).limit(1))
        user = result.scalars().first()
        if user:
            return user
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token"
        )
    
    user_id = payload["sub"]
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.post("/register", response_model=TokenResponse)
async def register_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered."
        )
    
    new_user = User(
        email=payload.email.lower(),
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role="job_seeker"
    )
    db.add(new_user)
    await db.flush()

    new_profile = UserProfile(
        user_id=new_user.id,
        target_role=payload.target_role or "Full-Stack Software Engineer",
        experience_level=payload.experience_level or "Entry-Level / Graduate",
        location="Remote / United States",
        preferred_locations=["Remote", "San Francisco, CA", "New York, NY"],
        job_types=["Full-time", "Remote"],
        min_salary=100000,
        max_salary=140000,
        currency="USD",
        bio=f"Driven {payload.target_role} aiming to make high impact on engineering velocity and product excellence.",
        profile_completion=70
    )
    db.add(new_profile)

    # Add default foundation skills
    default_skills = [
        ("Python", "backend", "Intermediate", 2.0, True),
        ("JavaScript", "frontend", "Intermediate", 2.0, True),
        ("React", "frontend", "Intermediate", 2.0, True),
        ("PostgreSQL", "database", "Intermediate", 1.5, False),
        ("Git & GitHub", "cloud", "Advanced", 3.0, False)
    ]
    for s_name, s_cat, s_prof, s_yrs, s_high in default_skills:
        db.add(UserSkill(
            user_id=new_user.id,
            skill_name=s_name,
            category=s_cat,
            proficiency=s_prof,
            years_experience=s_yrs,
            is_highlighted=s_high
        ))

    await db.commit()
    await db.refresh(new_user)

    token = create_access_token(subject=new_user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(new_user)
    )

@router.post("/login", response_model=TokenResponse)
async def login_user(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email.lower()))
    user = result.scalars().first()
    
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )

@router.post("/demo-login", response_model=TokenResponse)
async def demo_login(persona: str = "fullstack", db: AsyncSession = Depends(get_db)):
    """1-Click quick login for demo and presentation workflows"""
    result = await db.execute(select(User).limit(1))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not found. Please re-seed database.")
    
    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(user)
    )

@router.get("/me", response_model=UserOut)
async def get_my_info(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)
