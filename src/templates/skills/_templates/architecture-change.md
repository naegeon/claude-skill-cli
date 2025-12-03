# Architecture Change Protocol

> **대규모 변경 시 적용되는 프로토콜**
> 스키마 변경, 아키텍처 수정, 대규모 기능 추가

---

## 트리거

다음 상황에서 이 프로토콜 활성화:
- "스키마 변경", "DB 구조 수정"
- "아키텍처 변경", "구조 리팩토링"
- "대규모 기능 추가" (결제, 채팅, 리워드 등)
- "외부 서비스 연동"

---

## Phase 1: 영향 분석

### 1.1 변경 범위 파악
```
"[변경 내용]이 영향을 미치는 파일을 분석합니다."

영향받는 영역:
- [ ] DB 스키마
- [ ] API 엔드포인트
- [ ] 프론트엔드 컴포넌트
- [ ] 타입 정의
- [ ] 테스트
```

### 1.2 의존성 그래프
```
변경 대상: payments 테이블 추가

영향받는 파일:
├── db/schema.ts (직접 변경)
├── app/api/payments/route.ts (새로 생성)
├── components/payment/PaymentForm.tsx (새로 생성)
├── types/payment.ts (새로 생성)
└── lib/actions/payment.ts (새로 생성)

기존 파일 수정:
├── app/(dashboard)/layout.tsx (네비게이션 추가)
└── lib/db/index.ts (export 추가)
```

---

## Phase 2: 마이그레이션 계획

### 2.1 단계별 순서 (의존성 순)
```
Step 1: 타입 정의
  └── types/payment.ts

Step 2: DB 스키마
  └── db/schema.ts
  └── 마이그레이션 생성: npx drizzle-kit generate

Step 3: 마이그레이션 실행
  └── npx drizzle-kit migrate

Step 4: API 엔드포인트
  └── app/api/payments/route.ts

Step 5: 프론트엔드
  └── components/payment/
  └── app/(dashboard)/payments/
```

### 2.2 롤백 계획
```
문제 발생 시:
1. Git revert로 코드 롤백
2. DB 마이그레이션 롤백: npx drizzle-kit drop
3. 이전 상태 복원 확인
```

---

## Phase 3: PRD 업데이트

### 대규모 기능 추가 시
```markdown
# PRD.md에 새 섹션 추가

## 3.X [새 기능명]

### 3.X.1 기능 개요
- 목적:
- 사용자 스토리:

### 3.X.2 세부 과제
- [ ] 과제 1
  - **skills**: backend, database
  - **files**: app/api/..., db/schema.ts

- [ ] 과제 2
  - **skills**: frontend
  - **files**: components/...
```

### 기존 섹션 수정 시
```markdown
## 변경 이력 기록

<!-- 3.2 결제 시스템 - 2024-01-15 수정 -->
<!-- 변경: PG사 토스 → 포트원으로 변경 -->
```

---

## Phase 4: 스킬 업데이트

### 새 스킬 필요 여부 판단
```
Q: 이 기능이 반복적으로 사용되는가?
Q: 별도의 패턴/규칙이 필요한가?
Q: 기존 스킬로 커버 가능한가?

→ Yes: 새 스킬 생성 (예: payment/ 스킬)
→ No: 기존 스킬에 섹션 추가
```

### 기존 스킬 업데이트
```
영향받는 스킬:
- backend: 결제 API 패턴 추가
- database: payments 테이블 스키마 추가
- frontend: 결제 폼 컴포넌트 패턴 추가
```

---

## Phase 5: 실행

### 작업 순서
```
1. 브랜치 생성: git checkout -b feature/[기능명]
2. Phase 2 순서대로 구현
3. 각 Step 완료 후 빌드 확인
4. 테스트 작성 (있으면)
5. PR 생성 또는 머지
```

### 체크포인트
```
각 Step 완료 후:
- [ ] 빌드 성공 (npm run build)
- [ ] 기존 기능 동작 확인
- [ ] 새 기능 기본 동작 확인
```

---

## 대규모 기능 예시

### 결제 모듈 추가
```
필요한 스킬: backend, frontend, database
예상 파일:
├── db/schema.ts (payments, transactions 테이블)
├── app/api/payments/
│   ├── route.ts (결제 요청)
│   ├── callback/route.ts (PG 콜백)
│   └── history/route.ts (내역 조회)
├── components/payment/
│   ├── PaymentForm.tsx
│   ├── PaymentHistory.tsx
│   └── PaymentStatus.tsx
└── lib/payment/
    ├── portone.ts (PG 연동)
    └── types.ts
```

### 채팅 기능 추가
```
필요한 스킬: backend, frontend, database, (새) realtime
예상 파일:
├── db/schema.ts (chatRooms, messages 테이블)
├── app/api/chat/
├── components/chat/
└── lib/realtime/ (WebSocket 또는 Pusher)
```

---

## 주의사항

1. **작은 단위로 커밋** - 롤백 용이
2. **빌드 확인 필수** - 각 Step 후
3. **기존 기능 보호** - 회귀 테스트
4. **문서화** - PRD, 스킬 업데이트
