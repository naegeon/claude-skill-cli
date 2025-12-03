#!/usr/bin/env node
/**
 * Post-Write Hook - 파일 작성 후 처리
 * Claude Skills Framework
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

  const projectDir = process.env.CLAUDE_PROJECT_DIR || '.';

  // 1. TypeScript/JavaScript 파일 자동 포매팅 (prettier가 있으면)
  if (/\.(ts|tsx|js|jsx)$/.test(filePath)) {
    const pkgPath = path.join(projectDir, 'package.json');

    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        if (deps.prettier) {
          try {
            execSync(`npx prettier --write "${filePath}"`, {
              cwd: projectDir,
              stdio: 'ignore'
            });
          } catch (e) {
            // prettier 실패해도 무시
          }
        }
      } catch (e) {
        // package.json 파싱 실패해도 무시
      }
    }
  }

  // 2. 변경 사항 로깅 (세션 추적용)
  const logDir = path.join(projectDir, '.claude', 'sync');
  const logFile = path.join(logDir, 'changes.log');

  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `[${timestamp}] Modified: ${filePath}\n`;

    fs.appendFileSync(logFile, logEntry);

    // 로그 파일 크기 제한 (최근 100줄만 유지)
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length > 100) {
        fs.writeFileSync(logFile, lines.slice(-100).join('\n') + '\n');
      }
    }
  } catch (e) {
    // 로깅 실패해도 무시
  }

  process.exit(0);
}

main();
