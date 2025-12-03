const fs = require('fs');
const path = require('path');
const templates = require('../utils/templates');
const { ensureDir } = require('../utils/file-helpers');

async function addSkill(skillName, options) {
  console.log(`\n📦 스킬 추가: ${skillName}\n`);

  const cwd = process.cwd();
  const claudeDir = path.join(cwd, '.claude');
  const skillsDir = path.join(claudeDir, 'skills');
  const templatesDir = path.join(skillsDir, '_templates');

  // .claude 폴더 확인
  if (!fs.existsSync(claudeDir)) {
    console.log('❌ .claude 폴더가 없습니다. 먼저 "claude-skill init"을 실행하세요.\n');
    process.exit(1);
  }

  // 템플릿 확인
  const templatePath = `skills/_templates/${skillName}.md`;
  const hasTemplate = templates.exists(templatePath);

  if (hasTemplate && !options.dynamic) {
    // 템플릿 기반 스킬 복사
    const destPath = path.join(templatesDir, `${skillName}.md`);
    templates.copyTemplate(templatePath, destPath);
    console.log(`✅ ${skillName} 스킬 템플릿 복사 완료\n`);
    console.log('다음 단계:');
    console.log(`  1. Claude Code에서 "${skillName} 스킬 적용해줘" 입력`);
    console.log('  2. 프로젝트에 맞게 커스터마이징됨\n');
  } else {
    // 동적 스킬 생성
    console.log(`⚠️  ${skillName} 템플릿이 없습니다.\n`);

    if (options.dynamic) {
      // 동적 생성 스캐폴드 생성
      const skillDir = path.join(skillsDir, skillName);
      ensureDir(skillDir);

      const skillContent = generateDynamicSkillTemplate(skillName);
      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillContent);

      console.log(`✅ ${skillName} 동적 스킬 스캐폴드 생성 완료\n`);
      console.log('다음 단계:');
      console.log(`  1. Claude Code에서 "${skillName} 스킬 만들어줘" 입력`);
      console.log('  2. 코드 분석 + Q&A로 스킬 내용 채워짐\n');
    } else {
      console.log('동적 생성을 원하시면 --dynamic 옵션을 사용하세요:');
      console.log(`  claude-skill add ${skillName} --dynamic\n`);
      console.log('또는 Claude Code에서:');
      console.log(`  "${skillName} 스킬 추가해줘"\n`);
    }
  }
}

function generateDynamicSkillTemplate(skillName) {
  const date = new Date().toISOString().split('T')[0];

  return `---
name: ${skillName}
description: |
  ${skillName} 개발 가이드 (동적 생성됨).
  "${skillName}" 관련 작업 시 활성화.
generated: dynamic
source:
  analyzed_dirs: []
  detected_libs: []
  created_at: "${date}"
---

# ${skillName.charAt(0).toUpperCase() + skillName.slice(1)} Development Guide

> ⚠️ 이 스킬은 동적으로 생성되었습니다.
> Claude Code에서 "${skillName} 스킬 만들어줘"를 실행하여 내용을 채워주세요.

---

## 핵심 원칙

<!-- 코드 분석 후 자동 생성됨 -->

1. **원칙 1** - 설명
2. **원칙 2** - 설명
3. **원칙 3** - 설명

---

## 필수 체크리스트

### 작업 시 확인 사항

- [ ] 체크 항목 1
- [ ] 체크 항목 2
- [ ] 체크 항목 3

---

## 코드 패턴

### 표준 패턴

\`\`\`typescript
// 패턴 예시
\`\`\`

---

## 금지 사항

- 금지 항목 1
- 금지 항목 2

---

## 참조

- PRD: \`PRD.md\` > 관련 섹션
`;
}

module.exports = addSkill;
