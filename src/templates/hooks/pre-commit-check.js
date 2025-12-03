#!/usr/bin/env node
/**
 * Pre-Commit Check Hook - 커밋 전 검증
 * Claude Skills Framework
 *
 * Bash 도구에서 git commit 감지 시 발동
 * 빌드/린트 체크 및 세션 핸드오프 작성 유도
 */

async function main() {
  let inputData = '';

  // stdin에서 JSON 읽기
  for await (const chunk of process.stdin) {
    inputData += chunk;
  }

  if (!inputData) {
    process.exit(0);
  }

  let parsed;
  try {
    parsed = JSON.parse(inputData);
  } catch (e) {
    process.exit(0);
  }

  const toolInput = parsed.tool_input || {};
  const command = toolInput.command || '';

  // git commit 명령 감지
  if (!/git\s+commit/i.test(command)) {
    process.exit(0);
  }

  // 커밋 전 체크리스트 표시
  const checklist = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 **커밋 전 체크리스트**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**필수 확인 (커밋 전)**
- [ ] 린트 통과: \`npm run lint\`
- [ ] 타입 체크: \`npm run type-check\` 또는 \`tsc --noEmit\`
- [ ] 빌드 성공: \`npm run build\`

**코드 품질**
- [ ] any 타입 사용 없음
- [ ] console.log 제거됨
- [ ] 하드코딩된 설정값 없음

**문서화**
- [ ] session-handoff.md 업데이트 (다음 세션 과제 명시)

**HOTFIX 항목 확인**
- [ ] HOTFIX 주석이 있다면 기록됨

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
위 항목을 확인했나요? 확인 후 커밋을 진행하세요.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  const output = {
    systemMessage: checklist,
    continue: true
  };

  console.log(JSON.stringify(output));
  process.exit(0);
}

main();
