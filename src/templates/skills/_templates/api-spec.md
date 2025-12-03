---
name: api-spec
description: |
  API 명세 가이드. "API 문서", "엔드포인트 확인", "요청/응답 형식"
  관련 요청 시 활성화.
allowed-tools: Read, Grep, Glob

source:
  prd_sections:
    - "7. API 명세"
  prd_version: "${PRD_VERSION}"
  last_synced: "${DATE}"
dependencies:
  - backend
---

# API Specification Guide

---

## 핵심 원칙

1. **RESTful** - 리소스 중심 URL 설계
2. **일관성** - 모든 API 동일한 형식
3. **버전 관리** - 필요시 URL에 버전 포함
4. **문서화** - 모든 엔드포인트 명세 유지

---

## URL 설계 규칙

### 패턴

```
GET    /api/[resources]           # 목록 조회
GET    /api/[resources]/[id]      # 상세 조회
POST   /api/[resources]           # 생성
PUT    /api/[resources]/[id]      # 전체 수정
PATCH  /api/[resources]/[id]      # 부분 수정
DELETE /api/[resources]/[id]      # 삭제
```

### 네이밍

```
✅ 올바름
/api/users
/api/orders
/api/strategies

❌ 잘못됨
/api/getUsers      # 동사 사용
/api/user          # 단수형
/api/user-list     # 불필요한 접미사
```

---

## 요청 형식

### Headers

```
Content-Type: application/json
Authorization: Bearer <token>  # 또는 쿠키 기반
```

### Query Parameters (GET)

```typescript
// 페이지네이션
?page=1&limit=10

// 필터링
?status=ACTIVE&userId=xxx

// 정렬
?sort=createdAt&order=desc

// 검색
?q=keyword
```

### Request Body (POST/PUT/PATCH)

```typescript
{
  "field1": "value1",
  "field2": 123,
  "nested": {
    "key": "value"
  }
}
```

---

## 응답 형식

### 성공 응답

```typescript
// 단일 리소스
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "createdAt": "ISO8601"
  }
}

// 목록
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}

// 생성 (201)
{
  "success": true,
  "data": { ... }
}
```

### 에러 응답

```typescript
// 400 Bad Request
{
  "error": "Validation Error",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}

// 401 Unauthorized
{
  "error": "Unauthorized"
}

// 404 Not Found
{
  "error": "Resource not found"
}

// 500 Internal Server Error
{
  "error": "Internal Server Error"
}
```

---

## 상태 코드

| 코드 | 의미 | 사용 상황 |
|-----|------|----------|
| 200 | OK | 조회/수정 성공 |
| 201 | Created | 생성 성공 |
| 204 | No Content | 삭제 성공 |
| 400 | Bad Request | 입력 검증 실패 |
| 401 | Unauthorized | 인증 필요 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 409 | Conflict | 중복 등 충돌 |
| 422 | Unprocessable | 비즈니스 로직 실패 |
| 429 | Too Many Requests | Rate Limit |
| 500 | Server Error | 서버 오류 |

---

## 엔드포인트 명세 템플릿

### `[METHOD] /api/[resource]`

**설명**: 간단한 설명

**인증**: 필요/불필요

**요청**:
```typescript
// Headers
Authorization: Bearer <token>

// Query (GET) 또는 Body (POST/PUT)
{
  field: type  // 설명
}
```

**응답**:
```typescript
// 200 OK
{
  success: true,
  data: {
    // 응답 필드
  }
}
```

**에러**:
| 코드 | 상황 |
|-----|------|
| 400 | 입력 검증 실패 |
| 401 | 미인증 |

---

## API 목록

### 인증
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/auth/signup | 회원가입 |
| POST | /api/auth/signin | 로그인 |
| POST | /api/auth/signout | 로그아웃 |

### 리소스
| Method | Endpoint | 설명 |
|--------|----------|------|
${API_ENDPOINTS_TABLE}

---

## 금지 사항

- URL에 동사 사용 금지 (`/api/getUsers`)
- 일관되지 않은 응답 형식 금지
- 에러 시 200 반환 금지
- 민감 정보 응답에 포함 금지

---

## 참조

- backend 스킬: 구현 패턴
- PRD: `PRD.md` > 7. API 명세
