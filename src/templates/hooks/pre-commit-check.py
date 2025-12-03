#!/usr/bin/env python3
"""
Pre-Commit Check Hook - 커밋 전 검증
Claude Skills Framework

Bash 도구에서 git commit 감지 시 발동
빌드/린트 체크 및 세션 핸드오프 작성 유도
"""

import json
import sys
import os
import re


def main():
    try:
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    tool_input = input_data.get("tool_input", {})
    command = tool_input.get("command", "")

    # git commit 명령 감지
    if not re.search(r'git\s+commit', command, re.IGNORECASE):
        sys.exit(0)

    project_dir = os.environ.get("CLAUDE_PROJECT_DIR", ".")

    # 커밋 전 체크리스트 표시
    checklist = """
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 **커밋 전 체크리스트**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**필수 확인 (커밋 전)**
- [ ] 린트 통과: `npm run lint`
- [ ] 타입 체크: `npm run type-check` 또는 `tsc --noEmit`
- [ ] 빌드 성공: `npm run build`

**코드 품질**
- [ ] any 타입 사용 없음
- [ ] console.log 제거됨
- [ ] 하드코딩된 설정값 없음

**문서화**
- [ ] session-handoff.md 업데이트 (다음 세션 과제 명시)

**HOTFIX 항목 확인**
- [ ] HOTFIX 주석이 있다면 기록됨

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
위 항목을 확인했나요? 확인 후 커밋을 진행하세요.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

    output = {
        "systemMessage": checklist,
        "continue": True
    }
    print(json.dumps(output, ensure_ascii=False))
    sys.exit(0)


if __name__ == "__main__":
    main()
