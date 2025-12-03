---
name: frontend
description: |
  프론트엔드 개발 가이드. "컴포넌트 만들어줘", "페이지 추가",
  "UI 수정", "스타일링" 요청 시 활성화.
allowed-tools: Read, Grep, Glob, Edit, Write

source:
  prd_sections:
    - "3. 기능 명세 (UI)"
  prd_version: "${PRD_VERSION}"
  last_synced: "${DATE}"
dependencies:
  - design-system
---

# Frontend Development Guide

---

## 핵심 원칙

1. **컴포넌트 우선** - UI 라이브러리 컴포넌트 사용
2. **타입 안전** - 모든 Props에 interface 정의
3. **200줄 제한** - 파일이 길면 분리
4. **DRY** - 중복 코드는 추출
5. **접근성** - 시맨틱 HTML, ARIA 속성

---

## 컴포넌트 구조

### 표준 패턴

```typescript
// components/[domain]/ComponentName.tsx

interface ComponentNameProps {
  // 필수 props
  data: DataType;

  // 선택 props
  className?: string;
  variant?: 'default' | 'compact';

  // 콜백
  onAction?: () => void;
}

export function ComponentName({
  data,
  className,
  variant = 'default',
  onAction,
}: ComponentNameProps) {
  // 1. useState
  const [loading, setLoading] = useState(false);

  // 2. useRef
  const ref = useRef<HTMLDivElement>(null);

  // 3. Custom hooks
  const { mutate } = useSWR();

  // 4. useEffect
  useEffect(() => {
    // ...
  }, []);

  // 5. Event handlers (handle 접두사)
  const handleClick = () => {
    onAction?.();
  };

  // 6. Early returns
  if (loading) return <Skeleton />;

  // 7. Render
  return (
    <div className={cn('base-styles', className)}>
      {/* JSX */}
    </div>
  );
}
```

---

## 필수 체크리스트

### 컴포넌트 작성 시 (모든 항목 확인)
- [ ] Props interface 정의
- [ ] Named export 사용 (default 금지, 페이지 제외)
- [ ] 200줄 이하 유지
- [ ] 로딩 상태 처리 (Skeleton 등)
- [ ] 에러 상태 처리
- [ ] 테마 색상 토큰 사용 (하드코딩 금지)
- [ ] any 타입 사용 안 함
- [ ] 사이트명/설정값 하드코딩 안 함 → config 사용

---

## 페이지 구조

```typescript
// app/(dashboard)/[page]/page.tsx

export default function PageName() {
  return (
    <PageContainer>
      <PageHeader
        title="페이지 제목"
        description="설명"
        actions={<Button>액션</Button>}
      />

      <ContentCard title="섹션 제목">
        {/* 콘텐츠 */}
      </ContentCard>
    </PageContainer>
  );
}
```

---

## 데이터 페칭 패턴

### Server Component (권장)

```typescript
// app/(dashboard)/items/page.tsx
async function getItems() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return db.query.items.findMany({
    where: eq(items.userId, session.user.id),
  });
}

export default async function ItemsPage() {
  const items = await getItems();
  return <ItemList items={items} />;
}
```

### Client Component (상호작용 필요시)

```typescript
'use client';

import useSWR from 'swr';

export function ItemList() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/items',
    fetcher
  );

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage />;

  return (
    <div>
      {data.map(item => (
        <ItemCard key={item.id} item={item} onMutate={mutate} />
      ))}
    </div>
  );
}
```

---

## Form 패턴

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form, FormField, FormItem,
  FormLabel, FormControl, FormMessage,
} from '@/components/ui/form';

const schema = z.object({
  name: z.string().min(1, '필수 입력'),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (data: FormData) => {
    // API 호출
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">저장</Button>
      </form>
    </Form>
  );
}
```

---

## 금지 사항

- `any` 타입 사용 금지
- Raw HTML (`<div>`, `<button>`) 대신 UI 컴포넌트 사용
- 하드코딩 색상 금지 (`text-gray-500` → `text-muted-foreground`)
- `default export` 금지 (페이지 제외)
- 200줄 초과 파일 금지

---

## 파일 네이밍

| 유형 | 규칙 | 예시 |
|-----|------|------|
| 컴포넌트 | PascalCase | `StrategyCard.tsx` |
| 훅 | camelCase, use 접두사 | `useStrategies.ts` |
| 유틸 | camelCase | `formatPrice.ts` |
| 페이지 | kebab-case 폴더 | `strategies/page.tsx` |

---

## 참조

- design-system 스킬: UI 컴포넌트 상세
- PRD: `PRD.md` > 3. 기능 명세
