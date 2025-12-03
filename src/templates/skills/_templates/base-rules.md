# Base Rules (Level 0)

> **모든 스킬에 공통 적용되는 핵심 규칙**
> Hook에서 항상 로드됨

---

## 절대 금지 (위반 시 커밋 불가)

### 타입 안전
- `any` 타입 사용 금지
- `as any` 캐스팅 금지
- `@ts-ignore` 사용 금지 (HOTFIX 표시 시 예외)

### 하드코딩 금지
```typescript
// ❌ 금지
const siteName = "내 서비스";
const apiUrl = "https://api.example.com";
const businessNumber = "123-45-67890";

// ✅ 올바른 방법
import { siteConfig } from "@/config/site";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### 보안
- `.env` 파일 Git 커밋 금지
- API 키, 시크릿 하드코딩 금지
- `console.log`로 민감 정보 출력 금지

---

## 중앙 설정 관리

### 필수 설정 파일 구조
```
config/
├── site.ts       # 사이트명, 설명, URL
├── company.ts    # 사업자 정보, 연락처
└── links.ts      # 외부 링크, SNS
```

### site.ts 예시
```typescript
export const siteConfig = {
  name: "서비스명",
  description: "서비스 설명",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
};
```

### 사용법
```typescript
import { siteConfig } from "@/config/site";

// 페이지 제목
<title>{siteConfig.name}</title>

// 메타데이터
export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};
```

---

## Import 순서 규칙

```typescript
// 1. React/Next.js 코어
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. 외부 라이브러리
import { z } from 'zod';
import useSWR from 'swr';

// 3. 내부 절대 경로 (@/)
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { siteConfig } from '@/config/site';

// 4. 상대 경로
import { helper } from './utils';

// 5. 타입 (type 키워드 사용)
import type { User } from '@/types';

// 6. 스타일
import './styles.css';
```

### ESLint 설정 (권장)
```json
{
  "rules": {
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
      "newlines-between": "always"
    }]
  }
}
```

---

## Hotfix 모드

### 언제 사용?
- 빌드 오류 긴급 해결
- 린트/타입 오류 임시 우회
- 외부 라이브러리 버그 대응

### 필수 표시
```typescript
// HOTFIX: [이유] - [날짜] - [담당자]
// TODO(hotfix): 추후 리팩토링 필요
const data: any = externalLibraryBug(); // HOTFIX: 라이브러리 타입 오류 - 2024-01-15
```

### session-handoff.md에 기록 필수
```markdown
## ⚠️ Hotfix 항목
- [ ] `src/lib/api.ts:45` - any 타입 사용 (라이브러리 타입 미지원)
- [ ] `src/components/Chart.tsx:23` - ts-ignore (차트 라이브러리 버그)
```

### 다음 세션에서
- Hook이 Hotfix 항목 감지 → 우선 처리 요청
- 해결 후 HOTFIX 주석 제거

---

## 세션 종료 체크리스트

### 커밋 전 필수 (순서대로)
```bash
1. npm run lint          # 린트 통과
2. npm run type-check    # 타입 체크 (또는 tsc --noEmit)
3. npm run build         # 빌드 성공
4. npm run test          # 테스트 통과 (있으면)
```

### 실패 시
- Hotfix 모드로 임시 해결
- session-handoff.md에 상세 기록
- 다음 세션에서 근본 해결

---

## 파일 크기 제한

| 파일 유형 | 최대 줄 수 |
|----------|-----------|
| 컴포넌트 | 200줄 |
| API 라우트 | 150줄 |
| 유틸리티 | 100줄 |
| 스킬 파일 | 300줄 |
| CLAUDE.md | 150줄 |

초과 시 → 파일 분리 필수
