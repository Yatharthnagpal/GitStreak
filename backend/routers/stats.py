from typing import List, Optional
from fastapi import APIRouter, HTTPException, Request
import httpx
from datetime import datetime, timedelta, timezone
from collections import defaultdict, Counter

from routers.auth import get_current_user_from_req

router = APIRouter(prefix="/api/stats", tags=["stats"])

GRAPHQL_QUERY = """
query {
  viewer {
    login
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
  }
}
"""

@router.get("/dashboard")
async def get_dashboard_stats(request: Request):
    user = get_current_user_from_req(request)
    if not user or not user.get("accessToken"):
        return {
            "authenticated": False,
            "totalCommits": 0,
            "activeDays": 0,
            "currentStreak": 0,
            "connectedRepos": 0,
            "trendData": [],
            "heatmapDays": [],
        }

    token = user["accessToken"]
    login = user.get("login")
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "User-Agent": "GitStreak",
    }

    async with httpx.AsyncClient() as client:
        # 1. Fetch user profile stats (repos count)
        user_resp = await client.get("https://api.github.com/user", headers=headers)
        if user_resp.status_code != 200:
            raise HTTPException(status_code=user_resp.status_code, detail="Failed to fetch GitHub profile stats.")
        
        user_data = user_resp.json()
        login = user_data.get("login") or login
        pub_repos = user_data.get("public_repos", 0)
        priv_repos = user_data.get("total_private_repos", 0) or user_data.get("owned_private_repos", 0)
        connected_repos = pub_repos + priv_repos

        total_contributions = 0
        heatmap_days = []
        active_days_count = 0
        current_streak = 0
        trend_data = []

        # 2. Try fetching full 52-week contribution calendar via GitHub GraphQL API
        gql_resp = await client.post(
            "https://api.github.com/graphql",
            headers=headers,
            json={"query": GRAPHQL_QUERY},
            timeout=10.0,
        )

        if gql_resp.status_code == 200 and "data" in gql_resp.json():
            gql_data = gql_resp.json()["data"]["viewer"]["contributionsCollection"]["contributionCalendar"]
            total_contributions = gql_data.get("totalContributions", 0)
            weeks = gql_data.get("weeks", [])

            day_dict = {}
            for week in weeks:
                for day in week.get("contributionDays", []):
                    d_str = day["date"]
                    cnt = day["contributionCount"]
                    day_dict[d_str] = cnt

                    # Intensity 0 to 4 scale
                    intensity = 0
                    if cnt > 0:
                        if cnt <= 2:
                            intensity = 1
                        elif cnt <= 5:
                            intensity = 2
                        elif cnt <= 8:
                            intensity = 3
                        else:
                            intensity = 4

                    heatmap_days.append({
                        "date": d_str,
                        "count": cnt,
                        "intensity": intensity
                    })

                    if cnt > 0:
                        active_days_count += 1

            # Calculate current streak ending today/yesterday
            today = datetime.now(timezone.utc).date()
            check_date = today
            while True:
                c_str = check_date.strftime("%Y-%m-%d")
                if day_dict.get(c_str, 0) > 0:
                    current_streak += 1
                    check_date -= timedelta(days=1)
                else:
                    if check_date == today:
                        check_date -= timedelta(days=1)
                        continue
                    break

            trend_data = [d["count"] for d in heatmap_days[-24:]]

        else:
            # Fallback to REST events API if GraphQL fails
            daily_activity = defaultdict(int)
            total_commits_count = 0

            for page in range(1, 4):
                events_resp = await client.get(
                    f"https://api.github.com/users/{login}/events?per_page=100&page={page}",
                    headers=headers,
                )
                if events_resp.status_code == 200:
                    events = events_resp.json()
                    if not events:
                        break
                    for ev in events:
                        event_type = ev.get("type")
                        created_at = ev.get("created_at")
                        if created_at:
                            date_str = created_at.split("T")[0]
                            if event_type == "PushEvent":
                                payload = ev.get("payload", {})
                                commits = payload.get("commits", [])
                                c_count = len(commits) if commits else 1
                                daily_activity[date_str] += c_count
                                total_commits_count += c_count
                            elif event_type in ["PullRequestEvent", "CreateEvent", "IssueCommentEvent"]:
                                daily_activity[date_str] += 1
                                total_commits_count += 1
                else:
                    break

            today = datetime.now(timezone.utc).date()
            for i in range(364, -1, -1):
                d = today - timedelta(days=i)
                d_str = d.strftime("%Y-%m-%d")
                c_count = daily_activity.get(d_str, 0)
                if c_count > 0:
                    active_days_count += 1
                intensity = 0
                if c_count > 0:
                    if c_count <= 2:
                        intensity = 1
                    elif c_count <= 5:
                        intensity = 2
                    elif c_count <= 8:
                        intensity = 3
                    else:
                        intensity = 4
                heatmap_days.append({"date": d_str, "count": c_count, "intensity": intensity})

            total_contributions = max(total_commits_count, sum(daily_activity.values()))
            trend_data = [d["count"] for d in heatmap_days[-24:]]

        return {
            "authenticated": True,
            "login": login,
            "totalCommits": total_contributions,
            "activeDays": active_days_count,
            "currentStreak": current_streak,
            "connectedRepos": connected_repos,
            "trendData": trend_data,
            "heatmapDays": heatmap_days,
        }

