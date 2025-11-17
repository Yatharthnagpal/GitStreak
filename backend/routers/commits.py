import asyncio
import random
import logging
import traceback
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import httpx

from routers.auth import get_current_user_from_req, resolve_github_user

router = APIRouter(prefix="/api/commits", tags=["commits"])

class CommitScheduleRequest(BaseModel):
    startDate: str
    endDate: str
    dailyCount: Optional[int] = 5
    minDaily: Optional[int] = 1
    maxDaily: Optional[int] = 8
    pushToRemote: Optional[bool] = True
    branch: Optional[str] = "main"
    repoOwner: Optional[str] = None
    repoName: Optional[str] = None
    timeJitterMinutes: Optional[int] = 30
    commitMessagePattern: Optional[str] = "conventional"
    customMessagesList: Optional[str] = ""
    targetFilePath: Optional[str] = "commit-log.json"
    presetId: Optional[str] = "consistent-daily"
    filterMode: Optional[str] = "all"

def generate_conventional_message(index: int, total: int) -> str:
    prefixes = [
        "feat(core): update module structure",
        "fix(api): resolve edge case in data parser",
        "docs(readme): expand setup instructions",
        "refactor(store): optimize state updates",
        "test(unit): add validation assertions",
        "style(ui): adjust layout spacing and colors",
        "chore(deps): bump internal packages",
        "perf(render): improve rendering performance",
        "feat(auth): refresh session tokens",
        "fix(sync): harden commit database handshake",
    ]
    prefix = prefixes[(index - 1) % len(prefixes)]
    return f"{prefix} (#{index})"

def build_preset_timestamps(
    start_date_str: str,
    end_date_str: str,
    preset_id: str,
    daily_count: int,
    min_daily: int,
    max_daily: int,
    jitter_mins: int,
    filter_mode: str,
) -> List[datetime]:
    try:
        start = datetime.strptime(start_date_str, "%Y-%m-%d")
        end = datetime.strptime(end_date_str, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format YYYY-MM-DD.")

    if end < start:
        raise HTTPException(status_code=400, detail="End date must be after start date.")

    preset = (preset_id or "consistent-daily").lower()
    timestamps: List[datetime] = []
    current = start

    low = min(min_daily, max_daily)
    high = max(min_daily, max_daily)

    while current <= end:
        day_name = current.strftime("%A").lower()
        is_weekend = day_name in ["saturday", "sunday"]

        count_for_day = 0

        if preset == "consistent-daily":
            count_for_day = daily_count
        elif preset == "weekday-shift":
            count_for_day = random.randint(low, high) if not is_weekend else 0
        elif preset == "weekend-warrior":
            count_for_day = random.randint(low, high) if is_weekend else 0
        elif preset == "random-burst":
            count_for_day = random.randint(low, high)
        elif preset == "light-touch":
            count_for_day = random.choice([1, 2, 3])
        else:
            include_day = True
            if filter_mode == "weekdays" and is_weekend:
                include_day = False
            elif filter_mode == "weekends" and not is_weekend:
                include_day = False
            elif filter_mode == "odd" and current.day % 2 == 0:
                include_day = False
            elif filter_mode == "even" and current.day % 2 != 0:
                include_day = False

            count_for_day = daily_count if include_day else 0

        if count_for_day > 0:
            day_start = current.replace(hour=9, minute=0, second=0)
            day_end = current.replace(hour=20, minute=0, second=0)
            diff_seconds = (day_end - day_start).total_seconds()

            for i in range(count_for_day):
                if count_for_day > 1:
                    step = diff_seconds / (count_for_day - 1)
                    ts = day_start + timedelta(seconds=i * step)
                else:
                    ts = day_start

                if jitter_mins > 0:
                    offset = (random.random() * 2 - 1) * (jitter_mins * 60)
                    ts += timedelta(seconds=offset)

                ts = ts.replace(tzinfo=timezone.utc)
                timestamps.append(ts)

        current += timedelta(days=1)

    return timestamps

async def github_api_call(
    client: httpx.AsyncClient,
    method: str,
    url: str,
    token: str,
    json_data: Optional[dict] = None,
    retries: int = 3
) -> dict:
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "User-Agent": "GitStreak",
    }
    for attempt in range(retries + 1):
        try:
            resp = await client.request(method, url, headers=headers, json=json_data)

            if resp.status_code in [200, 201]:
                return resp.json()

            if resp.status_code == 403 and "secondary rate limit" in resp.text.lower():
                if attempt < retries:
                    retry_after = int(resp.headers.get("retry-after", "60"))
                    await asyncio.sleep(retry_after)
                    continue

            error_text = resp.text
            try:
                err_json = resp.json()
                if "message" in err_json:
                    error_text = err_json["message"]
            except Exception:
                pass

            raise HTTPException(
                status_code=resp.status_code if resp.status_code < 500 else 400,
                detail=f"GitHub API ({resp.status_code}): {error_text}"
            )
        except HTTPException:
            raise
        except httpx.TimeoutException:
            if attempt < retries:
                await asyncio.sleep(2.0)
                continue
            raise HTTPException(status_code=504, detail="GitHub API request timed out. Please try again.")
        except Exception as net_err:
            logging.warning(f"github_api_call network error on attempt {attempt+1}/{retries+1} for {method} {url}: {net_err}")
            if attempt < retries:
                await asyncio.sleep(2.0)
                continue
            raise HTTPException(status_code=502, detail=f"GitHub API network error: {str(net_err)}")

