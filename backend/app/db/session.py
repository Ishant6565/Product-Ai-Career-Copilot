import os
from datetime import datetime, timezone, timedelta
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings
from app.models.models import Base, User, UserProfile, UserSkill, Resume, Job, Application, SavedJob, AIAnalysis
from app.core.security import get_password_hash

# Handle PostgreSQL vs SQLite connection URLs
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")

# If postgres driver is missing in local environment, fallback to SQLite
try:
    if "postgresql" in db_url:
        import asyncpg
except ImportError:
    db_url = "sqlite+aiosqlite:///./career_copilot.db"

connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}

engine = create_async_engine(
    db_url,
    echo=False,
    future=True,
    connect_args=connect_args
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    """Create tables and seed initial data if empty"""
    os.makedirs(settings.STORAGE_DIR, exist_ok=True)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSessionLocal() as session:
        from sqlalchemy import select
        result = await session.execute(select(User))
        existing_user = result.scalars().first()
        
        if not existing_user:
            # Seed Demo User
            demo_user = User(
                id="demo-user-1",
                email="alex.chen@example.com",
                full_name="Alex Chen",
                hashed_password=get_password_hash("password123"),
                avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                role="job_seeker"
            )
            session.add(demo_user)
            
            demo_profile = UserProfile(
                id="demo-profile-1",
                user_id=demo_user.id,
                target_role="Full-Stack Software Engineer",
                experience_level="Mid-Level (2-4 Years)",
                phone="+1 (555) 234-5678",
                location="San Francisco, CA (Open to Remote)",
                preferred_locations=["San Francisco, CA", "Seattle, WA", "Remote (US/Canada)"],
                job_types=["Full-time", "Remote"],
                min_salary=125000,
                max_salary=165000,
                currency="USD",
                bio="Passionate Full-Stack Engineer with 3 years building scalable distributed web applications, modern React/Next.js frontends, and high-throughput microservices.",
                education=[
                    {
                        "degree": "B.S. in Computer Science",
                        "institution": "University of California, Berkeley",
                        "year": "2022",
                        "gpa": "3.85 / 4.0",
                        "highlights": "Dean's Honor List, President of Hackathon Club, Teaching Assistant for Data Structures"
                    }
                ],
                experience=[
                    {
                        "role": "Software Engineer II",
                        "company": "Veloce Technologies",
                        "location": "San Francisco, CA",
                        "startDate": "2023-01",
                        "endDate": "Present",
                        "current": True,
                        "bullets": [
                            "Architected Next.js 14 dashboard and FastAPI microservices serving 450k+ daily active users.",
                            "Optimized database queries and Redis caching layer, slashing P99 API latency from 420ms to 68ms.",
                            "Mentored 3 junior engineers and spearheaded adoption of TypeScript strict mode across 14 repositories."
                        ]
                    },
                    {
                        "role": "Associate Software Engineer",
                        "company": "CloudScale Systems",
                        "location": "San Jose, CA",
                        "startDate": "2022-06",
                        "endDate": "2022-12",
                        "current": False,
                        "bullets": [
                            "Built automated CI/CD deployment pipelines using Docker and GitHub Actions, cutting release cycles by 40%.",
                            "Implemented RESTful backend endpoints in Python FastAPI and integrated PostgreSQL with SQLAlchemy."
                        ]
                    }
                ],
                projects=[
                    {
                        "title": "HyperGraph - AI Query Engine",
                        "tech": ["Next.js", "FastAPI", "pgvector", "LangChain"],
                        "description": "Semantic document search and hybrid graph retrieval platform with sub-100ms vector index queries.",
                        "github": "https://github.com/alexchen/hypergraph",
                        "demo": "https://hypergraph.dev"
                    },
                    {
                        "title": "StreamForge - Distributed Event Bus",
                        "tech": ["Go", "Redis Streams", "Docker"],
                        "description": "High-throughput real-time WebSocket pub/sub engine handling 50k concurrent event channels.",
                        "github": "https://github.com/alexchen/streamforge",
                        "demo": ""
                    }
                ],
                certifications=[
                    {"name": "AWS Certified Solutions Architect – Associate", "issuer": "Amazon Web Services", "year": "2024"},
                    {"name": "Certified Kubernetes Application Developer (CKAD)", "issuer": "Linux Foundation", "year": "2023"}
                ],
                links={
                    "github": "https://github.com/alexchen",
                    "linkedin": "https://linkedin.com/in/alexchen-dev",
                    "portfolio": "https://alexchen.dev"
                },
                profile_completion=92
            )
            session.add(demo_profile)
            
            # Seed Skills
            skills_data = [
                ("TypeScript", "frontend", "Expert", 4.0, True),
                ("React", "frontend", "Expert", 4.0, True),
                ("Next.js", "frontend", "Advanced", 3.0, True),
                ("Tailwind CSS", "frontend", "Expert", 3.0, False),
                ("Python", "backend", "Expert", 4.0, True),
                ("FastAPI", "backend", "Advanced", 3.0, True),
                ("Node.js", "backend", "Advanced", 3.0, False),
                ("PostgreSQL", "database", "Advanced", 3.0, True),
                ("Redis", "database", "Intermediate", 2.0, False),
                ("Docker", "cloud", "Advanced", 3.0, True),
                ("AWS", "cloud", "Intermediate", 2.5, False),
                ("GraphQL", "backend", "Intermediate", 2.0, False),
                ("CI/CD", "cloud", "Advanced", 3.0, False),
                ("System Design", "soft", "Advanced", 3.0, True),
            ]
            for name, cat, prof, yrs, high in skills_data:
                session.add(UserSkill(
                    user_id=demo_user.id,
                    skill_name=name,
                    category=cat,
                    proficiency=prof,
                    years_experience=yrs,
                    is_highlighted=high
                ))
            
            # Seed Primary Resume
            demo_resume = Resume(
                id="demo-resume-1",
                user_id=demo_user.id,
                title="Full-Stack Engineer - Standard ATS V1",
                original_filename="Alex_Chen_FullStack_Resume.pdf",
                version=1,
                is_primary=True,
                overall_score=91,
                ats_score=95,
                impact_score=88,
                structure_score=94,
                strengths=[
                    "Strong quantifiable metrics in work achievements (slashed latency, 450k DAU).",
                    "Clean ATS-compliant layout with standard section headers.",
                    "Excellent balance of modern frontend (React/Next.js) and backend (FastAPI/Postgres) capabilities.",
                    "Active cloud & architecture credentials (AWS SAA, CKAD)."
                ],
                weaknesses=[
                    "Could highlight more unit/integration test coverage percentages.",
                    "Add more details regarding collaborative cross-functional product impact."
                ],
                missing_keywords=["Kubernetes Operator", "Apache Kafka", "Terraform", "gRPC"],
                improvement_suggestions=[
                    {
                        "section": "Experience - Veloce Technologies",
                        "current": "Optimized database queries and Redis caching layer.",
                        "suggested": "Architected Redis caching and PostgreSQL query index tuning, slashing P99 API latency by 83% (420ms to 68ms) across 450k DAU.",
                        "impact": "High"
                    },
                    {
                        "section": "Skills",
                        "current": "AWS, Docker",
                        "suggested": "Add specific AWS services like ECS, RDS, CloudFront and IaC tooling like Terraform.",
                        "impact": "Medium"
                    }
                ],
                parsed_content={
                    "name": "Alex Chen",
                    "email": "alex.chen@example.com",
                    "phone": "+1 (555) 234-5678",
                    "location": "San Francisco, CA",
                    "summary": "Full-Stack Software Engineer with 3+ years experience engineering resilient web architectures, modern React micro-frontends, and high-performance Python services.",
                    "skills": ["TypeScript", "React", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "Redis"],
                    "experience_count": 2,
                    "education_count": 1,
                    "project_count": 2
                }
            )
            session.add(demo_resume)

            # Seed Jobs
            jobs_data = [
                {
                    "id": "job-1",
                    "title": "Senior Full-Stack Engineer",
                    "company": "Stripe",
                    "location": "San Francisco, CA / Remote",
                    "is_remote": True,
                    "job_type": "Full-time",
                    "experience_level": "Mid-Senior",
                    "salary_range": "$160k - $210k",
                    "min_salary": 160000,
                    "max_salary": 210000,
                    "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
                    "description": "Stripe is looking for a Full-Stack Engineer to build world-class merchant onboarding and financial automation products. You will work across modern React frontends and high-reliability Python/Ruby distributed services.",
                    "responsibilities": [
                        "Architect high-converting onboarding and developer portal workflows using React & Next.js.",
                        "Design resilient asynchronous event processing pipelines processing millions of transactions.",
                        "Partner closely with product managers, designers, and compliance teams."
                    ],
                    "requirements": [
                        "3+ years of experience with modern TypeScript/React and backend frameworks (Python, Node, or Go).",
                        "Deep understanding of relational databases (PostgreSQL), schema design, and caching (Redis).",
                        "Strong empathy for developer experience and user interface polish."
                    ],
                    "required_skills": ["TypeScript", "React", "Python", "PostgreSQL", "FastAPI", "System Design"],
                    "preferred_skills": ["Docker", "Redis", "Next.js", "AWS", "Kafka"],
                    "is_featured": True
                },
                {
                    "id": "job-2",
                    "title": "Frontend Software Engineer (Design Systems)",
                    "company": "Linear",
                    "location": "San Francisco, CA / Remote",
                    "is_remote": True,
                    "job_type": "Full-time",
                    "experience_level": "Mid-level",
                    "salary_range": "$150k - $190k",
                    "min_salary": 150000,
                    "max_salary": 190000,
                    "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
                    "description": "Linear builds software that software teams love. We are searching for an exceptional Frontend Engineer with an obsessive eye for detail, keyboard navigation, fluid micro-interactions, and 60fps web performance.",
                    "responsibilities": [
                        "Build pixel-perfect, accessible component primitives and rich canvas interactions.",
                        "Optimize client-side state synchronization and optimistic UI mutations.",
                        "Drive typography, animation, and dark mode design tokens."
                    ],
                    "requirements": [
                        "Expert proficiency in TypeScript, React, CSS/Tailwind, and Web APIs.",
                        "Deep experience in building high-performance SPAs and canvas/SVG interfaces.",
                        "A refined product taste and portfolio of beautifully crafted user interfaces."
                    ],
                    "required_skills": ["TypeScript", "React", "Next.js", "Tailwind CSS", "Web Performance"],
                    "preferred_skills": ["GraphQL", "WebSockets", "Figma", "Design Systems"],
                    "is_featured": True
                },
                {
                    "id": "job-3",
                    "title": "Backend AI Systems Engineer",
                    "company": "Anthropic",
                    "location": "San Francisco, CA",
                    "is_remote": False,
                    "job_type": "Full-time",
                    "experience_level": "Mid-Senior",
                    "salary_range": "$175k - $240k",
                    "min_salary": 175000,
                    "max_salary": 240000,
                    "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
                    "description": "Help us build the scalable data pipelines, inference orchestration layers, and evaluation harnesses that power the next generation of safe artificial intelligence models.",
                    "responsibilities": [
                        "Build distributed streaming inference servers with sub-millisecond overhead in Python & Rust/C++.",
                        "Design pgvector and semantic search embeddings infrastructure.",
                        "Scale background task queues and GPU cluster resource allocation."
                    ],
                    "requirements": [
                        "Strong Python backend development skills (FastAPI, Asyncio, PyTorch or Triton).",
                        "Experience with PostgreSQL, pgvector, Redis, and container orchestration (Docker/K8s).",
                        "Demonstrated ability to debug low-level networking, memory, and concurrency bottlenecks."
                    ],
                    "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis"],
                    "preferred_skills": ["pgvector", "Kubernetes", "AWS", "CI/CD", "Rust"],
                    "is_featured": True
                },
                {
                    "id": "job-4",
                    "title": "Software Engineer, Core Platform",
                    "company": "Vercel",
                    "location": "Remote (Global)",
                    "is_remote": True,
                    "job_type": "Full-time",
                    "experience_level": "Mid-level",
                    "salary_range": "$140k - $185k",
                    "min_salary": 140000,
                    "max_salary": 185000,
                    "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
                    "description": "Vercel provides developer tools and cloud infrastructure to build the modern web. We are looking for engineers to work on Next.js runtime, edge compute, and developer CLI workflows.",
                    "responsibilities": [
                        "Improve Next.js App Router performance, compilation speed, and build telemetry.",
                        "Enhance serverless execution environments and global edge edge-caching.",
                        "Collaborate with open-source contributors and enterprise developer teams."
                    ],
                    "requirements": [
                        "Solid foundation in JavaScript/TypeScript runtime internals and modern Web standards.",
                        "Experience with Node.js, Next.js, and edge networking.",
                        "Passion for open source and clean developer tooling."
                    ],
                    "required_skills": ["TypeScript", "Next.js", "React", "Node.js", "Docker"],
                    "preferred_skills": ["CI/CD", "AWS", "Rust", "Tailwind CSS"],
                    "is_featured": False
                },
                {
                    "id": "job-5",
                    "title": "Full-Stack Engineer (AI Applications)",
                    "company": "Perplexity AI",
                    "location": "San Francisco, CA / Hybrid",
                    "is_remote": True,
                    "job_type": "Full-time",
                    "experience_level": "Entry-Mid",
                    "salary_range": "$135k - $175k",
                    "min_salary": 135000,
                    "max_salary": 175000,
                    "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
                    "description": "Join Perplexity AI to build the world's most accurate and transparent conversational answer engine. You'll construct real-time streaming citation cards, interactive knowledge graphs, and live search results.",
                    "responsibilities": [
                        "Develop real-time streaming UI components in React and Next.js.",
                        "Integrate search query rankers with FastAPI backend services and vector indices.",
                        "Deliver ultra-low latency response feeds to millions of searchers."
                    ],
                    "requirements": [
                        "Proficiency in React/Next.js, TypeScript, and Python backend APIs.",
                        "Familiarity with vector embeddings, LLM APIs, and streaming HTTP/SSE protocols.",
                        "High velocity and hunger to ship innovative products daily."
                    ],
                    "required_skills": ["TypeScript", "React", "Python", "FastAPI", "Next.js"],
                    "preferred_skills": ["Docker", "PostgreSQL", "Tailwind CSS", "Redis"],
                    "is_featured": True
                },
                {
                    "id": "job-6",
                    "title": "Graduate / Junior Software Engineer",
                    "company": "Datadog",
                    "location": "New York, NY / Hybrid",
                    "is_remote": False,
                    "job_type": "Full-time",
                    "experience_level": "Entry-Level / Graduate",
                    "salary_range": "$115k - $145k",
                    "min_salary": 115000,
                    "max_salary": 145000,
                    "company_logo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
                    "description": "Kickstart your career at Datadog! As a Junior Engineer on our Cloud Observability teams, you will gain hands-on mentorship building real-time telemetry dashboards, distributed tracing pipelines, and metric aggregation engines.",
                    "responsibilities": [
                        "Build interactive telemetry visualization widgets in TypeScript and React.",
                        "Write clean, unit-tested Python and Go backend services.",
                        "Participate in agile sprints, peer code reviews, and architectural discussions."
                    ],
                    "requirements": [
                        "B.S. or M.S. in Computer Science or related STEM field (Graduation 2023-2026).",
                        "Solid grasp of data structures, algorithms, and OOP fundamentals.",
                        "Eagerness to learn cloud architectures, Docker, and distributed systems."
                    ],
                    "required_skills": ["Python", "TypeScript", "React", "Docker", "PostgreSQL"],
                    "preferred_skills": ["AWS", "CI/CD", "FastAPI", "Tailwind CSS"],
                    "is_featured": False
                }
            ]
            
            for j in jobs_data:
                session.add(Job(**j))
            
            # Seed Applications for Demo User
            apps_data = [
                {
                    "id": "app-1",
                    "user_id": demo_user.id,
                    "job_id": "job-1",
                    "company_name": "Stripe",
                    "job_title": "Senior Full-Stack Engineer",
                    "location": "San Francisco, CA / Remote",
                    "status": "interview",
                    "salary_offered": "$175,000",
                    "recruiter_name": "Sarah Jenkins",
                    "recruiter_email": "sarah.j@stripe.com",
                    "interview_date": datetime.now(timezone.utc) + timedelta(days=2, hours=4),
                    "follow_up_date": datetime.now(timezone.utc) + timedelta(days=3),
                    "notes": "Passed technical screening round with flying colors! Round 2 system design scheduled for Thursday at 2:00 PM PST.",
                    "match_score": 92
                },
                {
                    "id": "app-2",
                    "user_id": demo_user.id,
                    "job_id": "job-2",
                    "company_name": "Linear",
                    "job_title": "Frontend Software Engineer",
                    "location": "San Francisco, CA / Remote",
                    "status": "screening",
                    "salary_offered": "$165,000",
                    "recruiter_name": "Marcus Vance",
                    "recruiter_email": "recruiting@linear.app",
                    "interview_date": datetime.now(timezone.utc) + timedelta(days=5),
                    "follow_up_date": datetime.now(timezone.utc) + timedelta(days=6),
                    "notes": "Introductory recruiter call scheduled. Sent over portfolio link and HyperGraph project demo.",
                    "match_score": 89
                },
                {
                    "id": "app-3",
                    "user_id": demo_user.id,
                    "job_id": "job-5",
                    "company_name": "Perplexity AI",
                    "job_title": "Full-Stack Engineer (AI Applications)",
                    "location": "San Francisco, CA",
                    "status": "offer",
                    "salary_offered": "$160,000 + Equity",
                    "recruiter_name": "Elena Rostova",
                    "recruiter_email": "elena@perplexity.ai",
                    "interview_date": None,
                    "follow_up_date": datetime.now(timezone.utc) + timedelta(days=7),
                    "notes": "Received formal offer letter! Reviewing compensation package and equity vesting schedule.",
                    "match_score": 95
                },
                {
                    "id": "app-4",
                    "user_id": demo_user.id,
                    "job_id": "job-3",
                    "company_name": "Anthropic",
                    "job_title": "Backend AI Systems Engineer",
                    "location": "San Francisco, CA",
                    "status": "applied",
                    "salary_offered": "$190,000",
                    "recruiter_name": "David Thorne",
                    "recruiter_email": "talent@anthropic.com",
                    "interview_date": None,
                    "follow_up_date": datetime.now(timezone.utc) + timedelta(days=4),
                    "notes": "Applied via referral with customized ATS-optimized resume version.",
                    "match_score": 86
                },
                {
                    "id": "app-5",
                    "user_id": demo_user.id,
                    "job_id": "job-4",
                    "company_name": "Vercel",
                    "job_title": "Software Engineer, Core Platform",
                    "location": "Remote",
                    "status": "saved",
                    "salary_offered": "$155,000",
                    "recruiter_name": None,
                    "recruiter_email": None,
                    "interview_date": None,
                    "follow_up_date": None,
                    "notes": "Plan to optimize resume with emphasis on Next.js App Router and edge deployments before submitting.",
                    "match_score": 88
                }
            ]
            
            for a in apps_data:
                session.add(Application(**a))
                
            # Seed Saved Job
            session.add(SavedJob(
                user_id=demo_user.id,
                job_id="job-4"
            ))
            
            await session.commit()
            print("Database successfully initialized and seeded with demo data.")
