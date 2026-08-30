import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.session import init_db

@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    await init_db()

@pytest.mark.asyncio
async def test_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"

@pytest.mark.asyncio
async def test_demo_login_and_profile():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Demo login
        login_res = await client.post("/api/v1/auth/demo-login")
        assert login_res.status_code == 200
        token_data = login_res.json()
        token = token_data["access_token"]
        assert token is not None

        headers = {"Authorization": f"Bearer {token}"}
        
        # Profile fetch
        profile_res = await client.get("/api/v1/profile/me", headers=headers)
        assert profile_res.status_code == 200
        profile = profile_res.json()
        assert profile["target_role"] is not None
        assert len(profile["skills"]) > 0

@pytest.mark.asyncio
async def test_jobs_and_match():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        login_res = await client.post("/api/v1/auth/demo-login")
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        jobs_res = await client.get("/api/v1/jobs", headers=headers)
        assert jobs_res.status_code == 200
        jobs = jobs_res.json()
        assert len(jobs) >= 5
        assert "match_score" in jobs[0]

@pytest.mark.asyncio
async def test_ai_tools():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        login_res = await client.post("/api/v1/auth/demo-login")
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Test Cover Letter Generation
        cover_res = await client.post(
            "/api/v1/ai/generate-cover-letter",
            json={"job_title": "Senior Frontend Engineer", "company_name": "Linear", "tone": "Confident & Impact-Driven"},
            headers=headers
        )
        assert cover_res.status_code == 200
        cover_data = cover_res.json()
        assert "opening_hook" in cover_data

        # Test Interview Prep
        interview_res = await client.post(
            "/api/v1/ai/interview-prep",
            json={"job_title": "Full-Stack Engineer", "company_name": "Stripe", "question_count": 3},
            headers=headers
        )
        assert interview_res.status_code == 200
        interview_data = interview_res.json()
        assert len(interview_data["questions"]) == 3
