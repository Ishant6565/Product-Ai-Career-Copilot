import asyncio
from app.main import app
from app.graph.workflow import workflow_engine


def test_health_endpoint():
    """Verify health check endpoint returns 200 and healthy status."""
    from fastapi.testclient import TestClient
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "online"
    assert "MyAppMyWeb" in data.get("service", "")


async def run_workflow_stream():
    """Verify that workflow engine produces streaming events for multi-agent DAG."""
    events = []
    async for event in workflow_engine.run_stream(
        "Build a Todo app with React frontend, Express backend, and JWT Auth",
        "proj_test_pytest_1"
    ):
        events.append(event)

    assert len(events) > 0
    event_types = [e.get("type") for e in events]
    assert "agent_start" in event_types
    assert "complete" in event_types or "review_scorecard" in event_types
    return events


def test_workflow_execution():
    """Pytest synchronous wrapper for async test."""
    asyncio.run(run_workflow_stream())


async def main():
    print("[INIT] Initializing DevAgent AI End-to-End Workflow Verification...")
    count = 0
    async for event in workflow_engine.run_stream(
        "Build a Todo app with React frontend, Express backend, and JWT Auth", 
        "proj_test_cli_1"
    ):
        count += 1
        event_type = event.get("type", "")
        msg = event.get("message", "")
        agent = event.get("active_agent", "")
        # Clean print without unicode crashes on legacy windows console
        try:
            print(f"  [{count:02d}] {agent.upper():14} | {event_type:20} | {msg}")
        except UnicodeEncodeError:
            print(f"  [{count:02d}] {agent.upper():14} | {event_type:20}")
        
    print(f"\n[PASS] SUCCESS: DevAgent Workflow completed with {count} streaming events!")


if __name__ == "__main__":
    asyncio.run(main())
