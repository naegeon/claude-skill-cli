---
name: prd-generator
description: |
  PRD 기반 프로젝트 부트스트래핑 & 스킬 관리 시스템.

  [Mode 1 - 새 프로젝트] "PRD 만들어줘", "새 프로젝트", "프로젝트 시작"
  [Mode 2 - 스킬 추가] "스킬 추가해줘", "frontend 스킬 만들어줘", "backend 스킬 적용"
  [Mode 2 - 디자인 참조] "이 사이트처럼 만들어줘", "이 디자인 참고해줘" + URL
  [Mode 2 - 동적 스킬] "AI 스킬 추가해줘", "이 패턴 스킬로 만들어줘" (템플릿 없어도 생성)
  [Mode 3 - 동기화] "PRD 변경사항 반영해줘", "스킬 동기화"
  [Mode 4 - 코드 역분석] "PRD 만들어줘" + 기존 코드 존재, "코드 분석해서 PRD 만들어줘", "코드베이스 문서화"
  [Mode 5 - 문서 검증] "프로젝트 분석해줘" + PRD/CLAUDE.md 존재, "문서 검증해줘", "스킬 보완해줘"
allowed-tools: Read, Grep, Glob, Write, Edit, WebFetch, WebSearch, AskUserQuestion
---

# Project Bootstrap & Skill Management System

---

## 핵심 원칙

1. **오케스트레이션** - 기능적 스킬은 외부 라이브러리 활용
2. **템플릿 + 분석** - 패턴 스킬은 템플릿 + 프로젝트 분석으로 생성
3. **비파괴적** - 기존 PRD/CLAUDE.md 수정 없이 스킬만 추가 가능

---

## 모드 선택

```
사용자 요청 분석
    ↓
┌─────────────────────────────────────────────────────┐
│ Mode 1: 새 프로젝트 부트스트래핑                     │
│ 트리거: "PRD 만들어줘", "새 프로젝트", "프로젝트 시작"│
│ → PRD + 스킬 + CLAUDE.md 전체 생성                  │
├─────────────────────────────────────────────────────┤
│ Mode 2: 스킬 추가/업데이트                           │
│ 트리거: "스킬 추가해줘", "frontend 스킬 만들어줘"    │
│ → 특정 스킬만 생성 (PRD/CLAUDE.md 수정 없음)        │
├─────────────────────────────────────────────────────┤
│ Mode 3: PRD 동기화                                  │
│ 트리거: "PRD 변경사항 반영해줘", "스킬 동기화"       │
│ → PRD 변경 감지 → 영향받는 스킬 업데이트            │
├─────────────────────────────────────────────────────┤
│ Mode 4: 코드 역분석                                 │
│ 트리거: "PRD 만들어줘" + 기존 코드 존재              │
│ → 코드베이스 분석 → PRD + 스킬 역생성              │
├─────────────────────────────────────────────────────┤
│ Mode 5: 문서 검증 (Scenario 1 & 2)                  │
│ 트리거: "프로젝트 분석해줘" + PRD/CLAUDE.md 존재    │
│ → 기존 문서 검증 → 누락 스킬 보완 → 품질 레벨 선택 │
└─────────────────────────────────────────────────────┘
```

---

# Mode 1: 새 프로젝트 부트스트래핑

## 실행 조건

```
PRD.md: ❌ 없음
CLAUDE.md: ❌ 없음
.claude/skills/: ❌ 없음
→ Mode 1 실행
```

## 플로우

```
Phase 1: 요구사항 수집 (Q&A)
    ↓
Phase 2: 기술 스택 분석 & 검증
    ↓
Phase 3: PRD.md 생성
    ↓
Phase 4: 스킬 추천 & 생성
    ↓
Phase 5: CLAUDE.md 생성
```

## Phase 1: 요구사항 수집

```
필수 항목:
1. 프로젝트명, 한 문장 설명
2. 핵심 사용자 시나리오 3개
3. MVP 기능 (P0)
4. 기술 제약 (예산, 선호 스택)
5. 비기능 요구사항
6. 참조 디자인 (선택)
```

