---
name: environment
description: |
  개발 환경 설정 가이드. "환경 설정", "의존성 설치", "환경변수",
  "프로젝트 설정" 요청 시 활성화.
allowed-tools: Read, Bash, Write, Edit

source:
  prd_sections:
    - "2. 기술 스택"
  prd_version: "${PRD_VERSION}"
  last_synced: "${DATE}"
dependencies: []
---

# Environment Setup Guide

---

## 기술 스택

| 영역 | 기술 | 버전 |
|-----|------|-----|
${TECH_STACK_TABLE}

---

## 필수 체크리스트

### 초기 설정
- [ ] Node.js 버전 확인 (${NODE_VERSION})
- [ ] 패키지 매니저 확인 (npm/pnpm/yarn)
- [ ] 의존성 설치 (`npm install`)
- [ ] 환경변수 파일 생성 (`.env.local`)

### 환경변수
```bash
# 필수 환경변수
${REQUIRED_ENV_VARS}

# 선택 환경변수
${OPTIONAL_ENV_VARS}
```

### 데이터베이스
- [ ] DB 연결 확인
- [ ] 마이그레이션 실행
- [ ] 시드 데이터 (필요시)

---

## 주요 명령어

```bash
# 개발 서버
${DEV_COMMAND}

# 빌드
${BUILD_COMMAND}

# 린트
${LINT_COMMAND}

# 테스트
${TEST_COMMAND}
```

---

## 디렉토리 구조

```
${PROJECT_STRUCTURE}
```

---

## 금지 사항

- [ ] 환경변수를 코드에 하드코딩 금지
- [ ] `.env` 파일을 Git에 커밋 금지
- [ ] 프로덕션 DB를 로컬에서 직접 접근 금지

---

## 트러블슈팅

### 일반적인 이슈

| 증상 | 원인 | 해결 |
|-----|------|------|
| 모듈 찾을 수 없음 | 의존성 미설치 | `npm install` |
| 환경변수 오류 | `.env.local` 누락 | 파일 생성 및 값 설정 |
| DB 연결 실패 | URL 오류 | `DATABASE_URL` 확인 |

---

## 참조

- PRD: `PRD.md` > 2. 기술 스택
