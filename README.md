# Claude Skill CLI

> PRD 기반 AI 개발 워크플로우 프레임워크
> Hook을 통한 스킬 자동 강제 적용

---

## 설치 및 사용

```bash
# 기존 프로젝트에서 바로 실행
npx claude-skill init

# 또는 전역 설치
npm install -g claude-skill
claude-skill init
```

---

## 명령어

### `init` - 프레임워크 초기화

```bash
npx claude-skill init

# 옵션
--type <type>     # new | existing | hooks-only (기본: existing)
--skills <list>   # 설치할 스킬 (기본: backend,frontend,database)
--yes             # 모든 프롬프트에 yes
```

### `add` - 스킬 추가

```bash
# 템플릿 기반 스킬 추가
npx claude-skill add frontend

# 동적 스킬 생성 (템플릿 없이)
npx claude-skill add ai --dynamic
```

### `analyze` - 프로젝트 분석

```bash
npx claude-skill analyze

# JSON 출력
npx claude-skill analyze --output analysis.json
```

### `list` - 스킬 목록

```bash
npx claude-skill list
```

---

## 사용 흐름

### 1. 새 프로젝트

```bash
npx claude-skill init --type new

# Claude Code에서
"PRD 만들어줘"
```

### 2. 기존 프로젝트

```bash
npx claude-skill init --type existing

# Claude Code에서
"프로젝트 분석해줘"
```

### 3. Hook만 추가

```bash
npx claude-skill init --type hooks-only
```

---

## 생성되는 구조

```
your-project/
├── .claude/
│   ├── settings.json       # Hook 설정
│   ├── hooks/
│   │   ├── session-start.sh
│   │   ├── skill-enforcer.py
│   │   ├── pre-commit-check.py
│   │   └── post-write.sh
│   ├── skills/
│   │   ├── _templates/
│   │   ├── prd-generator/
│   │   ├── session-protocol/
│   │   └── code-review/
│   └── sync/
│       └── session-handoff.md
```

---

## 스킬 목록

| 스킬 | 설명 |
|-----|------|
| backend | API 개발 (인증, 에러처리, Zod 검증) |
| frontend | UI 개발 (컴포넌트, 상태관리, 접근성) |
| database | DB 개발 (ORM, 마이그레이션, 쿼리) |
| design-system | 디자인 시스템 |
| api-spec | API 명세 |
| environment | 환경 설정 |

**동적 스킬**: 템플릿 없이도 코드 분석으로 생성 가능

```bash
npx claude-skill add payment --dynamic
```

---

## 프레임워크 지원

이 도구는 특정 프레임워크에 종속되지 않습니다:

- **Frontend**: Next.js, Nuxt, SvelteKit, Remix, Astro...
- **Backend**: Express, Fastify, NestJS, FastAPI, Django...
- **Database**: PostgreSQL, MySQL, MongoDB, SQLite...
- **ORM**: Drizzle, Prisma, TypeORM, Mongoose...
- **CSS**: Tailwind, CSS Modules, Styled-components, Sass...

PRD 생성 시 선택한 스택에 맞게 스킬이 커스터마이징됩니다.

---

## 핵심 가치

- **70% → 30%** 사용자 개입 감소 (실제 테스트 결과)
- **자동 강제** Hook으로 스킬 준수 강제
- **동적 로드** 필요한 스킬만 선택적 로드

---

## 관련 저장소

- [claude-skills](https://github.com/naegeon/claude-skills) - 템플릿 저장소 (클론 방식)

---

## 라이선스

MIT
