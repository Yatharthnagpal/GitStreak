from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/api/presets", tags=["presets"])

class PresetGenerateRequest(BaseModel):
    presetId: str
    startDate: str
    endDate: str
    dailyCount: Optional[int] = 5
    minDaily: Optional[int] = 1
    maxDaily: Optional[int] = 8

class DayActivity(BaseModel):
    date: str
    count: int
    dayName: str
    intensity: int  # 0 to 4 scale

@router.get("/list")
async def list_presets():
    return [
        {
            "id": "consistent-daily",
            "name": "Consistent Daily",
            "tagline": "Balanced activity distribution",
            "description": "Same commit count performed for all days between schedule dates.",
            "patternSummary": "Fixed Daily Count · All Days",
            "ruleText": "Fixed daily count for all days in window",
        },
        {
            "id": "weekday-shift",
            "name": "Weekday Shift",
            "tagline": "Standard Monday-Friday workflow",
            "description": "Random commits between min and max from Monday to Friday, zero on weekends.",
            "patternSummary": "Mon–Fri Focus · Zero Weekends",
            "ruleText": "Random commits (min-max) Mon-Fri only",
        },
        {
            "id": "weekend-warrior",
            "name": "Weekend Warrior",
            "tagline": "Weekend coding sprint",
            "description": "Random commits between min and max on Saturdays and Sundays only.",
            "patternSummary": "Sat–Sun Heavy · Zero Weekdays",
            "ruleText": "Random commits (min-max) Sat-Sun only",
        },
        {
            "id": "random-burst",
            "name": "Random Burst",
            "tagline": "Organic variable frequency",
            "description": "Random commits between min and max for the whole week for all days.",
            "patternSummary": "Dynamic · Whole Week",
            "ruleText": "Random commits (min-max) all 7 days",
        },
        {
            "id": "light-touch",
            "name": "Light Touch",
            "tagline": "Minimal steady presence",
            "description": "Random commits of 1, 2, or 3 for the whole week for all days.",
            "patternSummary": "Minimal 1-3 Commits · All Days",
            "ruleText": "Random 1, 2, or 3 commits all 7 days",
        },
    ]

@router.post("/generate")
async def generate_preset_schedule(payload: PresetGenerateRequest):
    try:
        start = datetime.strptime(payload.startDate, "%Y-%m-%d")
        end = datetime.strptime(payload.endDate, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format YYYY-MM-DD.")

    if end < start:
        raise HTTPException(status_code=400, detail="End date must be after start date.")

    preset = (payload.presetId or "consistent-daily").lower()
    days: List[DayActivity] = []
    current = start

    low = min(payload.minDaily or 1, payload.maxDaily or payload.dailyCount or 8)
    high = max(payload.minDaily or 1, payload.maxDaily or payload.dailyCount or 8)
    fixed_count = payload.dailyCount or 5

    while current <= end:
        day_name = current.strftime("%A").lower()
        is_weekend = day_name in ["saturday", "sunday"]

        count = 0

        # RULE 1: Consistent Daily -> Same commit count for all days
        if preset == "consistent-daily":
            count = fixed_count

        # RULE 2: Weekday Shift -> Random commits (min to max) Mon-Fri, 0 on weekends
        elif preset == "weekday-shift":
            count = random.randint(low, high) if not is_weekend else 0

        # RULE 3: Weekend Warrior -> Random commits (min to max) Sat-Sun, 0 on weekdays
        elif preset == "weekend-warrior":
            count = random.randint(low, high) if is_weekend else 0

        # RULE 4: Random Burst -> Random commits (min to max) whole week
        elif preset == "random-burst":
            count = random.randint(low, high)

        # RULE 5: Light Touch -> Random commits 1, 2, or 3 whole week
        elif preset == "light-touch":
            count = random.choice([1, 2, 3])

        else:
            count = fixed_count

        # Intensity scale 0-4
        intensity = 0
        if count > 0:
            if count <= 2:
                intensity = 1
            elif count <= 5:
                intensity = 2
            elif count <= 9:
                intensity = 3
            else:
                intensity = 4

        days.append(
            DayActivity(
                date=current.strftime("%Y-%m-%d"),
                count=count,
                dayName=day_name.capitalize(),
                intensity=intensity,
            )
        )
        current += timedelta(days=1)

    total_commits = sum(d.count for d in days)
    active_days = sum(1 for d in days if d.count > 0)

    return {
        "presetId": preset,
        "totalCommits": total_commits,
        "totalDays": len(days),
        "activeDays": active_days,
        "schedule": days,
    }
