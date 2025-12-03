# Project Bootstrap & Sync System Architecture

> **버전**: 1.0
> **목적**: PRD 기반 스킬즈 자동 생성 및 일관된 개발 환경 구축

---

## 1. 시스템 개요

### 1.1 핵심 원칙

```
PRD (Source of Truth)
    ↓
자동 분석 & 분류
    ↓
도메인별 스킬즈 생성
    ↓
CLAUDE.md (인덱스) 생성
    ↓
일관된 개발 환경 완성
```

### 1.2 파일 크기 제한

| 파일 유형 | 최대 줄 수 | 이유 |
|----------|-----------|------|
| CLAUDE.md | 150줄 | 빠른 컨텍스트 파악 |
| 각 스킬 파일 | 300줄 | 집중도 유지 |
| PRD.md | 제한 없음 | Source of Truth |

---

## 2. 디렉토리 구조

```
project/
├── PRD.md                          # 진실의 원천
├── CLAUDE.md                       # 개요 + 스킬 인덱스 (150줄)
│
└── .claude/
    ├── skills/
    │   ├── _templates/             # 스킬 생성용 템플릿
    │   │   ├── base.md
    │   │   ├── environment.md
    │   │   ├── backend.md
    │   │   ├── frontend.md
    │   │   ├── database.md
    │   │   └── api-spec.md
    │   │
    │   ├── environment/            # 생성된 스킬들
    │   │   └── SKILL.md
    │   ├── backend/
    │   │   └── SKILL.md
    │   ├── frontend/
    │   │   └── SKILL.md
    │   ├── database/
    │   │   └── SKILL.md
    │   ├── api-spec/
    │   │   └── SKILL.md
    │   └── [domain-specific]/      # 프로젝트 특화 스킬
    │       └── SKILL.md
    │
    └── sync/                       # 변경 관리
        ├── manifest.json           # 스킬-PRD 매핑
        └── changelog.md            # 변경 이력
```

---

## 3. PRD → 스킬 매핑 규칙

### 3.1 자동 분류 기준

| PRD 섹션/키워드 | 생성되는 스킬 |
|----------------|--------------|
| 기술 스택, 환경 설정, 의존성 | `environment/` |
| API, 라우트, 엔드포인트, 인증 | `backend/` |
| UI, 컴포넌트, 페이지, 스타일링 | `frontend/` |
| DB, 스키마, 테이블, 쿼리 | `database/` |
| API 명세, 요청/응답, 타입 | `api-spec/` |
| 테스트, 커버리지 | `testing/` |
| 배포, CI/CD, 환경변수 | `deployment/` |

### 3.2 프로젝트 특화 스킬 감지

PRD에서 다음 패턴 감지 시 도메인 스킬 생성:
- 반복되는 도메인 용어 (예: "전략", "주문", "트레이딩")
- 복잡한 비즈니스 로직 섹션
- 외부 API 연동 명세

---

## 4. 스킬 파일 표준 형식

### 4.1 메타데이터 (Frontmatter)

```yaml
---
name: skill-name
description: |
  스킬 설명. 활성화 조건.
  "키워드1", "키워드2" 요청 시 사용.
allowed-tools: Read, Grep, Glob, Edit, Write

# 추적 메타데이터 (자동 생성)
source:
  prd_sections:
    - "섹션 번호: 섹션 제목"
  prd_version: "1.0"
  last_synced: "YYYY-MM-DD"
dependencies:
  - other-skill-name
---
```

### 4.2 본문 구조 (300줄 이내)

```markdown
# [Skill Name] Development Guide

## 핵심 원칙 (5개 이내)
- 원칙 1
- 원칙 2

## 필수 체크리스트
- [ ] 항목 1
- [ ] 항목 2

## 코드 패턴/템플릿
[구체적인 코드 예시]

## 금지 사항
- 금지 1
- 금지 2

## 참조
- 관련 스킬: [skill-name]
- PRD 섹션: [섹션 번호]
```

---

## 5. CLAUDE.md 표준 형식 (150줄 이내)

```markdown
# [프로젝트명]

> 한 문장 설명

## 핵심 원칙 (5개 이내)
1. 원칙

## 기술 스택
| 영역 | 기술 | 버전 |
|-----|------|-----|

## 스킬 가이드
| 작업 유형 | 활성화 스킬 | 설명 |
|----------|------------|------|
| 환경 설정 | environment | 의존성, 환경변수 |
| API 개발 | backend, api-spec | 라우트, 인증 |
| UI 개발 | frontend | 컴포넌트, 스타일링 |
| DB 작업 | database | 스키마, 쿼리 |

## 빠른 참조
- PRD: `PRD.md`
- 컨벤션: 각 스킬 참조

## 금지 사항 (전역)
- 금지 1
- 금지 2
```

