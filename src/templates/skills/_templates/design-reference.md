---
name: design-reference
description: |
  참조 디자인 가이드. "디자인 참고", "레이아웃 확인", "색상 팔레트"
  관련 요청 시 활성화.
allowed-tools: Read, Glob

source:
  reference_url: "${REFERENCE_URL}"
  analyzed_at: "${DATE}"
dependencies:
  - design-system
---

# Design Reference Guide

> 참조 사이트: [${REFERENCE_SITE_NAME}](${REFERENCE_URL})

---

## 분석 개요

| 항목 | 내용 |
|-----|------|
| 분석일 | ${DATE} |
| 참조 URL | ${REFERENCE_URL} |
| 주요 특징 | ${MAIN_FEATURES} |

---

## 레이아웃 구조

### 전체 구조

```
┌─────────────────────────────────────────┐
│                 Header                   │
├─────────┬───────────────────────────────┤
│         │                               │
│ Sidebar │         Main Content          │
│         │                               │
├─────────┴───────────────────────────────┤
│                 Footer                   │
└─────────────────────────────────────────┘
```

### 구조 상세

| 영역 | 특징 | 비고 |
|-----|------|------|
${LAYOUT_TABLE}

### 그리드 시스템

```
컬럼: ${GRID_COLUMNS}
거터: ${GRID_GUTTER}
브레이크포인트:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
```

---

## 색상 팔레트

### Primary Colors

| 용도 | 색상 | HEX | Tailwind |
|-----|------|-----|----------|
| Primary | ${PRIMARY_COLOR_NAME} | ${PRIMARY_HEX} | `${PRIMARY_TAILWIND}` |
| Secondary | ${SECONDARY_COLOR_NAME} | ${SECONDARY_HEX} | `${SECONDARY_TAILWIND}` |
| Accent | ${ACCENT_COLOR_NAME} | ${ACCENT_HEX} | `${ACCENT_TAILWIND}` |

### Neutral Colors

| 용도 | HEX | Tailwind |
|-----|-----|----------|
| Background | ${BG_HEX} | `${BG_TAILWIND}` |
| Surface | ${SURFACE_HEX} | `${SURFACE_TAILWIND}` |
| Text Primary | ${TEXT_PRIMARY_HEX} | `${TEXT_PRIMARY_TAILWIND}` |
| Text Secondary | ${TEXT_SECONDARY_HEX} | `${TEXT_SECONDARY_TAILWIND}` |
| Border | ${BORDER_HEX} | `${BORDER_TAILWIND}` |

### Semantic Colors

| 용도 | HEX | 사용 상황 |
|-----|-----|----------|
| Success | ${SUCCESS_HEX} | 성공 메시지, 긍정 액션 |
| Warning | ${WARNING_HEX} | 경고, 주의 |
| Error | ${ERROR_HEX} | 에러, 삭제 |
| Info | ${INFO_HEX} | 정보, 안내 |

---

## 타이포그래피

### 폰트 패밀리

```css
--font-primary: '${FONT_PRIMARY}', sans-serif;
--font-secondary: '${FONT_SECONDARY}', sans-serif;
--font-mono: '${FONT_MONO}', monospace;
```

### 텍스트 스케일

| 용도 | 크기 | 행간 | 굵기 | Tailwind |
|-----|------|------|------|----------|
| Display | 48px | 56px | 700 | `text-5xl font-bold` |
| H1 | 36px | 44px | 700 | `text-4xl font-bold` |
| H2 | 30px | 38px | 600 | `text-3xl font-semibold` |
| H3 | 24px | 32px | 600 | `text-2xl font-semibold` |
| H4 | 20px | 28px | 500 | `text-xl font-medium` |
| Body | 16px | 24px | 400 | `text-base` |
| Small | 14px | 20px | 400 | `text-sm` |
| Caption | 12px | 16px | 400 | `text-xs` |

---

## 컴포넌트 패턴

### 추출된 컴포넌트

| 컴포넌트 | 용도 | 특징 |
|---------|------|------|
${COMPONENTS_TABLE}

### 주요 컴포넌트 상세

#### Navigation Bar

```
위치: 상단 고정
높이: ${NAV_HEIGHT}
배경: ${NAV_BG}
특징:
  - 로고 (좌측)
  - 메뉴 (중앙/우측)
  - 사용자 영역 (우측)
```

#### Sidebar

```
너비: ${SIDEBAR_WIDTH}
배경: ${SIDEBAR_BG}
특징:
  - 접이식 지원
  - 아이콘 + 텍스트
  - 활성 상태 표시
```

#### Card

```
배경: ${CARD_BG}
테두리: ${CARD_BORDER}
라운딩: ${CARD_RADIUS}
그림자: ${CARD_SHADOW}
패딩: ${CARD_PADDING}
```

#### Button

```
Primary:
  - 배경: ${BTN_PRIMARY_BG}
  - 텍스트: ${BTN_PRIMARY_TEXT}
  - Hover: ${BTN_PRIMARY_HOVER}

Secondary:
  - 배경: ${BTN_SECONDARY_BG}
  - 테두리: ${BTN_SECONDARY_BORDER}
  - 텍스트: ${BTN_SECONDARY_TEXT}

크기:
  - sm: h-8 px-3 text-sm
  - md: h-10 px-4 text-base
  - lg: h-12 px-6 text-lg
```

---

## 간격 시스템

### Spacing Scale

```
4px  (1)   - 아이콘 내부
8px  (2)   - 밀접한 요소
12px (3)   - 관련 요소
16px (4)   - 기본 간격
24px (6)   - 섹션 내부
32px (8)   - 섹션 간격
48px (12)  - 큰 섹션
64px (16)  - 페이지 섹션
```

### 적용 패턴

```
컴포넌트 내부: ${COMPONENT_PADDING}
카드 간격: ${CARD_GAP}
섹션 간격: ${SECTION_GAP}
페이지 여백: ${PAGE_MARGIN}
```

---

## 반응형 디자인

### 브레이크포인트별 변화

| 브레이크포인트 | Sidebar | 그리드 | Navigation |
|--------------|---------|--------|------------|
| Mobile (<640px) | 숨김 | 1열 | 햄버거 메뉴 |
| Tablet (640-1024px) | 아이콘만 | 2열 | 축약 메뉴 |
| Desktop (>1024px) | 전체 표시 | 3열+ | 전체 메뉴 |

---

## Tailwind 설정 예시

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${PRIMARY_HEX}',
          hover: '${PRIMARY_HOVER_HEX}',
        },
        secondary: {
          DEFAULT: '${SECONDARY_HEX}',
        },
        accent: {
          DEFAULT: '${ACCENT_HEX}',
        },
      },
      fontFamily: {
        sans: ['${FONT_PRIMARY}', 'sans-serif'],
      },
    },
  },
}
```

---

## 적용 가이드

### 우선순위

1. **레이아웃 구조** - 전체 페이지 구조 먼저 적용
2. **색상 팔레트** - Tailwind 설정에 추가
3. **타이포그래피** - 폰트 로드 및 스케일 적용
4. **컴포넌트 스타일** - 개별 컴포넌트에 적용

### 주의사항

- 참조 사이트의 디자인을 그대로 복사하지 않음
- 핵심 패턴과 시스템만 추출하여 적용
- 프로젝트 컨텍스트에 맞게 조정

---

## 참조

- design-system 스킬: 통합 디자인 시스템
- frontend 스킬: 컴포넌트 구현 패턴
- 원본 사이트: [${REFERENCE_URL}](${REFERENCE_URL})
