---
name: backend
description: |
  백엔드 개발 가이드. "API 만들어줘", "라우트 추가", "인증 구현",
  "에러 처리" 요청 시 활성화.
allowed-tools: Read, Grep, Glob, Edit, Write

source:
  prd_sections:
    - "3. 기능 명세"
    - "5. 보안 요구사항"
  prd_version: "${PRD_VERSION}"
  last_synced: "${DATE}"
dependencies:
  - api-spec
  - database
---

# Backend Development Guide

---

## 핵심 원칙

1. **인증 필수** - 모든 API에 세션/토큰 검증
2. **입력 검증** - Zod 스키마로 모든 입력 검증
3. **에러 처리** - try-catch + 표준 에러 응답
4. **타입 안전** - `any` 금지, 명시적 타입
5. **로깅** - 에러는 반드시 로깅

---

## API Route 패턴

### 표준 구조

```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// 1. 입력 스키마 정의
const createSchema = z.object({
  name: z.string().min(1),
  // ...
});

// 2. GET - 목록/상세 조회
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 데이터 조회
    const data = await db.query.table.findMany({
      where: eq(table.userId, session.user.id),
    });

    // 표준 응답
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('GET /api/resource error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// 3. POST - 생성
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 입력 검증
    const body = await request.json();
    const validated = createSchema.parse(body);

    // 생성
    const [created] = await db.insert(table).values({
      ...validated,
      userId: session.user.id,
    }).returning();

    return NextResponse.json({
      success: true,
      data: created,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('POST /api/resource error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

---

## 필수 체크리스트

### API 작성 시 (모든 항목 확인)
- [ ] `getServerSession()` 인증 확인
- [ ] Zod 스키마 입력 검증
- [ ] try-catch 에러 처리
- [ ] 표준 응답 형식 사용
- [ ] 에러 로깅 (console.error 또는 logger)
- [ ] 본인 데이터만 접근 (`userId` 검증)
- [ ] any 타입 사용 안 함

---

## 응답 형식

### 성공
```typescript
{
  success: true,
  data: T | T[],
  meta?: { total: number, page: number }
}
```

### 실패
```typescript
{
  error: string,
  details?: unknown
}
```

### HTTP 상태 코드
| 코드 | 용도 |
|-----|------|
| 200 | 조회/수정 성공 |
| 201 | 생성 성공 |
| 400 | 입력 검증 실패 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 500 | 서버 에러 |

---

## 에러 처리 패턴

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'AUTH_ERROR', 401);
  }
}
```

---

## 금지 사항

- `any` 타입 사용 금지
- `console.log` 대신 구조화된 로거 사용
- 하드코딩된 시크릿 금지
- try-catch 없는 async 함수 금지
- 인증 없는 API 금지 (public 제외)

---

## 참조

- api-spec 스킬: 엔드포인트 명세
- database 스킬: 쿼리 패턴
- PRD: `PRD.md` > 3. 기능 명세