### 참조 디자인 질문

```
"참조할 디자인이 있나요? (선택사항)

1. [참조 사이트 URL] - 링크 입력
2. [스크린샷 첨부] - 이미지 파일 첨부
3. [없음] - 기본 디자인 시스템 사용

* URL + 스크린샷 함께 제공하면 더 정확한 분석 가능"
```

### 참조 디자인 있을 경우

```
1. WebFetch로 URL 분석
2. (있으면) 스크린샷 시각적 분석
3. 추출 요소:
   - 레이아웃 구조 (header, sidebar, grid 등)
   - 색상 팔레트
   - 컴포넌트 패턴
   - 타이포그래피
4. design-reference 스킬 자동 생성
5. design-system 스킬과 연동
```

## Phase 2: 기술 스택 분석

```
사용자 답변에서 추출:
- 프레임워크, 스타일링, DB, ORM, 인증, 배포

(선택) 웹 검색으로 호환성 검증
```

## Phase 3: PRD 생성

```markdown
# PRD: [프로젝트명]
## 1. 개요
## 2. 기술 스택
## 3. 기능 명세
## 4~8. 비기능, 보안, DB, API, 제외 범위
```

## Phase 4: 스킬 추천 & 생성

```
1. 기술 스택 → skills-registry.json 매칭
2. 스킬 분류:
   - 공식 스킬: @anthropic/* (안내만)
   - 패턴 스킬: 템플릿 + PRD로 생성
3. 사용자 확인 후 생성
```

## Phase 5: CLAUDE.md 생성

```
- 150줄 이내
- 기술 스택 테이블
- 스킬 인덱스 테이블
- 전역 금지 사항
```

### CLAUDE.md 필수 포함 섹션

**1. 세션 시작 프로토콜 (필수)**

```markdown
## ⛔ 필수 규칙 (최우선 적용)

### 세션 시작 시

모든 작업 시작 전 반드시 수행:
1. `PRD.md` 읽기 → 프로젝트 현황 파악
2. `.claude/sync/session-handoff.md` 읽기 → 이전 세션 과제 확인
3. 해당 작업의 스킬 로드 → 스킬 테이블 참조

⚠️ 이 단계를 건너뛰고 코드 작성 절대 금지
```

**2. 스킬 강제 적용 규칙 (필수)**

```markdown
### 스킬 강제 적용

| 작업 유형 | 필수 스킬 | 미준수 시 |
|----------|----------|----------|
| API 개발 | backend, api-spec | 커밋 금지 |
| UI 개발 | frontend | 커밋 금지 |
| DB 작업 | database | 커밋 금지 |
| 환경 설정 | environment | 커밋 금지 |

스킬 로드: 작업 전 "backend 스킬 적용해줘" 또는 해당 스킬 파일 읽기
```

**3. 세션 종료 프로토콜 (필수)**

```markdown
### 세션 종료 시

작업 완료/중단 시 반드시 수행:
1. 코드 리뷰 → 스킬 체크리스트 준수 확인
2. session-handoff.md 업데이트 → 다음 세션 과제 명세
   - 완료된 작업
   - 미완료 작업 + 이유
   - 다음 과제 (PRD 섹션 + 필수 스킬 명시)
3. (선택) 커밋 → git-commit 스킬 적용

"세션 마무리해줘"로 자동 수행
```

**4. 전역 금지 사항 (필수)**

```markdown
## 전역 금지 사항

- 스킬 미참조 코드 작성 금지
- 세션 프로토콜 미준수 작업 금지
- any 타입 사용 금지
- 환경변수 하드코딩 금지
- .env 파일 Git 커밋 금지
```

---

# Mode 2: 스킬 추가/업데이트

## 실행 조건