@router.post("/schedule")
async def execute_commit_schedule(payload: CommitScheduleRequest, request: Request):
    logging.info("[Schedule] Received commit schedule request")
    user = get_current_user_from_req(request)
    if not user or not user.get("accessToken"):
        raise HTTPException(status_code=401, detail="Authentication required. Please connect GitHub or enter PAT.")

    token = user["accessToken"]
    
    # If user details like login/email are missing, resolve from GitHub API
    login = user.get("login")
    name = user.get("name")
    email = user.get("email")
    logging.info(f"[Schedule] User from session: login={login}, name={name}, email={email}")

    timeout_config = httpx.Timeout(120.0, connect=15.0)

    try:
        async with httpx.AsyncClient(timeout=timeout_config) as client:
            if not login or not email:
                logging.info("[Schedule] Missing login/email, resolving from GitHub API...")
                try:
                    resolved = await resolve_github_user(token)
                    login = login or resolved.get("login", "github-user")
                    name = name or resolved.get("name") or login
                    email = email or resolved.get("email") or f"{login}@users.noreply.github.com"
                    logging.info(f"[Schedule] Resolved: login={login}, name={name}, email={email}")
                except Exception as resolve_err:
                    logging.warning(f"[Schedule] Failed to resolve user: {resolve_err}")
                    login = login or "github-user"
                    name = name or login
                    email = email or f"{login}@users.noreply.github.com"

            # Clean up owner: if payload owner is empty or placeholder 'Authenticated User', fallback to user login
            req_owner = payload.repoOwner.strip() if payload.repoOwner else ""
            if not req_owner or req_owner == "Authenticated User":
                owner = login
            else:
                owner = req_owner

            repo = payload.repoName.strip() if payload.repoName else "APP_Commit"
            branch = payload.branch.strip() if payload.branch else "main"

            timestamps = build_preset_timestamps(
                start_date_str=payload.startDate,
                end_date_str=payload.endDate,
                preset_id=payload.presetId or "consistent-daily",
                daily_count=payload.dailyCount or 5,
                min_daily=payload.minDaily or 1,
                max_daily=payload.maxDaily or (payload.dailyCount or 8),
                jitter_mins=payload.timeJitterMinutes or 0,
                filter_mode=payload.filterMode or "all",
            )

            if not timestamps:
                raise HTTPException(status_code=400, detail="No active commit days in the selected date window for this strategy.")

            # 1. Validate repo exists (or auto-create if missing)
            repo_url = f"https://api.github.com/repos/{owner}/{repo}"
            repo_info = None

            try:
                repo_info = await github_api_call(client, "GET", repo_url, token)
            except HTTPException as e:
                if e.status_code == 404:
                    # Auto-create the target repository on GitHub if it doesn't exist
                    try:
                        create_repo_url = "https://api.github.com/user/repos"
                        repo_info = await github_api_call(
                            client,
                            "POST",
                            create_repo_url,
                            token,
                            {
                                "name": repo,
                                "description": "GitStreak automated contribution repository",
                                "private": False,
                                "auto_init": True,
                            }
                        )
                        await asyncio.sleep(2.0)
                    except Exception as create_err:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Repository '{owner}/{repo}' was not found and could not be created automatically: {str(create_err)}"
                        )
                else:
                    raise

            # 2. Get branch ref SHA (or create branch)
            ref_url = f"https://api.github.com/repos/{owner}/{repo}/git/ref/heads/{branch}"
            parent_sha = None

            try:
                ref_data = await github_api_call(client, "GET", ref_url, token)
                parent_sha = ref_data["object"]["sha"]
            except HTTPException:
                # If target branch not found, try default branch
                default_branch = repo_info.get("default_branch", "main") if repo_info else "main"
                default_ref_url = f"https://api.github.com/repos/{owner}/{repo}/git/ref/heads/{default_branch}"
                
                try:
                    default_ref = await github_api_call(client, "GET", default_ref_url, token)
                    parent_sha = default_ref["object"]["sha"]

                    # Create new branch from default branch SHA
                    create_ref_url = f"https://api.github.com/repos/{owner}/{repo}/git/refs"
                    new_ref = await github_api_call(client, "POST", create_ref_url, token, {
                        "ref": f"refs/heads/{branch}",
                        "sha": parent_sha
                    })
                    parent_sha = new_ref["object"]["sha"]
                except Exception:
                    # Repository is completely empty! Bootstrap with initial commit
                    init_url = f"https://api.github.com/repos/{owner}/{repo}/contents/README.md"
                    init_resp = await client.put(
                        init_url,
                        headers={
                            "Authorization": f"Bearer {token}",
                            "Accept": "application/json",
                            "User-Agent": "GitStreak",
                        },
                        json={
                            "message": "Initial commit via GitStreak Engine",
                            "content": "IyBHaXRTdHJlYWsNCg0KSW5pdGlhbGl6ZWQgYnkgR2l0U3RyZWFrIENvbnRyaWJ1dGlvbiBFbmdpbmU=",
                            "branch": branch
                        }
                    )
                    if init_resp.status_code in [200, 201]:
                        init_data = init_resp.json()
                        parent_sha = init_data["commit"]["sha"]
                    else:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Failed to initialize repository '{owner}/{repo}'. Please create at least one commit on GitHub."
                        )

            # 3. Get latest tree SHA
            latest_commit = await github_api_call(client, "GET", f"https://api.github.com/repos/{owner}/{repo}/git/commits/{parent_sha}", token)
            base_tree_sha = latest_commit["tree"]["sha"]

            committed_count = 0
            total_commits = len(timestamps)
            target_path = payload.targetFilePath or "commit-log.json"

            # Prepare log file content & create shared tree for fast batch commit generation
            log_payload_str = (
                f'{{\n'
                f'  "engine": "GitStreak",\n'
                f'  "preset": "{payload.presetId}",\n'
                f'  "total_commits": {total_commits},\n'
                f'  "startDate": "{payload.startDate}",\n'
                f'  "endDate": "{payload.endDate}",\n'
                f'  "executedAt": "{datetime.now(timezone.utc).isoformat()}"\n'
                f'}}\n'
            )
            blob_data = await github_api_call(
                client, "POST", f"https://api.github.com/repos/{owner}/{repo}/git/blobs", token,
                {"content": log_payload_str, "encoding": "utf-8"}
            )
            blob_sha = blob_data["sha"]

            new_tree = await github_api_call(
                client, "POST", f"https://api.github.com/repos/{owner}/{repo}/git/trees", token,
                {
                    "base_tree": base_tree_sha,
                    "tree": [
                        {
                            "path": target_path,
                            "mode": "100644",
                            "type": "blob",
                            "sha": blob_sha
                        }
                    ]
                }
            )
            commit_tree_sha = new_tree["sha"]

            # 4. Fast author backdated commits
            for idx, ts in enumerate(timestamps, start=1):
                iso_date = ts.isoformat()

                if payload.commitMessagePattern == "conventional":
                    msg = generate_conventional_message(idx, total_commits)
                else:
                    msg = f"GitStreak commit {idx}/{total_commits} - {ts.strftime('%Y-%m-%d %H:%M')}"

                commit_payload = {
                    "message": msg,
                    "tree": commit_tree_sha,
                    "parents": [parent_sha],
                    "author": {
                        "name": name,
                        "email": email,
                        "date": iso_date
                    },
                    "committer": {
                        "name": name,
                        "email": email,
                        "date": iso_date
                    }
                }

                commit_res = await github_api_call(client, "POST", f"https://api.github.com/repos/{owner}/{repo}/git/commits", token, commit_payload)
                parent_sha = commit_res["sha"]
                committed_count += 1

            # 5. Update branch HEAD using plural /git/refs/heads/{branch} endpoint
            patch_ref_url = f"https://api.github.com/repos/{owner}/{repo}/git/refs/heads/{branch}"
            await github_api_call(client, "PATCH", patch_ref_url, token, {
                "sha": parent_sha,
                "force": True
            })

            return {
                "status": "success",
                "message": f"Successfully created {committed_count} backdated commits for '{owner}/{repo}' on branch '{branch}'.",
                "totalCommits": committed_count,
                "headSha": parent_sha,
                "repository": f"{owner}/{repo}",
                "branch": branch
            }

    except HTTPException as he:
        logging.error(f"[Schedule] HTTPException: status={he.status_code}, detail={he.detail}")
        raise
    except Exception as exc:
        tb = traceback.format_exc()
        logging.error(f"[Schedule] Unhandled exception: {exc}\n{tb}")
        raise HTTPException(
            status_code=400,
            detail=f"Git execution error: {str(exc)}"
        )
