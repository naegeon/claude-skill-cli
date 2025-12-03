#!/usr/bin/env python3
"""
Skill Enforcer Hook - 동적 스킬 감지 및 체크리스트 주입
Claude Skills Framework

PreToolUse Hook으로 Write/Edit 도구 사용 시 발동
파일 패턴을 감지하여 해당 스킬의 체크리스트를 Claude에게 주입
"""

import json
import sys
import os
import re
from pathlib import Path


# 파일 패턴 → 스킬 매핑 (범용)
PATTERN_TO_SKILL = {
    "database": [
        r"schema\.(ts|js)$",
        r"db/",
        r"drizzle/",
        r"prisma/",
        r"migrations/",
        r"models/",
    ],
    "backend": [
        r"api/.*route\.(ts|js)$",
        r"api/.*\.(ts|js)$",
        r"server/",
        r"actions/",
        r"services/",
    ],
    "frontend": [
        r"components/.*\.(tsx|jsx)$",
        r"app/.*page\.(tsx|jsx)$",
        r"pages/.*\.(tsx|jsx)$",
        r"hooks/.*\.(ts|js)$",
    ],
    "auth": [
        r"auth",
        r"login",
        r"session",
        r"middleware\.(ts|js)$",
    ],
    "styling": [
        r"\.css$",
        r"\.scss$",
        r"styles/",
        r"tailwind",
    ],
    "config": [
        r"config/",
        r"\.env",
        r"settings\.(ts|js)$",
    ],
    "api-spec": [
        r"api/.*route\.(ts|js)$",
    ],
}

# 핵심 규칙 (항상 적용, Level 0)
CORE_RULES = """
⚠️ **핵심 규칙 (항상 적용)**
- any 타입 사용 금지
- 환경변수 하드코딩 금지
- 사이트명/사업자정보 하드코딩 금지 → config 사용
- console.log 제거 (디버깅 완료 후)
"""


def get_project_dir():
    """프로젝트 디렉토리 경로 반환"""
    return os.environ.get("CLAUDE_PROJECT_DIR", ".")


def get_available_skills(project_dir):
    """현재 프로젝트의 스킬 목록 동적 감지"""
    skills_dir = Path(project_dir) / ".claude" / "skills"
    available = []

    if skills_dir.exists():
        for item in skills_dir.iterdir():
            if item.is_dir() and item.name != "_templates":
                skill_file = item / "SKILL.md"
                if skill_file.exists():
                    available.append(item.name)

    return available


def extract_checklist(content):
    """SKILL.md에서 체크리스트 섹션 추출"""
    # "## 필수 체크리스트" 또는 "## 체크리스트" 섹션 찾기
    patterns = [
        r'##\s*필수\s*체크리스트.*?\n([\s\S]*?)(?=\n##|\n---|\Z)',
        r'##\s*체크리스트.*?\n([\s\S]*?)(?=\n##|\n---|\Z)',
        r'###\s*.*체크.*?\n([\s\S]*?)(?=\n##|\n###|\n---|\Z)',
    ]

    for pattern in patterns:
        match = re.search(pattern, content, re.IGNORECASE)
        if match:
            checklist = match.group(1).strip()
            # 체크리스트 항목만 추출 (- [ ] 패턴)
            items = re.findall(r'-\s*\[.\].*', checklist)
            if items:
                return '\n'.join(items[:10])  # 최대 10개

    return None


def load_skill_checklist(project_dir, skill_name):
    """스킬 파일에서 체크리스트 로드"""
    skill_file = Path(project_dir) / ".claude" / "skills" / skill_name / "SKILL.md"

    if skill_file.exists():
        content = skill_file.read_text(encoding='utf-8')
        return extract_checklist(content)

    return None


def match_skills(file_path, available_skills):
    """파일 경로에 매칭되는 스킬 찾기"""
    matched = []

    for skill, patterns in PATTERN_TO_SKILL.items():
        if skill not in available_skills:
            continue

        for pattern in patterns:
            if re.search(pattern, file_path, re.IGNORECASE):
                if skill not in matched:
                    matched.append(skill)
                break

    return matched


def main():
    try:
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    tool_input = input_data.get("tool_input", {})
    file_path = tool_input.get("file_path", "")

    if not file_path:
        sys.exit(0)

    project_dir = get_project_dir()
    available_skills = get_available_skills(project_dir)

    # 스킬이 없으면 (PRD 미생성 상태) 핵심 규칙만 표시
    if not available_skills:
        output = {
            "systemMessage": CORE_RULES,
            "continue": True
        }
        print(json.dumps(output, ensure_ascii=False))
        sys.exit(0)

    # 매칭되는 스킬 찾기
    matched_skills = match_skills(file_path, available_skills)

    if not matched_skills:
        sys.exit(0)

    # 매칭된 스킬의 체크리스트 로드
    messages = [CORE_RULES, ""]

    for skill in matched_skills:
        checklist = load_skill_checklist(project_dir, skill)
        if checklist:
            messages.append(f"📋 **{skill} 스킬 체크리스트**")
            messages.append(checklist)
            messages.append("")

    if len(messages) > 2:  # 핵심 규칙 외에 추가된 것이 있으면
        output = {
            "systemMessage": '\n'.join(messages),
            "continue": True
        }
        print(json.dumps(output, ensure_ascii=False))

    sys.exit(0)


if __name__ == "__main__":
    main()
