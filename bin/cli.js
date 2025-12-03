#!/usr/bin/env node

const { program } = require('commander');
const pkg = require('../package.json');
const init = require('../src/commands/init');
const addSkill = require('../src/commands/add-skill');
const analyze = require('../src/commands/analyze');

program
  .name('claude-skill')
  .description('PRD 기반 AI 개발 워크플로우 프레임워크')
  .version(pkg.version);

program
  .command('init')
  .description('프로젝트에 Claude Skill 프레임워크 초기화')
  .option('-t, --type <type>', '프로젝트 유형 (new|existing|hooks-only)', 'existing')
  .option('-s, --skills <skills>', '설치할 스킬 (쉼표 구분)', 'backend,frontend,database')
  .option('-y, --yes', '모든 프롬프트에 yes로 응답')
  .action(init);

program
  .command('add <skill>')
  .description('스킬 추가 (예: claude-skill add ai)')
  .option('-d, --dynamic', '동적 스킬 생성 (템플릿 없이)')
  .action(addSkill);

program
  .command('analyze')
  .description('기존 프로젝트 분석 및 스킬 추천')
  .option('-o, --output <path>', '분석 결과 출력 경로')
  .action(analyze);

program
  .command('list')
  .description('사용 가능한 스킬 템플릿 목록')
  .action(() => {
    const templates = require('../src/utils/templates');
    console.log('\n📚 사용 가능한 스킬 템플릿:\n');
    templates.listAvailable().forEach(skill => {
      console.log(`  • ${skill.name} - ${skill.description}`);
    });
    console.log('\n동적 스킬 생성: claude-skill add <이름> --dynamic\n');
  });

program.parse();