```
트리거 (일반 스킬):
- "스킬 추가해줘"
- "frontend 스킬 만들어줘"
- "backend 스킬 적용"

트리거 (디자인 참조):
- "이 사이트처럼 만들어줘" + URL
- "이 디자인 참고해줘" + URL
- "여기 레이아웃 따라해줘" + URL

트리거 (동적 스킬 생성):
- "AI 스킬 추가해줘" (템플릿 없는 스킬)
- "이 패턴 스킬로 만들어줘"
- "결제 로직 스킬화 해줘"

→ Mode 2 실행
```

## 플로우

```
Step 1: 프로젝트 현황 분석
    ↓
Step 2: 요청 스킬 확인
    ↓
Step 3: 프로젝트 맞춤 스킬 생성
    ↓
Step 4: (선택) CLAUDE.md에 스킬 추가
```

## Step 1: 프로젝트 현황 분석

```
현재 프로젝트 분석:

📁 파일 현황:
- PRD.md: ✅/❌
- CLAUDE.md: ✅/❌
- .claude/skills/: ✅/❌

📦 감지된 기술 스택:
- package.json 분석
- 설정 파일 분석 (tsconfig, tailwind.config 등)

📂 기존 스킬:
- backend: ✅/❌
- frontend: ✅/❌
- database: ✅/❌
```

## Step 2: 요청 스킬 확인

```
사용자 요청: "frontend 스킬 만들어줘"
    ↓
"frontend 스킬을 생성합니다.

분석할 소스:
1. PRD.md (있으면) - UI 요구사항
2. CLAUDE.md (있으면) - 기존 규칙
3. src/components/ - 기존 컴포넌트 패턴
4. 기술 스택 - React/Vue/Svelte 등

진행할까요?"
```

## Step 3: 스킬 생성

```
┌─────────────────────────────────┐
│ _templates/frontend.md          │  공통 템플릿
└─────────────────────────────────┘
              +
┌─────────────────────────────────┐
│ 프로젝트 분석 결과               │
│ - PRD UI 섹션                   │  프로젝트 특화
│ - 기존 코드 패턴                 │
│ - 사용 중인 UI 라이브러리        │
└─────────────────────────────────┘
              =
┌─────────────────────────────────┐
│ .claude/skills/frontend/SKILL.md│  생성됨
└─────────────────────────────────┘
```

## Step 4: CLAUDE.md 업데이트 (선택)

```
"CLAUDE.md에 frontend 스킬을 추가할까요?

현재 CLAUDE.md 스킬 목록:
- backend: ✅
- database: ✅
- frontend: ❌ (새로 추가)
```

---

## 동적 스킬 생성 (Mode 2 확장)

### 트리거

```
템플릿이 없는 스킬 요청:
- "AI 스킬 추가해줘"
- "결제 스킬 만들어줘"
- "이 패턴 스킬로 만들어줘"

또는 개발 중 반복 패턴 발견:
- "이 인증 패턴 계속 쓰는데 스킬로 만들어줘"
- "LLM 호출 패턴 통일하고 싶어"
```

### 플로우

```
사용자: "AI 스킬 추가해줘"
    ↓
Step 1: 템플릿 확인
- _templates/ai.md 검색 → ❌ 없음
    ↓
Step 2: 동적 생성 제안
"ai 스킬 템플릿이 없습니다.

선택지:
[동적 생성] 코드 분석 + Q&A로 커스텀 스킬 생성
[범용 템플릿] 최소 구조 템플릿으로 시작
[취소] 스킬 생성 취소"
    ↓
Step 3: [동적 생성] 선택 시 → 분석 시작
```

### Step 3-A: 코드베이스 분석

```
AI 관련 코드 탐색:

📂 디렉토리 스캔:
- lib/ai/, services/llm/, utils/prompt/
- app/api/ai/, app/api/chat/

📦 의존성 분석 (package.json):
- openai, @anthropic-ai/sdk, langchain
- ai (vercel ai sdk), llamaindex

📄 파일 패턴 분석:
- *.prompt.ts, *.chain.ts
- 프롬프트 템플릿 파일

🔍 코드 패턴 추출:
- API 호출 패턴
- 에러 처리 패턴
- 스트리밍 처리 패턴
- 프롬프트 관리 패턴
```

