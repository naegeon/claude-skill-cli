#!/usr/bin/env node
/**
 * Skill Enforcer Hook - 동적 스킬 감지 및 체크리스트 주입
 * Claude Skills Framework
 *
 * PreToolUse Hook으로 Write/Edit 도구 사용 시 발동
 * 파일 패턴을 감지하여 해당 스킬의 체크리스트를 Claude에게 주입
 */

const fs = require('fs');
const path = require('path');

// 파일 패턴 → 스킬 매핑 (범용)
const PATTERN_TO_SKILL = {
  database: [
    /schema\.(ts|js)$/,
    /db\//,
    /drizzle\//,
    /prisma\//,
    /migrations\//,
    /models\//,
  ],
  backend: [
    /api\/.*route\.(ts|js)$/,
    /api\/.*\.(ts|js)$/,
    /server\//,
    /actions\//,
    /services\//,
  ],
  frontend: [
    /components\/.*\.(tsx|jsx)$/,
    /app\/.*page\.(tsx|jsx)$/,
    /pages\/.*\.(tsx|jsx)$/,
    /hooks\/.*\.(ts|js)$/,
  ],
  auth: [
    /auth/,
    /login/,
    /session/,
    /middleware\.(ts|js)$/,
  ],
  styling: [
    /\.css$/,
    /\.scss$/,
    /styles\//,
    /tailwind/,
  ],
  config: [
    /config\//,
    /\.env/,
    /settings\.(ts|js)$/,
  ],
  'api-spec': [
    /api\/.*route\.(ts|js)$/,
  ],
};

// 핵심 규칙 (항상 적용)
const CORE_RULES = `
⚠️ **핵심 규칙 (항상 적용)**
- any 타입 사용 금지
- 환경변수 하드코딩 금지
- 사이트명/사업자정보 하드코딩 금지 → config 사용
- console.log 제거 (디버깅 완료 후)
`;

function getProjectDir() {
  return process.env.CLAUDE_PROJECT_DIR || '.';
}

function getAvailableSkills(projectDir) {
  const skillsDir = path.join(projectDir, '.claude', 'skills');
  const available = [];

  if (fs.existsSync(skillsDir)) {
    const items = fs.readdirSync(skillsDir);
    for (const item of items) {
      const itemPath = path.join(skillsDir, item);
      const skillFile = path.join(itemPath, 'SKILL.md');

      if (fs.statSync(itemPath).isDirectory() &&
          item !== '_templates' &&
          fs.existsSync(skillFile)) {
        available.push(item);
      }
    }
  }

  return available;
}

function extractChecklist(content) {
  // "## 필수 체크리스트" 또는 "## 체크리스트" 섹션 찾기
  const patterns = [
    /##\s*필수\s*체크리스트.*?\n([\s\S]*?)(?=\n##|\n---|\Z)/i,
    /##\s*체크리스트.*?\n([\s\S]*?)(?=\n##|\n---|\Z)/i,
    /###\s*.*체크.*?\n([\s\S]*?)(?=\n##|\n###|\n---|\Z)/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      const checklist = match[1].trim();
      // 체크리스트 항목만 추출 (- [ ] 패턴)
      const items = checklist.match(/-\s*\[.\].*/g);
      if (items) {
        return items.slice(0, 10).join('\n'); // 최대 10개
      }
    }
  }

  return null;
}

function loadSkillChecklist(projectDir, skillName) {
  const skillFile = path.join(projectDir, '.claude', 'skills', skillName, 'SKILL.md');

  if (fs.existsSync(skillFile)) {
    const content = fs.readFileSync(skillFile, 'utf-8');
    return extractChecklist(content);
  }

  return null;
}

function matchSkills(filePath, availableSkills) {
  const matched = [];

  for (const [skill, patterns] of Object.entries(PATTERN_TO_SKILL)) {
    if (!availableSkills.includes(skill)) {
      continue;
    }

    for (const pattern of patterns) {
      if (pattern.test(filePath)) {
        if (!matched.includes(skill)) {
          matched.push(skill);
        }
        break;
      }
    }
  }

  return matched;
}

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
  const filePath = toolInput.file_path || '';

  if (!filePath) {
    process.exit(0);
  }

  const projectDir = getProjectDir();
  const availableSkills = getAvailableSkills(projectDir);

  // 스킬이 없으면 (PRD 미생성 상태) 핵심 규칙만 표시
  if (availableSkills.length === 0) {
    const output = {
      systemMessage: CORE_RULES,
      continue: true
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  }

  // 매칭되는 스킬 찾기
  const matchedSkills = matchSkills(filePath, availableSkills);

  if (matchedSkills.length === 0) {
    process.exit(0);
  }

  // 매칭된 스킬의 체크리스트 로드
  const messages = [CORE_RULES, ''];

  for (const skill of matchedSkills) {
    const checklist = loadSkillChecklist(projectDir, skill);
    if (checklist) {
      messages.push(`📋 **${skill} 스킬 체크리스트**`);
      messages.push(checklist);
      messages.push('');
    }
  }

  if (messages.length > 2) {
    const output = {
      systemMessage: messages.join('\n'),
      continue: true
    };
    console.log(JSON.stringify(output));
  }

  process.exit(0);
}

main();
