---
name: database
description: |
  데이터베이스 개발 가이드. "스키마 추가", "테이블 생성", "쿼리 작성",
  "마이그레이션" 요청 시 활성화.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash

source:
  prd_sections:
    - "6. 데이터베이스 스키마"
  prd_version: "${PRD_VERSION}"
  last_synced: "${DATE}"
dependencies: []
---

# Database Development Guide

---

## 핵심 원칙

1. **타입 안전** - ORM 스키마로 타입 자동 생성
2. **마이그레이션** - 스키마 변경은 반드시 마이그레이션으로
3. **인덱스** - 자주 조회하는 컬럼에 인덱스
4. **관계 명시** - FK 관계 명확히 정의
5. **Soft Delete** - 중요 데이터는 soft delete 고려

---

## 스키마 정의 패턴

### Drizzle ORM 예시

```typescript
// lib/db/schema.ts
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  text,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. 테이블 정의
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const items = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 })
    .notNull()
    .default('ACTIVE'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. 관계 정의
export const usersRelations = relations(users, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  user: one(users, {
    fields: [items.userId],
    references: [users.id],
  }),
}));

// 3. 타입 추출
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
```

---

## 필수 체크리스트

### 스키마 작성 시 (모든 항목 확인)
- [ ] PK는 `uuid` 또는 `serial` 사용
- [ ] `createdAt`, `updatedAt` 필수 포함
- [ ] FK 관계 명시 (`references`)
- [ ] `onDelete` 동작 정의 (cascade/set null)
- [ ] relations 정의 (1:N, N:M)
- [ ] 타입 export (`$inferSelect`, `$inferInsert`)
- [ ] 자주 조회하는 컬럼에 인덱스

### 마이그레이션 시
- [ ] `npx drizzle-kit generate` 실행
- [ ] 생성된 SQL 검토 (위험한 변경 없는지)
- [ ] `npx drizzle-kit push` 또는 `migrate` 실행
- [ ] 롤백 방안 확인

---

## 쿼리 패턴

### 기본 CRUD

```typescript
import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// 조회 (단일)
const item = await db.query.items.findFirst({
  where: eq(items.id, id),
  with: { user: true }, // 관계 포함
});

// 조회 (목록)
const userItems = await db.query.items.findMany({
  where: and(
    eq(items.userId, userId),
    eq(items.status, 'ACTIVE')
  ),
  orderBy: desc(items.createdAt),
  limit: 10,
});

// 생성
const [newItem] = await db
  .insert(items)
  .values({
    userId,
    name: 'New Item',
  })
  .returning();

// 수정
const [updated] = await db
  .update(items)
  .set({ name: 'Updated Name', updatedAt: new Date() })
  .where(eq(items.id, id))
  .returning();

// 삭제
await db.delete(items).where(eq(items.id, id));
```

### 트랜잭션

```typescript
await db.transaction(async (tx) => {
  const [item] = await tx
    .insert(items)
    .values({ ... })
    .returning();

  await tx
    .insert(relatedTable)
    .values({ itemId: item.id, ... });
});
```

---

## 인덱스 전략

```typescript
// 자주 조회하는 패턴에 인덱스
export const items = pgTable('items', {
  // ...
}, (table) => ({
  userIdIdx: index('items_user_id_idx').on(table.userId),
  statusIdx: index('items_status_idx').on(table.status),
  userStatusIdx: index('items_user_status_idx')
    .on(table.userId, table.status),
}));
```

---

## 금지 사항

- Raw SQL 직접 실행 금지 (SQL Injection 위험)
- 스키마 직접 수정 금지 (마이그레이션 사용)
- `SELECT *` 사용 금지 (필요한 컬럼만)
- 인덱스 없는 대용량 조회 금지
- 트랜잭션 없는 다중 쓰기 금지

---

## 명령어

```bash
# 마이그레이션 생성
npx drizzle-kit generate

# 스키마 푸시 (개발용)
npx drizzle-kit push

# 마이그레이션 실행 (프로덕션)
npx drizzle-kit migrate

# DB GUI
npx drizzle-kit studio
```

---

## 참조

- PRD: `PRD.md` > 6. 데이터베이스 스키마