### Step 3-B: Q&A로 요구사항 보완

```
"AI 관련 코드를 분석했습니다.

감지된 패턴:
- OpenAI API 사용 (gpt-4o)
- 스트리밍 응답 처리
- 프롬프트 템플릿 분리

추가 질문:
1. 프롬프트 버전 관리가 필요한가요? [예/아니오]
2. 토큰 사용량 추적이 필요한가요? [예/아니오]
3. 폴백 모델 전략이 있나요? [예/아니오]
4. 특별히 강제하고 싶은 패턴이 있나요? [자유 입력]"
```

### Step 3-C: 스킬 생성

```
수집된 정보로 스킬 생성:

┌─────────────────────────────────┐
│ 코드 분석 결과                   │
│ - 사용 중인 라이브러리           │
│ - 기존 패턴                      │
└─────────────────────────────────┘
              +
┌─────────────────────────────────┐
│ Q&A 답변                        │
│ - 추가 요구사항                  │
│ - 강제할 패턴                    │
└─────────────────────────────────┘
              +
┌─────────────────────────────────┐
│ 범용 스킬 구조                   │
│ - 핵심 원칙                      │
│ - 체크리스트                     │
│ - 금지 사항                      │
└─────────────────────────────────┘
              =
┌─────────────────────────────────┐
│ .claude/skills/ai/SKILL.md      │  동적 생성됨
└─────────────────────────────────┘
```

### 생성되는 스킬 구조

```markdown
---
name: ai
description: |
  AI/LLM 개발 가이드 (동적 생성됨).
  "AI 기능", "LLM 호출", "프롬프트" 관련 작업 시 활성화.
generated: dynamic
source:
  analyzed_dirs: ["lib/ai/", "services/llm/"]
  detected_libs: ["openai", "ai"]
  created_at: "${DATE}"
---

# AI Development Guide

## 핵심 원칙
[코드 분석 + Q&A 기반 생성]

## 필수 체크리스트
[감지된 패턴 + 사용자 요구사항 반영]

## 코드 패턴
[기존 코드에서 추출한 패턴]

## 금지 사항
[일관성 유지를 위한 금지 항목]
```

### Hook 연동

```
동적 생성된 스킬도 Hook에서 자동 감지:

skill-enforcer.py:
1. .claude/skills/ 전체 스캔
2. ai/SKILL.md 발견
3. 파일 패턴 매핑:
   - lib/ai/*.ts → ai 스킬
   - services/llm/*.ts → ai 스킬
   - **/prompt*.ts → ai 스킬
4. 해당 파일 수정 시 체크리스트 주입
```

### 개발 중 스킬 생성 시나리오

```
개발 중 반복 패턴 발견:
"이 인증 로직 패턴 계속 똑같이 쓰는데, 스킬로 만들어줘"
    ↓
현재 작업 중인 코드 분석
    ↓
"다음 패턴을 스킬로 만들까요?

감지된 패턴:
- NextAuth 세션 검증
- 권한 체크 미들웨어
- 에러 응답 형식

스킬명 제안: auth-pattern
[생성] [수정] [취소]"
    ↓
.claude/skills/auth-pattern/SKILL.md 생성
    ↓
이후 인증 관련 코드 작성 시 자동 적용
```

---

## 디자인 참조 플로우 (Mode 2 확장)

### 트리거 감지

```
사용자: "이 사이트처럼 만들어줘" + URL
또는
사용자: "이 디자인 참고해줘" + URL + 스크린샷
```

### Step 1: 참조 사이트 분석

```
1. WebFetch로 HTML/CSS 가져오기
2. 구조 분석:
   - <header>, <nav>, <main>, <aside>, <footer>
   - Grid/Flexbox 레이아웃 패턴
   - 주요 섹션 구성

3. 스타일 추출:
   - 색상 팔레트 (primary, secondary, accent)
   - 폰트 패밀리, 크기
   - 간격 시스템 (margin, padding 패턴)
```

