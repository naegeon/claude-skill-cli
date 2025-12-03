---
name: code-review
description: |
  스킬 기반 코드 리뷰. 작성된 코드가 프로젝트 스킬 규칙을 준수하는지 검증.

  [리뷰 요청] "코드 리뷰해줘", "리뷰해줘", "체크해줘", "검토해줘"
  [커밋 전] "커밋 전에 확인해줘", "푸시해도 돼?"
  [특정 파일] "이 파일 리뷰해줘" + 파일명
allowed-tools: Read, Grep, Glob
---

# Code Review Guide (Skill-Based)

> 스킬 체크리스트 기반 코드 리뷰 시스템

---

## 핵심 원칙

1. **스킬 기준** - 프로젝트 스킬의 체크리스트가 리뷰 기준
2. **정량적 평가** - 준수율 % 로 객관적 평가
3. **액션 가능** - 문제점 + 해결 방법 함께 제시
4. **비파괴적** - 리뷰만 수행, 코드 수정 안 함

---

## 리뷰 트리거

```
"코드 리뷰해줘"
"리뷰해줘"
"체크해줘"
"검토해줘"
"커밋 전에 확인해줘"
"푸시해도 돼?"
"이 파일 리뷰해줘" + 파일명
```

---

## 리뷰 플로우

```
Step 1: 리뷰 범위 결정
    ↓
Step 2: 관련 스킬 로드
    ↓
Step 3: 체크리스트 검증
    ↓
Step 4: 리뷰 리포트 생성
    ↓
Step 5: 권장 액션 제시
```

---

## Step 1: 리뷰 범위 결정

### 전체 리뷰 (기본)

```
git diff로 변경된 파일 목록 추출

"📋 리뷰 대상

변경된 파일 (5개):
1. src/components/Button.tsx (수정)
2. src/components/Card.tsx (신규)
3. src/app/api/users/route.ts (수정)
4. src/lib/db.ts (수정)
5. package.json (수정)

이 파일들을 리뷰할까요?
[전체 리뷰] [선택 리뷰]"
```

### 특정 파일 리뷰

```
사용자: "Button.tsx 리뷰해줘"

→ 해당 파일만 리뷰 대상으로 설정
```

---

## Step 2: 관련 스킬 로드

```
파일 유형별 스킬 매핑:

| 파일 패턴 | 적용 스킬 |
|----------|----------|
| components/*.tsx | frontend |
| app/api/**/*.ts | backend, api-spec |
| lib/db.ts, schema.ts | database |
| *.config.* | environment |
| 전체 | 전역 금지 사항 (CLAUDE.md) |

"🔧 적용할 스킬

- frontend: Button.tsx, Card.tsx
- backend: route.ts
- database: db.ts
- 전역: 전체 파일

스킬 로드 중..."
```

---

## Step 3: 체크리스트 검증

### Frontend 스킬 체크

```typescript
// 검증 대상: src/components/Button.tsx

체크리스트:
- [ ] Props interface 정의
- [ ] Named export 사용 (default 금지)
- [ ] 200줄 이하
- [ ] 로딩/에러 상태 처리
- [ ] UI 라이브러리 컴포넌트 사용
- [ ] 테마 색상 토큰 사용 (하드코딩 금지)

검증 방법:
1. interface 키워드 존재 확인
2. export default 없음 확인
3. 라인 수 카운트
4. Skeleton, ErrorMessage 컴포넌트 사용 확인
5. shadcn/ui 컴포넌트 import 확인
6. text-gray-500 같은 하드코딩 검색
```

### Backend 스킬 체크

```typescript
// 검증 대상: src/app/api/users/route.ts

체크리스트:
- [ ] getServerSession() 인증 확인
- [ ] Zod 스키마 입력 검증
- [ ] try-catch 에러 처리
- [ ] 표준 응답 형식 사용
- [ ] 에러 로깅

검증 방법:
1. getServerSession 호출 존재 확인
2. z.object 스키마 정의 확인
3. try-catch 블록 존재 확인
4. NextResponse.json 형식 확인
5. console.error 또는 logger 사용 확인
```

### 전역 금지 사항 체크

