import base64
import json
import os
from typing import Optional
from fastapi import APIRouter, Request, Response, HTTPException, Query, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import httpx

from config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

class PATRequest(BaseModel):
    token: str

def encode_user_session(user_data: dict) -> str:
    json_str = json.dumps(user_data)
    return base64.urlsafe_b64encode(json_str.encode("utf-8")).decode("utf-8")

def decode_user_session(cookie_val: str) -> Optional[dict]:
    try:
        decoded = base64.urlsafe_b64decode(cookie_val.encode("utf-8")).decode("utf-8")
        return json.loads(decoded)
    except Exception:
        return None

async def resolve_github_user(access_token: str) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
                "User-Agent": "GitStreak",
            },
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid GitHub token or authentication failed.")
        
        user_info = resp.json()
        login = user_info.get("login")
        user_id = user_info.get("id")
        email = user_info.get("email")

        if not email:
            try:
                emails_resp = await client.get(
                    "https://api.github.com/user/emails",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Accept": "application/json",
                        "User-Agent": "GitStreak",
                    },
                )
                if emails_resp.status_code == 200:
                    email_list = emails_resp.json()
                    primary = next((e for e in email_list if e.get("primary") and e.get("verified")), None)
                    if not primary:
                        primary = next((e for e in email_list if e.get("verified")), None)
                    if primary:
                        email = primary.get("email")
            except Exception:
                pass

        if not email:
            email = f"{user_id}+{login}@users.noreply.github.com" if user_id else f"{login}@users.noreply.github.com"

        return {
            "login": login,
            "id": user_id,
            "email": email,
            "accessToken": access_token,
            "avatarUrl": user_info.get("avatar_url"),
            "name": user_info.get("name") or login,
            "repoOwner": login,
            "repoName": "APP_Commit",
        }

def get_current_user_from_req(request: Request) -> Optional[dict]:
    # Check Cookie
    session_cookie = request.cookies.get("gitstreak_session") or request.cookies.get("gh_session")
    if session_cookie:
        user = decode_user_session(session_cookie)
        if user:
            return user
    
    # Check Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        return {"accessToken": token}

    return None

@router.get("/github")
async def github_oauth_start(request: Request):
    client_id = settings.GITHUB_CLIENT_ID or os.getenv("GITHUB_CLIENT_ID", "")
    if not client_id:
        raise HTTPException(
            status_code=400,
            detail="GitHub OAuth Client ID is missing. Please set GITHUB_CLIENT_ID in your .env file."
        )
    scope = "repo,user:email"
    url = f"https://github.com/login/oauth/authorize?client_id={client_id}&scope={scope}"
    return RedirectResponse(url=url)

@router.get("/callback")
async def github_oauth_callback(code: str, response: Response):
    client_id = settings.GITHUB_CLIENT_ID or os.getenv("GITHUB_CLIENT_ID", "")
    client_secret = settings.GITHUB_CLIENT_SECRET or os.getenv("GITHUB_CLIENT_SECRET", "")

    if not client_id or not client_secret:
        raise HTTPException(status_code=400, detail="OAuth credentials missing in .env file.")

    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://github.com/login/oauth/access_token",
            params={
                "client_id": client_id,
                "client_secret": client_secret,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to obtain OAuth access token from GitHub.")

        user_data = await resolve_github_user(access_token)
        session_str = encode_user_session(user_data)

        redirect = RedirectResponse(url=f"{settings.FRONTEND_URL}/dashboard")
        redirect.set_cookie(
            key="gitstreak_session",
            value=session_str,
            max_age=86400 * 30,
            path="/",
            httponly=True,
            samesite="lax",
        )
        return redirect

@router.post("/pat")
async def pat_login(payload: PATRequest, response: Response):
    token = payload.token.strip()
    if not token:
        raise HTTPException(status_code=400, detail="Personal Access Token is required.")
    
    user_data = await resolve_github_user(token)
    session_str = encode_user_session(user_data)
    
    response.set_cookie(
        key="gitstreak_session",
        value=session_str,
        max_age=86400 * 30,
        path="/",
        httponly=True,
        samesite="lax",
    )
    return {"status": "ok", "user": user_data}

@router.get("/me")
async def get_me(request: Request):
    user = get_current_user_from_req(request)
    if not user:
        return {"authenticated": False, "user": None}
    
    if user.get("accessToken") and not user.get("login"):
        try:
            user = await resolve_github_user(user["accessToken"])
        except Exception:
            return {"authenticated": False, "user": None}
            
    return {"authenticated": True, "user": user}

@router.get("/repos")
async def get_user_repositories(request: Request):
    user = get_current_user_from_req(request)
    if not user or not user.get("accessToken"):
        raise HTTPException(status_code=401, detail="Authentication required to fetch repositories.")

    token = user["accessToken"]
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.github.com/user/repos?sort=updated&per_page=100",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/json",
                "User-Agent": "GitStreak",
            },
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail="Failed to fetch user repositories from GitHub.")

        raw_repos = resp.json()
        repos = [
            {
                "id": r.get("id"),
                "name": r.get("name"),
                "full_name": r.get("full_name"),
                "owner": r.get("owner", {}).get("login"),
                "private": r.get("private", False),
                "default_branch": r.get("default_branch", "main"),
                "description": r.get("description"),
            }
            for r in raw_repos
        ]
        return {"repos": repos}

@router.post("/signout")
async def signout(response: Response):
    response.delete_cookie("gitstreak_session", path="/")
    response.delete_cookie("gh_session", path="/")
    return {"status": "ok"}