### Step 2: 스크린샷 분석 (있을 경우)

```
Claude Vision으로 시각적 분석:
- 실제 레이아웃 배치
- 컴포넌트 시각적 스타일
- 반응형 구조 파악
- 아이콘/이미지 스타일
```

### Step 3: 디자인 요소 정리

```
"참조 사이트 분석 완료!

📐 레이아웃:
- 구조: Header + Sidebar(왼쪽) + Main Content
- 그리드: 12컬럼, 반응형

🎨 색상 팔레트:
- Primary: #3B82F6 (파란색)
- Secondary: #10B981 (녹색)
- Background: #F9FAFB
- Text: #111827

📝 타이포그래피:
- 폰트: Inter, sans-serif
- 제목: 24px/32px bold
- 본문: 16px/24px regular

🧩 주요 컴포넌트:
- Navigation Bar (상단 고정)
- Sidebar Menu (접이식)
- Card Grid (3열)
- Data Table
- Modal Dialog

이 스타일을 적용할까요?"
```

### Step 4: design-reference 스킬 생성

```
.claude/skills/design-reference/SKILL.md 생성

내용:
- 참조 URL 기록
- 추출된 색상 팔레트
- 레이아웃 구조
- 컴포넌트 목록
- 적용 가이드라인
```

### Step 5: 프로젝트 적용

```
1. Tailwind 설정에 색상 추가 (tailwind.config.js)
2. 레이아웃 컴포넌트 생성
3. design-system 스킬 업데이트 (있으면)
4. CLAUDE.md에 디자인 참조 추가

[추가] [스킵]"
```

---

# Mode 3: PRD 동기화

## 실행 조건

```
트리거: "PRD 변경사항 반영해줘", "스킬 동기화"
→ Mode 3 실행
```

## 플로우

```
Step 1: PRD 변경 감지
    ↓
Step 2: 영향 분석
    ↓
Step 3: 스킬 업데이트 제안
    ↓
Step 4: 사용자 확인 후 적용
```

## Step 1: 변경 감지

```
manifest.json의 checksum과 현재 PRD 비교
    ↓
변경된 섹션 식별:
- 2. 기술 스택: 변경됨
- 3.2 API: 변경됨
- 나머지: 동일
```

## Step 2: 영향 분석

```
변경된 섹션 → 영향받는 스킬

"2. 기술 스택" 변경
  → environment 스킬 영향

"3.2 API" 변경
  → backend 스킬 영향
  → api-spec 스킬 영향
```

## Step 3: 업데이트 제안

```
"PRD 변경이 감지되었습니다.

변경 내용:
- 기술 스택: Node 18 → 20

영향받는 스킬:
| 스킬 | 변경 내용 |
|------|----------|
| environment | Node 버전 업데이트 |

[자동 업데이트] [검토 후 업데이트] [취소]"
```

---

# Mode 4: 코드 역분석 (Reverse Engineering)

## 실행 조건

```
PRD.md: ❌ 없음
CLAUDE.md: ❌ 없음 또는 ✅ 있음
기존 코드: ✅ 있음 (src/, app/, components/ 등)

트리거:
- "PRD 만들어줘" + 기존 코드 존재
- "코드 분석해서 PRD 만들어줘"
- "현재 코드베이스 문서화해줘"

→ Mode 4 실행
```

## 플로우

```
Phase 1: 코드베이스 탐색
    ↓
Phase 2: 기술 스택 자동 감지
    ↓
Phase 3: 기능 추출 (라우트, 컴포넌트, DB 스키마)
    ↓
Phase 4: PRD 역생성
    ↓
Phase 5: 코드 패턴 기반 스킬즈 생성
    ↓
Phase 6: CLAUDE.md 생성
```

## Phase 1: 코드베이스 탐색

```
1. 디렉토리 구조 분석
   - src/, app/, pages/, components/, lib/, utils/
   - 테스트 폴더 (tests/, __tests__/)
   - 설정 파일 위치

2. 주요 파일 식별
   - 엔트리 포인트 (index.ts, main.ts, app.ts)
   - 라우트 정의 (routes/, api/)
   - DB 스키마 (schema.ts, models/)
```

