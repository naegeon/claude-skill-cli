# 변경 동기화 시스템 가이드

> PRD ↔ Skills ↔ CLAUDE.md 간 일관성 유지

---

## 개요

```
PRD.md (Source of Truth)
    ↓ 변경 감지
manifest.json (매핑 정보)
    ↓ 영향 분석
Skills 업데이트
    ↓
CLAUDE.md 업데이트
    ↓
changelog.md 기록
```

---

## 1. manifest.json 구조

```json
{
  "project_name": "프로젝트명",
  "prd_version": "1.0",
  "last_updated": "2025-11-27",

  "skills": {
    "environment": {
      "source_sections": ["2. 기술 스택"],
      "last_synced": "2025-11-27",
      "checksum": "sha256..."
    },
    "backend": {
      "source_sections": ["3. 기능 명세", "5. 보안"],
      "dependencies": ["api-spec", "database"],
      "last_synced": "2025-11-27",
      "checksum": "sha256..."
    },
    "frontend": {
      "source_sections": ["3. 기능 명세 (UI)"],
      "dependencies": ["design-system"],
      "last_synced": "2025-11-27",
      "checksum": "sha256..."
    },
    "database": {
      "source_sections": ["6. 데이터베이스 스키마"],
      "last_synced": "2025-11-27",
      "checksum": "sha256..."
    },
    "api-spec": {
      "source_sections": ["7. API 명세"],
      "dependencies": ["backend"],
      "last_synced": "2025-11-27",
      "checksum": "sha256..."
    }
  },

  "section_mapping": {
    "2. 기술 스택": ["environment"],
    "3. 기능 명세": ["backend", "frontend"],
    "5. 보안 요구사항": ["backend"],
    "6. 데이터베이스 스키마": ["database"],
    "7. API 명세": ["api-spec", "backend"]
  }
}
```

---

## 2. 변경 감지 로직

### 트리거 조건

```
사용자 발화:
- "PRD 수정했어"
- "요구사항 변경"
- "기술 스택 바꿔야 해"
- "스키마 변경"
- "API 명세 업데이트"
```

### 감지 프로세스

```
1. PRD.md 현재 상태 읽기
2. 섹션별 checksum 계산
3. manifest.json의 checksum과 비교
4. 변경된 섹션 식별
5. section_mapping에서 영향받는 스킬 찾기
6. 의존성 그래프 따라 추가 영향 스킬 찾기
```

---

## 3. 영향 분석

### 직접 영향

```
PRD 섹션 "2. 기술 스택" 변경
    ↓
manifest.section_mapping["2. 기술 스택"]
    ↓
영향받는 스킬: ["environment"]
```

### 간접 영향 (의존성)

```
environment 스킬 변경
    ↓
어떤 스킬이 environment에 의존하는가?
    ↓
(없으면 종료, 있으면 해당 스킬도 검토 대상)
```

---

## 4. 업데이트 프로세스

### 사용자 확인 단계

```markdown
## PRD 변경 감지

다음 섹션이 변경되었습니다:
- 2. 기술 스택: Node.js 18 → 20

### 영향받는 스킬

| 스킬 | 변경 내용 |
|-----|----------|
| environment | Node.js 버전 업데이트 |

### 선택
1. [자동 업데이트] - 위 내용으로 스킬 업데이트
2. [검토 후 업데이트] - 변경 내용 확인 후 진행
3. [취소] - 변경 적용 안 함
```

### 업데이트 실행

```
1. 영향받는 스킬 파일 수정
2. 스킬 메타데이터 업데이트 (last_synced, checksum)
3. manifest.json 업데이트
4. CLAUDE.md 업데이트 (필요시)
5. changelog.md에 기록
```

---

## 5. changelog.md 형식

```markdown
# Changelog

모든 PRD 변경과 스킬 동기화 기록

---

## [2025-11-27] PRD v1.1

### 변경 사항
- **섹션 2**: Node.js 18 → 20 변경
- **섹션 3.2**: 새 API 엔드포인트 추가

### 영향받은 스킬
| 스킬 | 변경 내용 |
|-----|----------|
| environment | Node.js 버전 업데이트 |
| backend | 새 API 패턴 추가 |
| api-spec | 엔드포인트 명세 추가 |

### Git 커밋
```
commit abc123
docs: PRD v1.1 변경사항 스킬 동기화
```

### 롤백
```bash
git revert abc123
```

---

## [2025-11-20] PRD v1.0 (초기)

- 프로젝트 초기 설정
- 모든 스킬 생성
```

---

## 6. 롤백 프로세스

### Git 기반 롤백

```bash
# 특정 커밋으로 롤백
git revert <commit-hash>

# 또는 특정 파일만 복원
git checkout <commit-hash> -- .claude/skills/backend/SKILL.md
```

### 수동 롤백

```
1. changelog.md에서 이전 버전 확인
2. "PRD v1.0으로 롤백해줘" 요청
3. manifest.json에서 이전 상태 복원
4. 각 스킬 이전 버전으로 복원
```

---

## 7. 의존성 그래프

```
             ┌─────────────┐
             │ environment │
             └─────────────┘
                    │
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
┌────────┐   ┌──────────┐   ┌───────────┐
│database│   │ backend  │   │ frontend  │
└────────┘   └──────────┘   └───────────┘
    │               │               │
    │               ↓               ↓
    │        ┌──────────┐   ┌─────────────┐
    └───────→│ api-spec │   │design-system│
             └──────────┘   └─────────────┘
```

### 의존성 규칙

- `backend` → `api-spec`, `database`
- `frontend` → `design-system`
- `api-spec` → `backend`

---

## 8. 자동화 수준

### Level 1: 알림만
```
변경 감지 → 영향 분석 → 사용자에게 알림
```

### Level 2: 제안 (기본값)
```
변경 감지 → 영향 분석 → 구체적 변경안 제시 → 사용자 승인 → 적용
```

### Level 3: 완전 자동
```
변경 감지 → 영향 분석 → 자동 적용 → 결과 보고
```

---

## 9. 체크리스트

### 동기화 전
- [ ] PRD 변경 내용 정확히 파악
- [ ] 영향받는 스킬 목록 확인
- [ ] 의존성 체인 확인

### 동기화 후
- [ ] 모든 스킬 메타데이터 업데이트됨
- [ ] manifest.json 업데이트됨
- [ ] changelog.md 기록됨
- [ ] Git 커밋 완료됨

---

## 10. 주의사항

1. **PRD가 Source of Truth** - 스킬은 PRD에서 파생
2. **스킬 직접 수정 시** - 반드시 PRD도 업데이트
3. **충돌 발생 시** - PRD 기준으로 해결
4. **대규모 변경 시** - 단계별로 진행 권장