```
모든 파일 대상:

금지 사항:
- [ ] any 타입 미사용
- [ ] 환경변수 하드코딩 없음
- [ ] console.log 없음 (개발용 제외)
- [ ] TODO 주석 확인 (의도적인지)

검증 방법:
1. ": any" 패턴 검색
2. 하드코딩된 URL, API 키 검색
3. console.log 검색
4. // TODO, // FIXME 검색
```

---

## Step 4: 리뷰 리포트 생성

```markdown
# 📊 코드 리뷰 리포트

리뷰 일시: 2025-11-30 14:30
리뷰 범위: 5개 파일

---

## 전체 요약

| 스킬 | 대상 파일 | 준수율 | 상태 |
|-----|----------|-------|------|
| frontend | 2개 | 83% | ⚠️ |
| backend | 1개 | 100% | ✅ |
| database | 1개 | 100% | ✅ |
| 전역 | 5개 | 60% | ❌ |

**종합 준수율: 78%**

---

## 상세 결과

### ✅ 통과 (backend)

**src/app/api/users/route.ts**
- [✅] getServerSession 인증
- [✅] Zod 스키마 검증
- [✅] try-catch 처리
- [✅] 표준 응답 형식
- [✅] 에러 로깅

### ⚠️ 부분 통과 (frontend)

**src/components/Button.tsx**
- [✅] Props interface 정의
- [✅] Named export
- [✅] 87줄 (200줄 이하)
- [❌] 로딩 상태 미처리
- [✅] shadcn/ui Button 사용
- [⚠️] text-gray-500 발견 (12번 라인)

**src/components/Card.tsx**
- [✅] Props interface 정의
- [✅] Named export
- [✅] 45줄
- [✅] UI 컴포넌트 사용
- [✅] 테마 토큰 사용

### ❌ 미통과 (전역)

**발견된 문제:**
1. `any` 타입 사용 (2건)
   - src/lib/db.ts:23 `data: any`
   - src/lib/db.ts:45 `result: any`

2. console.log 발견 (1건)
   - src/components/Button.tsx:15

3. TODO 주석 (1건)
   - src/app/api/users/route.ts:42 `// TODO: 페이지네이션`

---

## 커밋 권장 여부

**⚠️ 수정 후 커밋 권장**

필수 수정:
1. any 타입 → 명시적 타입 정의
2. console.log 제거

권장 수정:
1. Button.tsx 로딩 상태 추가
2. 하드코딩 색상 → 테마 토큰
```

---

## Step 5: 권장 액션 제시

```markdown
## 🔧 권장 액션

### 필수 (커밋 전 수정)

**1. any 타입 제거**
```typescript
// Before (db.ts:23)
const data: any = await query();

// After
interface UserData {
  id: string;
  name: string;
}
const data: UserData = await query();
```

**2. console.log 제거**
```typescript
// Button.tsx:15
console.log('clicked'); // ← 제거
```

### 권장 (다음 세션)

**3. 로딩 상태 추가**
```typescript
// Button.tsx
if (isLoading) {
  return <Skeleton className="h-10 w-24" />;
}
```

**4. 테마 토큰 사용**
```typescript
// Before
className="text-gray-500"

// After
className="text-muted-foreground"
```

---

수정하시겠습니까?
[자동 수정] [직접 수정] [무시하고 커밋]
```

---

## 자동 수정 옵션

```
[자동 수정] 선택 시:

"⚠️ 자동 수정 범위

수정 가능:
- console.log 제거 ✅
- 하드코딩 색상 → 토큰 ✅

수정 불가 (수동 필요):
- any 타입 → 타입 추론 필요
- 로딩 상태 → 로직 추가 필요

자동 수정을 진행할까요?
[진행] [취소]"
```

---

## 리뷰 설정

### 엄격도 레벨

```
[Strict] - 모든 체크리스트 100% 준수 필요
[Normal] - 필수 항목만 100%, 권장 80% (기본)
[Lenient] - 필수 항목만 체크
```

### 무시 설정

```
// .claude/review-ignore (선택적)
# 리뷰 제외 파일
*.test.ts
*.spec.ts
__mocks__/

# 무시할 규칙
ignore:any:lib/legacy/
ignore:console:scripts/
```

---

## 참조

- frontend 스킬: 컴포넌트 체크리스트
- backend 스킬: API 체크리스트
- database 스킬: 쿼리 체크리스트
- CLAUDE.md: 전역 금지 사항
- session-protocol: 세션 종료 시 자동 리뷰