## Phase 2: 기술 스택 자동 감지

```
분석 대상:
- package.json → 의존성
- tsconfig.json → TypeScript 설정
- tailwind.config.js → 스타일링
- drizzle.config.ts / prisma/schema.prisma → ORM
- next.config.js / vite.config.ts → 프레임워크
- .env.example → 환경변수 목록

출력:
"감지된 기술 스택:
| 영역 | 기술 | 버전 |
|-----|------|-----|
| 프레임워크 | Next.js | 14.x |
| 스타일링 | Tailwind CSS | 3.x |
| ORM | Drizzle | 0.29.x |
| DB | PostgreSQL | - |
| 인증 | NextAuth | 4.x |

맞나요? [확인] [수정]"
```

## Phase 3: 기능 추출

```
1. API 라우트 분석
   - app/api/**/route.ts 스캔
   - HTTP 메서드별 엔드포인트 추출
   - 요청/응답 타입 추론

2. 페이지/컴포넌트 분석
   - app/**/page.tsx 스캔
   - 주요 컴포넌트 식별
   - 상태 관리 패턴 파악

3. DB 스키마 분석
   - 테이블/모델 추출
   - 관계 파악
   - 인덱스/제약조건

4. 비즈니스 로직 분석
   - 서비스 레이어 패턴
   - 유틸리티 함수
   - 훅 (커스텀 훅)
```

## Phase 4: PRD 역생성

```markdown
# PRD: [프로젝트명] (역분석)

> 기존 코드베이스에서 추출된 요구사항

## 1. 개요
[코드에서 추론한 프로젝트 목적]

## 2. 기술 스택
[Phase 2에서 감지된 스택]

## 3. 기능 명세

### 3.1 API 엔드포인트
[추출된 라우트 목록]

### 3.2 페이지 구성
[추출된 페이지 목록]

### 3.3 데이터 모델
[추출된 DB 스키마]

## 4. 코드 패턴
[발견된 주요 패턴]

---
⚠️ 이 PRD는 코드 역분석으로 생성됨. 검토 필요.
```

## Phase 5: 코드 패턴 기반 스킬즈 생성

```
기존 코드에서 패턴 추출 → 스킬에 반영

예시:
- API 라우트에서 인증 패턴 발견 → backend 스킬에 반영
- 컴포넌트 네이밍 규칙 발견 → frontend 스킬에 반영
- DB 쿼리 패턴 발견 → database 스킬에 반영

"기존 코드에서 발견된 패턴:

1. API 인증: getServerSession + authOptions
2. 에러 처리: try-catch + NextResponse.json
3. 컴포넌트: Named export + Props interface
4. 상태관리: SWR 사용

이 패턴들을 스킬에 반영할까요?
[반영] [수정] [스킵]"
```

## Phase 6: CLAUDE.md 생성

```
Mode 1과 동일하게 생성
+ 역분석 표시 추가

"⚠️ 이 프로젝트는 기존 코드에서 역분석되었습니다.
PRD와 스킬즈가 실제 코드와 다를 수 있으니 검토해주세요."
```

## Mode 4 완료 조건

- [ ] 코드베이스 전체 스캔 완료
- [ ] 기술 스택 감지 및 사용자 확인
- [ ] PRD.md 역생성 완료
- [ ] 코드 패턴 기반 스킬즈 생성
- [ ] CLAUDE.md 생성
- [ ] manifest.json 생성
- [ ] 사용자에게 검토 요청

---

# Mode 5: 문서 검증 모드 (Scenario 1 & 2)

## 실행 조건

```
PRD.md: ✅ 있음
CLAUDE.md: ✅ 있음 또는 ❌ 없음
기존 코드: ✅ 있음

트리거:
- "프로젝트 분석해줘" + 문서 존재
- "문서 검증해줘"
- "스킬 보완해줘"
- "Hook 추가해줘"

→ Mode 5 실행
```

