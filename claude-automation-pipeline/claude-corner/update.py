#!/usr/bin/env python3
"""
Claude Corner Updater
Posts field notes and updates stats on id8labs.app/claude-corner.
Used by the scheduled remote agent.
"""

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime


def load_credentials(creds_path="claude-corner/credentials.env"):
    """Load API keys from credentials.env file."""
    creds = {}
    with open(creds_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                creds[key.strip()] = value.strip().strip('"')
    return creds


def post_observation(base_url, api_key, text, category="observation", is_pinned=False):
    """Post a new field note to Claude Corner."""
    url = f"{base_url}/api/claude-observations"
    payload = {
        "text": text,
        "category": category,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "is_pinned": is_pinned,
        "source": "scheduled-agent",
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
            print(f"[OK] Observation posted: {result}")
            return result
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        print(f"[ERROR] POST observation failed ({e.code}): {body}")
        return None


def increment_stat(base_url, api_key, stat_type, name=None, increment=1):
    """Increment a stat counter (tool, agent, skill, session, quality)."""
    url = f"{base_url}/api/claude-stats"
    payload = {"type": stat_type, "increment": increment}
    if name:
        payload["name"] = name

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
            print(f"[OK] Stat incremented: {stat_type}/{name} +{increment}")
            return result
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        print(f"[ERROR] POST stat failed ({e.code}): {body}")
        return None


def patch_stats(base_url, api_key, updates):
    """Set absolute stat values (projects_shipped, milestones_hit, hours_collaborated, sessions_count)."""
    url = f"{base_url}/api/claude-stats"

    req = urllib.request.Request(
        url,
        data=json.dumps(updates).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="PATCH",
    )

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
            print(f"[OK] Stats patched: {updates}")
            return result
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        print(f"[ERROR] PATCH stats failed ({e.code}): {body}")
        return None


def get_current_stats(base_url):
    """Fetch current stats (public, no auth needed)."""
    url = f"{base_url}/api/claude-stats"
    req = urllib.request.Request(url)

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
            return result.get("stats", {})
    except urllib.error.HTTPError as e:
        print(f"[ERROR] GET stats failed ({e.code})")
        return None


if __name__ == "__main__":
    # Quick test: python3 claude-corner/update.py "Test observation"
    if len(sys.argv) < 2:
        print("Usage: python3 claude-corner/update.py <observation_text> [category]")
        sys.exit(1)

    creds = load_credentials()
    text = sys.argv[1]
    category = sys.argv[2] if len(sys.argv) > 2 else "observation"

    post_observation(
        creds["ID8LABS_BASE_URL"],
        creds["CLAUDE_OBSERVATIONS_API_KEY"],
        text,
        category,
    )
