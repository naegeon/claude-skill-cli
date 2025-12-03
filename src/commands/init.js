const fs = require('fs');
const path = require('path');
const readline = require('readline');
const templates = require('../utils/templates');
const { copyDir, ensureDir } = require('../utils/file-helpers');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function init(options) {
  console.log('\n🚀 Claude Skill Framework 초기화\n');

  const cwd = process.cwd();
  const claudeDir = path.join(cwd, '.claude');

  // 기존 .claude 폴더 확인
  const hasExistingSetup = fs.existsSync(claudeDir);

  let projectType = options.type;
  let selectedSkills = options.skills.split(',').map(s => s.trim());

  // 대화형 모드
  if (!options.yes) {
    // 기존 프로젝트 감지 시 다른 메뉴 표시
    if (hasExistingSetup) {
      console.log('⚠️  기존 .claude 폴더가 감지되었습니다.\n');
      console.log('작업을 선택하세요:\n');
      console.log('  [1] upgrade    - Hook/템플릿만 업데이트 (기존 스킬 유지) ✅ 권장');
      console.log('  [2] hooks-only - Hook만 업데이트');
      console.log('  [3] reset      - 전체 초기화 (⚠️ 기존 스킬 삭제됨)');
      console.log('  [4] cancel     - 취소\n');

      const upgradeAnswer = await question('선택 (1/2/3/4) [1]: ');

      if (upgradeAnswer === '4') {
        console.log('취소되었습니다.');
        rl.close();
        return;
      }

      projectType = { '1': 'upgrade', '2': 'hooks-only', '3': 'reset' }[upgradeAnswer] || 'upgrade';

      if (projectType === 'reset') {
        const confirmReset = await question('⚠️  정말 초기화하시겠습니까? 기존 스킬이 삭제됩니다. (y/N): ');
        if (confirmReset.toLowerCase() !== 'y') {
          console.log('취소되었습니다.');
          rl.close();
          return;
        }
        projectType = 'new'; // reset은 new와 동일하게 처리
      }
    } else {
      console.log('프로젝트 유형을 선택하세요:\n');
      console.log('  [1] new       - 새 프로젝트 (PRD부터 시작)');
      console.log('  [2] existing  - 기존 프로젝트 (분석 모드)');
      console.log('  [3] hooks-only - Hook 시스템만 추가\n');

      const typeAnswer = await question('선택 (1/2/3) [2]: ');
      projectType = { '1': 'new', '2': 'existing', '3': 'hooks-only' }[typeAnswer] || 'existing';
    }

    if (projectType !== 'hooks-only' && projectType !== 'upgrade') {
      console.log('\n설치할 스킬을 선택하세요 (쉼표로 구분):\n');
      const availableSkills = templates.listAvailable();
      availableSkills.forEach((skill, i) => {
        console.log(`  [${skill.name}] ${skill.description}`);
      });
      console.log('\n기본값: backend,frontend,database');

      const skillAnswer = await question('\n스킬 선택: ');
      if (skillAnswer.trim()) {
        selectedSkills = skillAnswer.split(',').map(s => s.trim());
      }
    }
  }

  rl.close();

  console.log('\n📁 프레임워크 설치 중...\n');

  try {
    // 1. .claude 디렉토리 생성
    ensureDir(claudeDir);
    ensureDir(path.join(claudeDir, 'hooks'));
    ensureDir(path.join(claudeDir, 'skills'));
    ensureDir(path.join(claudeDir, 'skills', '_templates'));
    ensureDir(path.join(claudeDir, 'sync'));

    // 2. settings.json 복사 (Hook 설정)
    const settingsPath = path.join(claudeDir, 'settings.json');
    templates.copyTemplate('settings.json', settingsPath);
    console.log('  ✅ settings.json (Hook 설정)');

    // 3. Hook 스크립트 복사 (Node.js)
    const hooks = ['session-start.js', 'skill-enforcer.js', 'pre-commit-check.js', 'post-write.js'];
    hooks.forEach(hook => {
      templates.copyTemplate(`hooks/${hook}`, path.join(claudeDir, 'hooks', hook));
    });
    console.log('  ✅ hooks/ (4개 Node.js 스크립트)');

    // 4. 기본 템플릿 복사
    const baseTemplates = ['base-rules.md', 'architecture-change.md', 'project-analysis.md', 'skills-registry.json'];
    baseTemplates.forEach(tmpl => {
      templates.copyTemplate(`skills/_templates/${tmpl}`, path.join(claudeDir, 'skills', '_templates', tmpl));
    });
    console.log('  ✅ _templates/ (기본 규칙)');

    // 5. 선택된 스킬 템플릿 복사 (upgrade/hooks-only 모드에서는 건너뜀)
    if (projectType !== 'hooks-only' && projectType !== 'upgrade') {
      selectedSkills.forEach(skill => {
        const skillTemplate = `skills/_templates/${skill}.md`;
        if (templates.exists(skillTemplate)) {
          templates.copyTemplate(skillTemplate, path.join(claudeDir, 'skills', '_templates', `${skill}.md`));
          console.log(`  ✅ ${skill}.md 스킬 템플릿`);
        } else {
          console.log(`  ⚠️  ${skill} 템플릿 없음 (동적 생성 필요)`);
        }
      });
    } else if (projectType === 'upgrade') {
      console.log('  ⏭️  기존 커스텀 스킬 유지');
    }

    // 6. session-handoff.md (upgrade 모드에서는 기존 파일 유지)
    const handoffPath = path.join(claudeDir, 'sync', 'session-handoff.md');
    if (projectType === 'upgrade' && fs.existsSync(handoffPath)) {
      console.log('  ⏭️  기존 session-handoff.md 유지');
    } else {
      templates.copyTemplate('sync/session-handoff.md', handoffPath);
      console.log('  ✅ session-handoff.md');
    }

    // 7. 코어 스킬 업데이트 (prd-generator, session-protocol, code-review)
    const coreSkills = ['prd-generator', 'session-protocol', 'code-review'];
    coreSkills.forEach(skill => {
      const skillDir = path.join(claudeDir, 'skills', skill);
      ensureDir(skillDir);
      templates.copyTemplate(`skills/${skill}/SKILL.md`, path.join(skillDir, 'SKILL.md'));
    });
    console.log('  ✅ 코어 스킬 업데이트 (prd-generator, session-protocol, code-review)');

    console.log('\n✨ 설치 완료!\n');

    // 다음 단계 안내
    console.log('📋 다음 단계:\n');
    if (projectType === 'new') {
      console.log('  1. Claude Code 실행');
      console.log('  2. "PRD 만들어줘" 입력');
      console.log('  3. Q&A를 통해 PRD + 스킬 생성\n');
    } else if (projectType === 'existing') {
      console.log('  1. Claude Code 실행');
      console.log('  2. "프로젝트 분석해줘" 입력');
      console.log('  3. 기존 코드 분석 → 스킬 생성\n');
    } else if (projectType === 'upgrade') {
      console.log('  1. Hook 및 코어 스킬이 최신 버전으로 업데이트되었습니다');
      console.log('  2. 기존 PRD, CLAUDE.md, 커스텀 스킬은 유지됩니다');
      console.log('  3. Claude Code를 실행하여 작업을 계속하세요\n');
    } else {
      console.log('  1. Claude Code 실행');
      console.log('  2. Hook이 자동으로 작동합니다');
      console.log('  3. 필요시 "스킬 추가해줘" 입력\n');
    }

    console.log('📚 문서: https://github.com/naegeon/claude-skill-cli\n');

  } catch (error) {
    console.error('❌ 설치 실패:', error.message);
    process.exit(1);
  }
}

module.exports = init;