## 플로우

```
Phase 0: 문서 존재 확인
    ↓
Phase 1: 기존 문서 vs 코드 검증
    ↓
Phase 2: 품질 레벨 선택 (코드 불일치 시)
    ↓
Phase 3: 스킬 보강/생성
    ↓
Phase 4: Hook 설정 추가 (선택)
```

## Phase 0: 문서 존재 확인

```
문서 현황 체크:
- PRD.md: ✅/❌
- CLAUDE.md: ✅/❌
- .claude/skills/: ✅/❌
- .claude/settings.json (Hook): ✅/❌

분기 결정:
┌─────────────────────────────────────────────────┐
│ Case A: 문서 없음                               │
│ → Mode 4 (코드 역분석)로 리다이렉트            │
├─────────────────────────────────────────────────┤
│ Case B: PRD + CLAUDE.md 있음                   │
│ → 검증 모드 진입                               │
├─────────────────────────────────────────────────┤
│ Case C: Hook만 없음                            │
│ → Hook 설정만 추가 (Phase 4로 직행)            │
└─────────────────────────────────────────────────┘
```

## Phase 1: 기존 문서 vs 코드 검증

```
1. PRD vs 실제 코드 비교
   - 기술 스택 일치 여부
   - API 엔드포인트 일치 여부
   - 페이지 구성 일치 여부
   - DB 스키마 일치 여부

2. 검증 결과 보고
   "기존 문서 검증 결과:

   ✅ 일치 항목:
   - 기술 스택 (Next.js 14, Tailwind)
   - DB 스키마 (users, items)

   ⚠️ 불일치/누락 항목:
   - API: /api/auth/* 문서화 누락
   - 컴포넌트: Header, Sidebar 패턴 미정의

   선택지:
   [검증] 기존 문서 유지, 누락 부분만 보강
   [보강] 코드 분석으로 문서 업데이트
   [리셋] Mode 4로 전체 재분석"
```

## Phase 2: 품질 레벨 선택 (Scenario 2)

```
코드 일관성이 낮을 경우 품질 레벨 선택:

"코드 패턴 분석 결과:

파일별 패턴 편차:
- API 인증: 3가지 다른 패턴 발견
- 에러 처리: 일부만 try-catch 적용
- 컴포넌트: 명명 규칙 불일치

품질 레벨을 선택해주세요:

Level 1 - 관대함 (Permissive)
→ 다양한 패턴 허용, 최소 규칙만
→ 기존 코드 수정 최소화

Level 2 - 균형 (Balanced) [권장]
→ 핵심 패턴만 강제
→ 새 코드는 표준 패턴, 기존 코드는 점진적 개선

Level 3 - 엄격함 (Strict)
→ 모든 패턴 강제
→ 기존 코드도 리팩토링 대상"
```

### 레벨별 스킬 생성 전략

```
Level 1 (관대함):
- 체크리스트: 3-5개 핵심 항목만
- 금지 사항: 보안 관련만
- 패턴: "권장" 표현 사용

Level 2 (균형):
- 체크리스트: 7-10개 항목
- 금지 사항: 보안 + 타입 안전
- 패턴: 새 코드 필수, 기존 코드 권장

Level 3 (엄격함):
- 체크리스트: 전체 항목
- 금지 사항: 모든 위반 금지
- 패턴: 모든 코드 필수 적용
```

## Phase 3: 스킬 보강/생성

```
1. 누락된 스킬 식별
   - 기존 스킬 목록 확인
   - 코드베이스에 필요한 스킬 분석
   - 차이 도출

2. 스킬 생성/업데이트
   - 누락 스킬: 템플릿 + 코드 패턴 기반 생성
   - 기존 스킬: 코드 패턴 반영 업데이트

3. 품질 레벨 설정 저장
   .claude/skills/config.json:
   {
     "qualityLevel": "balanced",
     "patterns": {
       "enforceNew": true,
       "enforceExisting": false
     }
   }
```

## Phase 4: Hook 설정 추가

