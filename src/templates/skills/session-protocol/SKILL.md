---
name: session-protocol
description: |
  세션 시작/종료 프로토콜. 작업 컨텍스트 로드 및 핸드오프 관리.

  [세션 시작] "작업 시작", "개발 시작", "이어서 작업", "뭐하고 있었지?"
  [세션 종료] "세션 마무리", "작업 끝", "오늘은 여기까지", "다음에 이어서"
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Session Protocol Guide

> 세션 간 컨텍스트 연속성 보장 및 스킬 준수 강제

---

## 핵심 원칙

1. **컨텍스트 우선** - 작업 전 반드시 현황 파악
2. **스킬 강제** - 스킬 미로드 상태에서 코드 작성 금지
3. **인계 필수** - 세션 종료 시 반드시 핸드오프 문서 작성
4. **추적 가능** - 모든 작업은 PRD 섹션과 연결

---

# 세션 시작 프로토콜

## 트리거

```
"작업 시작해줘"
"개발 시작"
"이어서 작업해줘"
"뭐하고 있었지?"
"어디까지 했지?"
```

## 실행 순서

```
Step 1: 프로젝트 현황 파악
    ↓
Step 2: 이전 세션 과제 확인
    ↓
Step 3: 오늘 작업 범위 확정
    ↓
Step 4: 필수 스킬 로드
    ↓
Step 5: 작업 시작
```

## Step 1: 프로젝트 현황 파악

```
읽을 파일:
1. PRD.md → 전체 요구사항, 현재 진행 상황
2. CLAUDE.md → 프로젝트 규칙, 스킬 인덱스

출력:
"📋 프로젝트 현황

프로젝트: [프로젝트명]
진행률: [완료 기능 / 전체 기능]

주요 기능 상태:
- ✅ 인증 시스템 (완료)
- 🔄 대시보드 (진행 중)
- ⬜ 결제 연동 (대기)
"
```

## Step 2: 이전 세션 과제 확인

```
읽을 파일:
.claude/sync/session-handoff.md

없으면:
"📝 이전 세션 기록이 없습니다. 새로 시작합니다."

있으면:
"📝 이전 세션 인계 사항

마지막 작업: 2025-11-30
완료된 작업:
- API 인증 엔드포인트 구현

미완료 작업:
- 대시보드 차트 컴포넌트 (70%)
  이유: 차트 라이브러리 선정 필요

다음 과제:
1. 차트 라이브러리 결정 (recharts vs chart.js)
2. DashboardChart 컴포넌트 완성
   → PRD 섹션: 3.2 대시보드
   → 필수 스킬: frontend

이 작업을 이어서 할까요?
[이어서] [다른 작업]"
```

## Step 3: 오늘 작업 범위 확정

```
사용자 선택에 따라:

[이어서] →
"오늘 작업 목표:
1. 차트 라이브러리 결정
2. DashboardChart 컴포넌트 완성

예상 범위:
- src/components/dashboard/DashboardChart.tsx
- src/lib/chart-config.ts

시작할까요?"

[다른 작업] →
"어떤 작업을 하고 싶으신가요?

PRD 기준 대기 중인 작업:
1. 결제 연동 (PRD 3.4)
2. 알림 시스템 (PRD 3.5)
3. 설정 페이지 (PRD 3.6)"
```

## Step 4: 필수 스킬 로드

```
작업 유형 분석 → 필수 스킬 결정

"🔧 필수 스킬 로드

작업: DashboardChart 컴포넌트
필수 스킬:
- frontend (컴포넌트 패턴)
- design-system (UI 규칙)

스킬을 로드합니다..."

→ 해당 스킬 파일 읽기
→ 체크리스트 표시

"✅ 스킬 로드 완료

frontend 체크리스트:
- [ ] Props interface 정의
- [ ] Named export 사용
- [ ] 200줄 이하 유지
- [ ] 로딩/에러 상태 처리

이 체크리스트를 준수하며 개발합니다.
작업을 시작합니다!"
```

---

# 세션 종료 프로토콜

## 트리거

```
"세션 마무리해줘"
"작업 끝"
"오늘은 여기까지"
"다음에 이어서 할게"
"저장하고 끝내줘"
```

## 실행 순서

