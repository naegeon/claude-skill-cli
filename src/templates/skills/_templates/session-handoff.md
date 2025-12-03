# Session Handoff Template

> 세션 간 작업 인계 문서 템플릿

---

## 사용법

이 템플릿은 session-protocol 스킬에서 자동으로 사용됩니다.
세션 종료 시 `.claude/sync/session-handoff.md`에 생성됩니다.

---

## 템플릿 시작

```markdown
# Session Handoff

> 마지막 업데이트: ${DATE} ${TIME}
> 작업자: ${USER_OR_AI}

---

## 프로젝트 상태

| 항목 | 상태 |
|-----|------|
| PRD 버전 | ${PRD_VERSION} |
| 전체 진행률 | ${PROGRESS_PERCENT}% |
| 현재 단계 | ${CURRENT_PHASE} |

---

## 이번 세션 요약

### 완료된 작업

- [x] ${COMPLETED_TASK_1}
- [x] ${COMPLETED_TASK_2}

### 미완료 작업

- [ ] ${INCOMPLETE_TASK_1}
  - 진행률: ${PROGRESS}%
  - 중단 이유: ${REASON}
  - 재개 시 참고: ${HINT}

### 변경된 파일

| 파일 | 변경 유형 | 설명 |
|-----|----------|------|
| ${FILE_PATH_1} | 신규/수정/삭제 | ${DESCRIPTION} |
| ${FILE_PATH_2} | 신규/수정/삭제 | ${DESCRIPTION} |

---

## 다음 세션 과제

### 우선순위 1 (필수)

**과제명**: ${NEXT_TASK_1}

| 항목 | 내용 |
|-----|------|
| PRD 섹션 | ${PRD_SECTION} |
| 필수 스킬 | ${REQUIRED_SKILLS} |
| 예상 범위 | ${EXPECTED_FILES} |
| 시작점 | ${STARTING_POINT} |
| 예상 작업량 | ${ESTIMATED_EFFORT} |

**상세 설명**:
${TASK_DESCRIPTION}

### 우선순위 2 (권장)

**과제명**: ${NEXT_TASK_2}

| 항목 | 내용 |
|-----|------|
| PRD 섹션 | ${PRD_SECTION} |
| 필수 스킬 | ${REQUIRED_SKILLS} |

### 우선순위 3 (선택)

- ${OPTIONAL_TASK_1}
- ${OPTIONAL_TASK_2}

---

## ⚠️ Hotfix 항목 (우선 처리 필요)

| 파일:라인 | 유형 | 설명 | 우선순위 |
|----------|-----|------|---------|
| ${FILE_PATH}:${LINE} | any 타입 | ${REASON} | 높음/중간/낮음 |
| ${FILE_PATH}:${LINE} | ts-ignore | ${REASON} | 높음/중간/낮음 |

> 다음 세션 시작 시 Hook이 자동 감지하여 처리 요청

---

## 빌드 상태

| 체크 | 상태 | 비고 |
|-----|------|-----|
| 린트 | ✅/❌ | ${LINT_NOTE} |
| 타입 체크 | ✅/❌ | ${TYPE_NOTE} |
| 빌드 | ✅/❌ | ${BUILD_NOTE} |
| 테스트 | ✅/❌/⏭️ | ${TEST_NOTE} |

---

## 스킬 준수 현황

| 스킬 | 준수율 | 미준수 항목 | 다음 액션 |
|-----|-------|-----------|----------|
| frontend | ${PERCENT}% | ${ISSUES} | ${ACTION} |
| backend | ${PERCENT}% | ${ISSUES} | ${ACTION} |
| database | ${PERCENT}% | ${ISSUES} | ${ACTION} |

---

## 참고 사항

### 결정된 사항
- ${DECISION_1}
- ${DECISION_2}

### 보류된 사항
- ${PENDING_1}: ${REASON}

### 외부 의존성
- ${DEPENDENCY_1}: ${STATUS}

### 주의 사항
- ${WARNING_1}

---

## 디버깅 정보 (문제 발생 시)

### 마지막 에러
```
${LAST_ERROR}
```

### 시도한 해결책
1. ${SOLUTION_TRIED_1}
2. ${SOLUTION_TRIED_2}

### 의심되는 원인
- ${SUSPECTED_CAUSE}

---

## 관련 링크

| 리소스 | URL |
|-------|-----|
| PRD | `PRD.md` |
| 스킬 | `.claude/skills/` |
| 디자인 | ${FIGMA_URL} |
| API 문서 | ${API_DOC_URL} |

---

## 다음 세션 시작 체크리스트

세션 시작 시 자동 확인:
- [ ] 이 문서 읽기 완료
- [ ] PRD 관련 섹션 확인
- [ ] 필수 스킬 로드
- [ ] 시작점 파일 열기
```