```
Hook 현황:
- .claude/settings.json: ❌ 없음

"Hook 시스템을 추가하시겠습니까?

Hook 추가 시 자동화되는 항목:
1. SessionStart: PRD + handoff 자동 로드
2. PreToolUse: 파일 패턴 → 스킬 체크리스트 주입
3. PostToolUse: 포매팅 + 변경 추적

[추가] [스킵]"

→ 추가 선택 시:
   - .claude/settings.json 생성
   - .claude/hooks/ 디렉토리 생성
   - 기본 Hook 스크립트 복사
```

## Mode 5 완료 조건

- [ ] 기존 문서 검증 완료
- [ ] 불일치 항목 식별 및 보고
- [ ] (선택) 품질 레벨 선택됨
- [ ] 누락 스킬 생성/보강 완료
- [ ] (선택) Hook 설정 추가됨
- [ ] config.json 생성됨

---

# 공통: 스킬 유형 구분

## 기능적 스킬 (외부 라이브러리)

```
용도: 특정 기능 수행 (파일 처리 등)
소스: 외부 (@anthropic/*, 커뮤니티)
처리: 사용 안내만 (설치/생성 불필요)

예시:
- @anthropic/document-skills:pdf
- @anthropic/document-skills:xlsx
```

## 패턴 스킬 (프로젝트별 생성)

```
용도: 코딩 가이드라인
소스: 템플릿 + 프로젝트 분석
처리: .claude/skills/에 생성

예시:
- backend (API 패턴)
- frontend (컴포넌트 패턴)
- database (쿼리 패턴)
```

---

# 스킬 생성 상세

## 템플릿 위치

```
전역: ~/.claude/skills/_templates/
또는
프로젝트: .claude/skills/_templates/
```

## 생성 프로세스

```typescript
// 의사 코드
async function generateSkill(skillName: string) {
  // 1. 템플릿 로드
  const template = await loadTemplate(`_templates/${skillName}.md`);

  // 2. 프로젝트 분석
  const projectInfo = {
    prd: await analyzePRD(),           // PRD 관련 섹션
    claude: await analyzeCLAUDE(),     // 기존 규칙
    code: await analyzeExistingCode(), // 기존 코드 패턴
    techStack: await detectTechStack() // package.json 등
  };

  // 3. 템플릿 + 프로젝트 정보 결합
  const customizedSkill = mergeTemplateWithProject(template, projectInfo);

  // 4. 스킬 파일 생성
  await writeFile(`.claude/skills/${skillName}/SKILL.md`, customizedSkill);
}
```

---

# 체크리스트

## Mode 1 완료 조건
- [ ] PRD.md 생성됨
- [ ] CLAUDE.md 생성됨 (150줄 이내)
- [ ] 필요한 스킬 모두 생성됨
- [ ] manifest.json 생성됨

## Mode 2 완료 조건
- [ ] 요청한 스킬 생성됨
- [ ] 기존 PRD/CLAUDE.md 수정 안 됨
- [ ] (선택) CLAUDE.md에 스킬 인덱스 추가됨

## Mode 3 완료 조건
- [ ] 변경 내용 정확히 파악됨
- [ ] 영향받는 스킬 업데이트됨
- [ ] manifest.json 업데이트됨
- [ ] changelog.md 기록됨

## Mode 5 완료 조건
- [ ] 기존 문서 검증 완료
- [ ] 불일치 항목 식별 및 보고
- [ ] (선택) 품질 레벨 선택됨
- [ ] 누락 스킬 생성/보강 완료
- [ ] (선택) Hook 설정 추가됨
- [ ] config.json 생성됨

---

# 주의사항

1. **Mode 자동 판별** - 트리거 키워드로 모드 결정
2. **비파괴적 우선** - Mode 2는 기존 파일 수정 안 함
3. **사용자 확인** - 중요 변경은 반드시 확인
4. **300줄 제한** - 스킬 파일은 300줄 이내
5. **템플릿 우선** - 직접 작성보다 템플릿 활용
