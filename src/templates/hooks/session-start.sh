#!/bin/bash
# Session Start Hook - PRD + Handoff 자동 로드
# Claude Skills Framework

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 세션 시작 프로토콜"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. PRD.md 확인 및 요약 로드
if [ -f "$PROJECT_DIR/PRD.md" ]; then
    echo ""
    echo "📋 PRD 로드됨"
    echo "─────────────────────────────────────────"
    # PRD 첫 50줄 또는 개요 섹션만 표시
    head -50 "$PROJECT_DIR/PRD.md" | grep -A 20 "^#\|^##" | head -30
    echo "..."
    echo "(전체 내용은 PRD.md 참조)"
else
    echo ""
    echo "⚠️  PRD.md 없음 - 'PRD 생성해줘'로 시작하세요"
fi

# 2. Session Handoff 확인
HANDOFF_FILE="$PROJECT_DIR/.claude/sync/session-handoff.md"
if [ -f "$HANDOFF_FILE" ]; then
    echo ""
    echo "📝 이전 세션 인계사항"
    echo "─────────────────────────────────────────"
    cat "$HANDOFF_FILE"
else
    echo ""
    echo "📝 이전 세션 기록 없음 (새 세션)"
fi

# 3. Hotfix 항목 확인 (있으면 우선 처리 요청)
if [ -f "$HANDOFF_FILE" ] && grep -q "HOTFIX\|hotfix" "$HANDOFF_FILE"; then
    echo ""
    echo "🚨 HOTFIX 항목 발견! 우선 처리 필요:"
    echo "─────────────────────────────────────────"
    grep -A 3 "HOTFIX\|hotfix" "$HANDOFF_FILE"
fi

# 4. 사용 가능한 스킬 목록
SKILLS_DIR="$PROJECT_DIR/.claude/skills"
if [ -d "$SKILLS_DIR" ]; then
    echo ""
    echo "🔧 사용 가능한 스킬"
    echo "─────────────────────────────────────────"
    for skill_dir in "$SKILLS_DIR"/*/; do
        if [ -f "${skill_dir}SKILL.md" ]; then
            skill_name=$(basename "$skill_dir")
            # _templates 폴더 제외
            if [ "$skill_name" != "_templates" ]; then
                echo "  • $skill_name"
            fi
        fi
    done
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 세션 준비 완료 - 작업을 시작하세요"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit 0
