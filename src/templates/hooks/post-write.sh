#!/bin/bash
# Post-Write Hook - 파일 작성 후 처리
# Claude Skills Framework

# stdin에서 JSON 읽기
INPUT=$(cat)

# file_path 추출 (jq가 없을 경우를 대비한 간단한 파싱)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*: *"\([^"]*\)"/\1/')

if [ -z "$FILE_PATH" ]; then
    exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"

# 1. TypeScript/JavaScript 파일 자동 포매팅 (prettier가 있으면)
if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
    if command -v npx &> /dev/null && [ -f "$PROJECT_DIR/package.json" ]; then
        # prettier가 설치되어 있으면 실행
        if grep -q "prettier" "$PROJECT_DIR/package.json" 2>/dev/null; then
            npx prettier --write "$FILE_PATH" 2>/dev/null || true
        fi
    fi
fi

# 2. 변경 사항 로깅 (세션 추적용)
LOG_DIR="$PROJECT_DIR/.claude/sync"
LOG_FILE="$LOG_DIR/changes.log"

mkdir -p "$LOG_DIR"

# 변경 로그 기록
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Modified: $FILE_PATH" >> "$LOG_FILE"

# 로그 파일 크기 제한 (최근 100줄만 유지)
if [ -f "$LOG_FILE" ]; then
    tail -100 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi

exit 0
