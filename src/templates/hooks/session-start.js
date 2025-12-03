#!/usr/bin/env node
/**
 * Session Start Hook - PRD + Handoff 자동 로드
 * Claude Skills Framework
 */

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || '.';

function main() {
  const lines = [];

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('🚀 세션 시작 프로토콜');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 1. PRD.md 확인
  const prdPath = path.join(PROJECT_DIR, 'PRD.md');
  if (fs.existsSync(prdPath)) {
    lines.push('');
    lines.push('📋 PRD 로드됨');
    lines.push('─────────────────────────────────────────');

    const content = fs.readFileSync(prdPath, 'utf-8');
    const preview = content.split('\n').slice(0, 30).join('\n');
    lines.push(preview);
    lines.push('...');
    lines.push('(전체 내용은 PRD.md 참조)');
  } else {
    lines.push('');
    lines.push('⚠️  PRD.md 없음 - "PRD 생성해줘"로 시작하세요');
  }

  // 2. Session Handoff 확인
  const handoffPath = path.join(PROJECT_DIR, '.claude', 'sync', 'session-handoff.md');
  if (fs.existsSync(handoffPath)) {
    lines.push('');
    lines.push('📝 이전 세션 인계사항');
    lines.push('─────────────────────────────────────────');

    const content = fs.readFileSync(handoffPath, 'utf-8');
    lines.push(content);

    // Hotfix 확인
    if (content.toLowerCase().includes('hotfix')) {
      lines.push('');
      lines.push('🚨 HOTFIX 항목 발견! 우선 처리 필요');
    }
  } else {
    lines.push('');
    lines.push('📝 이전 세션 기록 없음 (새 세션)');
  }

  // 3. 사용 가능한 스킬 목록
  const skillsDir = path.join(PROJECT_DIR, '.claude', 'skills');
  if (fs.existsSync(skillsDir)) {
    lines.push('');
    lines.push('🔧 사용 가능한 스킬');
    lines.push('─────────────────────────────────────────');

    const skills = fs.readdirSync(skillsDir).filter(item => {
      const itemPath = path.join(skillsDir, item);
      const skillFile = path.join(itemPath, 'SKILL.md');
      return fs.statSync(itemPath).isDirectory() &&
             item !== '_templates' &&
             fs.existsSync(skillFile);
    });

    skills.forEach(skill => {
      lines.push(`  • ${skill}`);
    });
  }

  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('✅ 세션 준비 완료 - 작업을 시작하세요');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log(lines.join('\n'));
}

main();