---

## 생성 규칙

1. **필수 섹션**
   - 완료된 작업
   - 미완료 작업 (이유 포함)
   - 다음 세션 과제 (PRD 섹션 + 스킬 명시)

2. **선택 섹션**
   - 스킬 준수 현황 (리뷰 수행 시)
   - 디버깅 정보 (에러 발생 시)
   - 참고 사항 (결정/보류 사항 있을 시)

3. **자동 채움 항목**
   - 날짜/시간
   - 변경된 파일 목록 (git diff)
   - PRD 버전 (manifest.json)

4. **사용자 입력 필요**
   - 중단 이유
   - 다음 과제 우선순위
   - 주의 사항

---

## 예시

```markdown
# Session Handoff

> 마지막 업데이트: 2025-11-30 18:30
> 작업자: Claude + User

---

## 프로젝트 상태

| 항목 | 상태 |
|-----|------|
| PRD 버전 | 1.2 |
| 전체 진행률 | 45% |
| 현재 단계 | MVP 개발 |

---

## 이번 세션 요약

### 완료된 작업

- [x] 사용자 인증 API 구현 (로그인, 회원가입)
- [x] JWT 토큰 발급/검증 로직
- [x] 인증 미들웨어 적용

### 미완료 작업

- [ ] 비밀번호 재설정 기능
  - 진행률: 30%
  - 중단 이유: 이메일 서비스 연동 필요
  - 재개 시 참고: nodemailer 설정 먼저 필요

### 변경된 파일

| 파일 | 변경 유형 | 설명 |
|-----|----------|------|
| src/app/api/auth/login/route.ts | 신규 | 로그인 API |
| src/app/api/auth/register/route.ts | 신규 | 회원가입 API |
| src/lib/auth.ts | 신규 | JWT 유틸리티 |
| src/middleware.ts | 수정 | 인증 미들웨어 추가 |

---

## 다음 세션 과제

### 우선순위 1 (필수)

**과제명**: 이메일 서비스 연동 및 비밀번호 재설정

| 항목 | 내용 |
|-----|------|
| PRD 섹션 | 3.1.3 비밀번호 관리 |
| 필수 스킬 | backend, environment |
| 예상 범위 | src/lib/email.ts, src/app/api/auth/reset/ |
| 시작점 | nodemailer 설치 및 설정 |
| 예상 작업량 | 2-3시간 |

**상세 설명**:
1. nodemailer 설치 및 SMTP 설정
2. 이메일 템플릿 생성
3. 토큰 기반 재설정 링크 생성
4. 재설정 API 구현

### 우선순위 2 (권장)

**과제명**: 사용자 프로필 API

| 항목 | 내용 |
|-----|------|
| PRD 섹션 | 3.2 사용자 관리 |
| 필수 스킬 | backend, database |

---

## 스킬 준수 현황

| 스킬 | 준수율 | 미준수 항목 | 다음 액션 |
|-----|-------|-----------|----------|
| backend | 100% | - | - |
| database | 90% | 인덱스 미설정 | users 테이블 인덱스 추가 |

---

## 참고 사항

### 결정된 사항
- JWT 만료 시간: 7일
- 리프레시 토큰: 30일

### 보류된 사항
- 소셜 로그인: OAuth 키 발급 대기 중

---

## 다음 세션 시작 체크리스트

- [ ] 이 문서 읽기 완료
- [ ] PRD 3.1.3 확인
- [ ] backend, environment 스킬 로드
- [ ] nodemailer 문서 확인
```
