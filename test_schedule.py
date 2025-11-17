"""
Test the /api/commits/schedule endpoint via the Next.js proxy (port 3000)
to simulate exactly what the browser does, including session cookies.

Also test directly against the backend (port 8000) to isolate the issue.
"""
import httpx
import json
import sys

# Test 1: Direct backend call without auth (should get 401)
print("=" * 60)
print("TEST 1: Direct backend, no auth")
print("=" * 60)
payload = {
    "startDate": "2026-08-10",
    "endDate": "2026-08-11",
    "dailyCount": 1,
    "presetId": "consistent-daily",
    "repoName": "APP_Commit",
    "branch": "main",
    "repoOwner": "",
    "targetFilePath": "commit-log.json",
    "commitMessagePattern": "conventional",
    "minDaily": 1,
    "maxDaily": 8,
    "timeJitterMinutes": 0,
    "filterMode": "all",
}

r = httpx.post("http://localhost:8000/api/commits/schedule", json=payload, timeout=30)
print(f"Status: {r.status_code}")
print(f"Body: {r.text[:500]}")
print()

# Test 2: Through Next.js proxy without auth (should get 401)
print("=" * 60)
print("TEST 2: Through Next.js proxy (port 3000), no auth")
print("=" * 60)
try:
    r2 = httpx.post("http://localhost:3000/api/commits/schedule", json=payload, timeout=30)
    print(f"Status: {r2.status_code}")
    print(f"Body: {r2.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
print()

# Test 3: Through Next.js proxy with a fake cookie to see if it triggers a different code path
print("=" * 60)
print("TEST 3: Through Next.js proxy with invalid session cookie")
print("=" * 60)
try:
    r3 = httpx.post(
        "http://localhost:3000/api/commits/schedule",
        json=payload,
        cookies={"gitstreak_session": "invalid_base64_data"},
        timeout=30
    )
    print(f"Status: {r3.status_code}")
    print(f"Body: {r3.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
print()

# Test 4: Direct backend with a malformed base64 session (simulates bad cookie)
print("=" * 60)
print("TEST 4: Direct backend with malformed session cookie")
print("=" * 60)
import base64
fake_user = json.dumps({"accessToken": "ghp_FAKE_TOKEN_12345", "login": "testuser", "email": "test@test.com", "name": "Test"})
fake_cookie = base64.urlsafe_b64encode(fake_user.encode()).decode()
r4 = httpx.post(
    "http://localhost:8000/api/commits/schedule",
    json=payload,
    cookies={"gitstreak_session": fake_cookie},
    timeout=30
)
print(f"Status: {r4.status_code}")
print(f"Body: {r4.text[:500]}")