```
Step 1: 작업 내용 정리
    ↓
Step 2: 스킬 준수 리뷰
    ↓
Step 3: 핸드오프 문서 생성
    ↓
Step 4: (선택) 커밋
```

## Step 1: 작업 내용 정리

```
git diff로 변경 사항 분석

"📊 오늘 작업 요약

수정된 파일 (5개):
- src/components/dashboard/DashboardChart.tsx (신규)
- src/components/dashboard/index.ts (수정)
- src/lib/chart-config.ts (신규)
- package.json (의존성 추가)
- pnpm-lock.yaml

추가된 기능:
- 차트 컴포넌트 기본 구조
- recharts 라이브러리 설정

미완료:
- 실시간 데이터 연동
- 반응형 처리"
```

## Step 2: 스킬 준수 리뷰

```
작성된 코드 vs 로드된 스킬 체크리스트 비교

"🔍 스킬 준수 리뷰

frontend 스킬 체크:
- [✅] Props interface 정의
- [✅] Named export 사용
- [✅] 200줄 이하 (현재 87줄)
- [⚠️] 로딩 상태 처리 (미구현)

발견된 이슈:
1. DashboardChart.tsx: 로딩 스켈레톤 없음
   → 다음 세션에서 추가 필요

전체 준수율: 75%"
```

## Step 3: 핸드오프 문서 생성

```
.claude/sync/session-handoff.md 생성/업데이트

"📝 핸드오프 문서 생성 완료

다음 세션 과제:
1. DashboardChart 로딩 상태 추가
2. 실시간 데이터 연동 (useSWR)
3. 반응형 breakpoint 처리

참조:
- PRD 섹션: 3.2 대시보드
- 필수 스킬: frontend, backend (API 연동 시)

저장 위치: .claude/sync/session-handoff.md"
```

## Step 4: 커밋 (선택)

```
"변경사항을 커밋할까요?

[커밋] [나중에]"

[커밋] 선택 시 → git-commit 스킬 활성화
```

---

# session-handoff.md 형식

```markdown
# Session Handoff

> 마지막 업데이트: YYYY-MM-DD HH:mm

---

## 완료된 작업

- [x] 작업 1 설명
- [x] 작업 2 설명

## 미완료 작업

- [ ] 작업 3 설명
  - 진행률: 70%
  - 중단 이유: [이유]
  - 재개 시 참고: [힌트]

## 다음 세션 과제

### 우선순위 1: [과제명]
- **PRD 섹션**: 3.2 대시보드
- **필수 스킬**: frontend, backend
- **예상 범위**:
  - src/components/dashboard/
  - src/app/api/dashboard/
- **시작점**: DashboardChart.tsx 87번 라인

### 우선순위 2: [과제명]
- **PRD 섹션**: 3.3 설정
- **필수 스킬**: frontend, database
- **예상 범위**: src/app/(dashboard)/settings/

---

## 참고 사항

- 차트 라이브러리로 recharts 선택됨
- API 응답 형식은 api-spec 스킬 참조
- 디자인은 Figma 링크 참조: [URL]

---

## 스킬 준수 현황

| 스킬 | 준수율 | 미준수 항목 |
|-----|-------|-----------|
| frontend | 75% | 로딩 상태 |
| backend | 100% | - |
```

---

## 자동화 트리거

| 사용자 표현 | 실행 |
|-----------|------|
| "작업 시작" | 세션 시작 프로토콜 |
| "이어서" | 세션 시작 프로토콜 |
| "끝내줘" | 세션 종료 프로토콜 |
| "마무리" | 세션 종료 프로토콜 |
| "뭐했지?" | 핸드오프 문서 읽기 |

---

## 필수 파일 경로

```
.claude/sync/
├── session-handoff.md    # 세션 인계 문서
├── manifest.json         # 스킬-PRD 매핑
└── changelog.md          # 변경 이력
```

---

## 금지 사항

- 세션 시작 프로토콜 건너뛰기 금지
- 스킬 미로드 상태에서 코드 작성 금지
- 세션 종료 시 핸드오프 문서 미작성 금지
- PRD 섹션 미연결 작업 금지

---

## 참조

- prd-generator 스킬: PRD/스킬 생성
- code-review 스킬: 스킬 준수 상세 리뷰
- git-commit 스킬: 커밋 가이드