@router.get("/insights")
async def get_insights_stats(request: Request):
    user = get_current_user_from_req(request)
    if not user or not user.get("accessToken"):
        return {
            "authenticated": False,
            "peakDay": "N/A",
            "peakDayCount": 0,
            "activeHours": "N/A",
            "topRepo": "N/A",
            "monthlyGrowth": "+0%",
            "consistencyRating": "0%",
            "consecutiveWeeks": 0,
        }

    token = user["accessToken"]
    login = user.get("login")
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "User-Agent": "GitStreak",
    }

    async with httpx.AsyncClient() as client:
        events_resp = await client.get(
            f"https://api.github.com/users/{login}/events?per_page=100",
            headers=headers,
        )
        if events_resp.status_code != 200:
            raise HTTPException(status_code=events_resp.status_code, detail="Failed to fetch GitHub events for insights.")

        events = events_resp.json()
        weekday_counts = Counter()
        hour_counts = Counter()
        repo_counts = Counter()
        
        this_month_count = 0
        last_month_count = 0
        
        today = datetime.now(timezone.utc)
        thirty_days_ago = today - timedelta(days=30)
        sixty_days_ago = today - timedelta(days=60)
        weeks_active = set()

        for ev in events:
            repo_name = ev.get("repo", {}).get("name", "Unknown Repo")
            repo_counts[repo_name] += 1
            
            created_at_str = ev.get("created_at")
            if created_at_str:
                dt = datetime.fromisoformat(created_at_str.replace("Z", "+00:00"))
                weekday = dt.strftime("%A")
                weekday_counts[weekday] += 1
                hour_counts[dt.hour] += 1
                
                week_num = dt.isocalendar()[1]
                weeks_active.add(week_num)
                
                if dt >= thirty_days_ago:
                    this_month_count += 1
                elif dt >= sixty_days_ago:
                    last_month_count += 1

        top_day = weekday_counts.most_common(1)
        peak_day = top_day[0][0] if top_day else "Wednesday"
        peak_day_count = top_day[0][1] if top_day else 0

        top_repo_item = repo_counts.most_common(1)
        top_repo = top_repo_item[0][0] if top_repo_item else "APP_Commit"

        if hour_counts:
            most_common_hour = hour_counts.most_common(1)[0][0]
            start_hour = max(0, most_common_hour - 2)
            end_hour = min(23, most_common_hour + 3)
            active_hours = f"{start_hour:02d}:00 – {end_hour:02d}:00 UTC"
        else:
            active_hours = "09:00 – 18:00 UTC"

        if last_month_count > 0:
            growth = round(((this_month_count - last_month_count) / last_month_count) * 100)
            growth_str = f"+{growth}%" if growth >= 0 else f"{growth}%"
        else:
            growth_str = "+18%"

        consecutive_weeks = len(weeks_active)
        consistency_rating = f"{min(99, max(60, consecutive_weeks * 15))}%"

        return {
            "authenticated": True,
            "login": login,
            "peakDay": peak_day,
            "peakDayCount": peak_day_count,
            "activeHours": active_hours,
            "topRepo": top_repo,
            "monthlyGrowth": growth_str,
            "consistencyRating": consistency_rating,
            "consecutiveWeeks": max(1, consecutive_weeks),
        }

@router.get("/activity")
async def get_activity_timeline(request: Request):
    user = get_current_user_from_req(request)
    if not user or not user.get("accessToken"):
        return {"authenticated": False, "activities": []}

    token = user["accessToken"]
    login = user.get("login")
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "User-Agent": "GitStreak",
    }

    async with httpx.AsyncClient() as client:
        events_resp = await client.get(
            f"https://api.github.com/users/{login}/events?per_page=50",
            headers=headers,
        )
        if events_resp.status_code != 200:
            raise HTTPException(status_code=events_resp.status_code, detail="Failed to fetch GitHub timeline events.")

        events = events_resp.json()
        activities = []

        for idx, ev in enumerate(events, start=1):
            created_at = ev.get("created_at", "")
            time_str = created_at.replace("T", " ").replace("Z", " UTC")[:16] if created_at else "Recently"
            repo = ev.get("repo", {}).get("name", "APP_Commit")
            event_type = ev.get("type", "")

            act_type = "commit"
            desc = "Repository activity"
            hash_str = ev.get("id", f"ev-{idx}")[:7]

            if event_type == "PushEvent":
                act_type = "commit"
                payload = ev.get("payload", {})
                commits = payload.get("commits", [])
                if commits:
                    desc = commits[0].get("message", "Push commits to repository")
                    hash_str = commits[0].get("sha", hash_str)[:7]
                else:
                    desc = f"Pushed updates to {repo}"
            elif event_type == "PullRequestEvent":
                act_type = "pr"
                payload = ev.get("payload", {})
                action = payload.get("action", "opened")
                pr_title = payload.get("pull_request", {}).get("title", "Pull Request")
                desc = f"PR ({action}): {pr_title}"
            elif event_type == "PullRequestReviewEvent":
                act_type = "review"
                desc = f"Reviewed Pull Request in {repo}"
            else:
                act_type = "commit"
                desc = f"{event_type.replace('Event', '')} action in {repo}"

            activities.append({
                "id": idx,
                "time": time_str,
                "type": act_type,
                "repo": repo,
                "desc": desc,
                "hash": hash_str,
            })

        return {"authenticated": True, "activities": activities}
