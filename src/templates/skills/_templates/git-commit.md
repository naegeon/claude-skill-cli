---
name: git-commit
description: |
  Git 커밋 가이드. "커밋해줘", "저장해줘", "변경사항 저장", "작업 완료"
  관련 요청 시 활성화.
allowed-tools: Bash, Read, Grep
---

# Git Commit Guide

> 일반 사용자를 위한 Git 커밋 가이드

---

## 트리거 키워드

```
"커밋해줘"
"저장해줘"
"변경사항 저장"
"작업 완료"
"푸시해줘"
"업로드해줘"
```

---

## 커밋 플로우

```
Step 1: 상태 확인
    ↓
Step 2: 변경 내용 분석
    ↓
Step 3: 커밋 메시지 생성
    ↓
Step 4: 사용자 확인
    ↓
Step 5: 커밋 실행
    ↓
(선택) Step 6: 푸시
```

---

## Step 1: 상태 확인

```bash
# 실행할 명령어
git status
git diff --name-only
```

### 상태별 안내

```
✅ 변경사항 있음 → Step 2로 진행

❌ 변경사항 없음 →
"변경된 파일이 없습니다.
수정한 파일이 있다면 저장(Ctrl+S) 후 다시 시도해주세요."

⚠️ 충돌 있음 →
"충돌이 발생했습니다. 해결이 필요합니다.
충돌 파일: [파일명]
'충돌 해결해줘'라고 말씀해주세요."
```

---

## Step 2: 변경 내용 분석

### 파일 유형별 분류

```
추가된 파일 (A): 새로 만든 파일
수정된 파일 (M): 기존 파일 수정
삭제된 파일 (D): 삭제한 파일
```

### 변경 요약 생성

```markdown
## 변경 내용

📁 **수정된 파일** (3개)
- `src/components/Button.tsx` - 버튼 스타일 변경
- `src/pages/index.tsx` - 홈페이지 레이아웃 수정
- `package.json` - 의존성 추가

📁 **새로 추가된 파일** (1개)
- `src/components/Card.tsx` - 카드 컴포넌트

📁 **삭제된 파일** (0개)
- 없음
```

---

## Step 3: 커밋 메시지 생성

### 컨벤션 규칙

```
<type>(<scope>): <subject>

type:
  feat     새 기능
  fix      버그 수정
  docs     문서 변경
  style    코드 포맷팅 (기능 변경 없음)
  refactor 리팩토링
  test     테스트 추가/수정
  chore    빌드, 설정 변경

scope: 변경 영역 (components, pages, api, db 등)
subject: 변경 내용 (한글 OK)
```

### 메시지 생성 규칙

```
1. 변경 파일 분석
2. 주요 변경 사항 파악
3. 적절한 type 선택
4. 간결한 subject 작성
```

### 예시

```
단일 기능:
feat(components): 카드 컴포넌트 추가

여러 변경:
feat(ui): 버튼 스타일 개선 및 카드 컴포넌트 추가

버그 수정:
fix(api): 인증 토큰 만료 처리 수정

문서:
docs(readme): 설치 가이드 업데이트
```

---

## Step 4: 사용자 확인

```markdown
## 커밋 준비 완료

### 변경 내용
- Button.tsx 스타일 수정
- Card.tsx 컴포넌트 추가

### 커밋 메시지
`feat(ui): 버튼 스타일 개선 및 카드 컴포넌트 추가`

---

[커밋] [메시지 수정] [취소]
```

### 메시지 수정 요청 시

```
"어떤 메시지로 변경할까요?
예: 'UI 컴포넌트 업데이트' 또는 원하는 내용을 알려주세요."
```

---

## Step 5: 커밋 실행

```bash
# 모든 변경사항 추가
git add .

# 커밋 (HEREDOC 사용)
git commit -m "$(cat <<'EOF'
feat(ui): 버튼 스타일 개선 및 카드 컴포넌트 추가

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 커밋 완료 메시지

```markdown
## ✅ 커밋 완료!

**커밋 ID**: `abc1234`
**메시지**: feat(ui): 버튼 스타일 개선 및 카드 컴포넌트 추가
**파일 수**: 3개

---

GitHub에 업로드하려면 "푸시해줘"라고 말씀해주세요.
```

---

## Step 6: 푸시 (선택)

### 푸시 트리거

```
"푸시해줘"
"업로드해줘"
"GitHub에 올려줘"
"원격에 반영해줘"
```

### 푸시 전 확인

```bash
# 원격 상태 확인
git status
# "Your branch is ahead of 'origin/main' by X commits"
```

### 푸시 실행

```bash
git push origin main
```

### 푸시 완료 메시지

```markdown
## ✅ 푸시 완료!

GitHub에 변경사항이 업로드되었습니다.

🔗 저장소: [GitHub 링크]
```

---

## 특수 상황 처리

### 민감 파일 감지

```
⚠️ 주의: 다음 파일이 포함되어 있습니다.

- `.env` - 환경 변수 (API 키 포함 가능)
- `credentials.json` - 인증 정보

이 파일들은 커밋에서 제외할까요?

[제외하고 커밋] [그대로 커밋] [취소]
```

### 대용량 파일 감지

```
⚠️ 대용량 파일이 감지되었습니다.

- `video.mp4` (150MB)

GitHub는 100MB 이상 파일을 거부합니다.
이 파일을 제외할까요?

[제외하고 커밋] [취소]
```

### 커밋 취소 요청

```
"커밋 취소해줘"
"방금 커밋 되돌려줘"

→ git reset --soft HEAD~1
→ "마지막 커밋이 취소되었습니다. 변경사항은 유지됩니다."
```

---

## 자주 쓰는 표현 → 액션

| 사용자 표현 | 실행 액션 |
|-----------|----------|
| "저장해줘" | 커밋 |
| "커밋해줘" | 커밋 |
| "푸시해줘" | 푸시 |
| "업로드해줘" | 푸시 |
| "되돌려줘" | reset --soft |
| "상태 확인" | git status |
| "뭐 바꿨지?" | git diff |

---

## 금지 사항

- `git push --force` 사용 금지 (데이터 손실 위험)
- `git reset --hard` 사용 금지 (변경사항 삭제)
- `.env` 파일 커밋 금지 (보안)
- 100MB 이상 파일 커밋 금지

---

## 참조

- 프로젝트 컨벤션: `CONVENTION_RULE.md`
- Git 가이드: `CLAUDE.md` > Git 커밋 형식