---

## 6. 변경 동기화 시스템

### 6.1 manifest.json 구조

```json
{
  "prd_version": "1.0",
  "last_updated": "2025-11-27",
  "skills": {
    "environment": {
      "source_sections": ["2. 기술 스택"],
      "last_synced": "2025-11-27",
      "checksum": "abc123"
    },
    "backend": {
      "source_sections": ["3.1 인증", "3.2 API"],
      "dependencies": ["api-spec", "database"],
      "last_synced": "2025-11-27",
      "checksum": "def456"
    }
  }
}
```

### 6.2 변경 감지 플로우

```
1. PRD 변경 감지 (checksum 비교)
2. 영향받는 섹션 식별
3. manifest.json에서 해당 섹션과 연결된 스킬 찾기
4. 영향받는 스킬 목록 + 변경 내용 제시
5. 사용자 확인 후 스킬 업데이트
6. manifest.json, changelog.md 업데이트
7. Git 커밋 (롤백 가능)
```

### 6.3 changelog.md 형식

```markdown
# Changelog

## [2025-11-27] PRD v1.1 → v1.2

### 변경 사항
- 인증 방식: JWT → Session

### 영향받은 스킬
- `backend/SKILL.md`: 인증 섹션 수정
- `api-spec/SKILL.md`: Authorization 헤더 제거

### 롤백
```bash
git revert <commit-hash>
```
```

---

## 7. 사용자 인터랙션 플로우

### 7.1 신규 프로젝트 생성

```
사용자: "새 프로젝트 시작해줘" 또는 "PRD 만들어줘"

AI: PRD Generator 활성화

Phase 1: 요구사항 수집
├── 프로젝트 목표
├── 기술 제약 (예산, 기존 스택)
├── 핵심 기능 목록
└── 비기능 요구사항

Phase 2: 기술 스택 검증
├── 웹 검색으로 호환성 확인
└── 사용자 확인

Phase 3: PRD 생성
└── PRD.md 작성

Phase 4: 스킬 분류 & 생성
├── PRD 분석
├── 필요한 스킬 식별
├── 각 스킬 파일 생성
└── manifest.json 생성

Phase 5: CLAUDE.md 생성
└── 인덱스 형태로 작성

결과: 개발 준비 완료된 프로젝트 구조
```

### 7.2 PRD 변경 시

```
사용자: "PRD의 인증 방식을 변경했어"

AI: 변경 감지 & 분석

1. PRD diff 분석
2. 영향받는 스킬 식별
3. 변경 제안 표시:
   "다음 스킬이 영향받습니다:
    - backend: 인증 패턴 수정 필요
    - api-spec: 헤더 명세 수정 필요

    [자동 업데이트] [검토 후 업데이트] [취소]"
4. 사용자 선택에 따라 처리
5. changelog 기록
```

---

## 8. 품질 보장

### 8.1 스킬 생성 체크리스트

```markdown
- [ ] 메타데이터 완전성 (source, dependencies)
- [ ] 300줄 이하
- [ ] 필수 체크리스트 포함
- [ ] 코드 예시 포함
- [ ] 금지 사항 명시
- [ ] PRD 섹션 참조 정확
```

### 8.2 CLAUDE.md 체크리스트

```markdown
- [ ] 150줄 이하
- [ ] 스킬 인덱스 테이블 포함
- [ ] 기술 스택 테이블 포함
- [ ] 전역 금지 사항 명시
- [ ] PRD 링크 포함
```

---

## 9. 확장 가능성

### 9.1 커스텀 스킬 템플릿

프로젝트 특성에 따라 추가 가능:
- `trading/` - 트레이딩 시스템
- `ecommerce/` - 이커머스
- `auth/` - 복잡한 인증 시스템
- `realtime/` - 실시간 기능

### 9.2 팀 공유

```
.claude/skills/_templates/
```
템플릿을 팀 내 공유하여 일관된 스킬 생성

---

## 10. 다음 단계

1. 각 스킬 템플릿 상세 설계
2. PRD Generator 스킬 재작성
3. 변경 동기화 로직 구현
4. 실제 프로젝트에서 테스트
