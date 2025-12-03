const fs = require('fs');
const path = require('path');

async function analyze(options) {
  console.log('\n🔍 프로젝트 분석 중...\n');

  const cwd = process.cwd();

  // 분석 결과 객체
  const analysis = {
    projectName: path.basename(cwd),
    techStack: [],
    existingDocs: {
      prd: false,
      claude: false,
      skills: []
    },
    suggestedSkills: [],
    patterns: []
  };

  // 1. 기존 문서 확인
  console.log('📁 기존 문서 확인...');

  if (fs.existsSync(path.join(cwd, 'PRD.md'))) {
    analysis.existingDocs.prd = true;
    console.log('  ✅ PRD.md 발견');
  } else {
    console.log('  ❌ PRD.md 없음');
  }

  if (fs.existsSync(path.join(cwd, 'CLAUDE.md'))) {
    analysis.existingDocs.claude = true;
    console.log('  ✅ CLAUDE.md 발견');
  } else {
    console.log('  ❌ CLAUDE.md 없음');
  }

  const skillsDir = path.join(cwd, '.claude', 'skills');
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir).filter(f =>
      fs.statSync(path.join(skillsDir, f)).isDirectory() && !f.startsWith('_')
    );
    analysis.existingDocs.skills = skills;
    console.log(`  ✅ 기존 스킬: ${skills.join(', ') || '없음'}`);
  }

  // 2. 기술 스택 감지
  console.log('\n📦 기술 스택 감지...');

  // package.json 분석
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      // 프레임워크 감지
      if (deps['next']) analysis.techStack.push({ name: 'Next.js', version: deps['next'] });
      if (deps['react']) analysis.techStack.push({ name: 'React', version: deps['react'] });
      if (deps['vue']) analysis.techStack.push({ name: 'Vue', version: deps['vue'] });

      // 스타일링
      if (deps['tailwindcss']) analysis.techStack.push({ name: 'Tailwind CSS', version: deps['tailwindcss'] });

      // ORM
      if (deps['drizzle-orm']) analysis.techStack.push({ name: 'Drizzle ORM', version: deps['drizzle-orm'] });
      if (deps['prisma'] || deps['@prisma/client']) analysis.techStack.push({ name: 'Prisma', version: deps['prisma'] || deps['@prisma/client'] });

      // 인증
      if (deps['next-auth']) analysis.techStack.push({ name: 'NextAuth', version: deps['next-auth'] });

      // AI
      if (deps['openai']) analysis.techStack.push({ name: 'OpenAI', version: deps['openai'] });
      if (deps['@anthropic-ai/sdk']) analysis.techStack.push({ name: 'Anthropic', version: deps['@anthropic-ai/sdk'] });
      if (deps['ai']) analysis.techStack.push({ name: 'Vercel AI SDK', version: deps['ai'] });

      analysis.techStack.forEach(tech => {
        console.log(`  • ${tech.name}: ${tech.version}`);
      });
    } catch (e) {
      console.log('  ⚠️  package.json 파싱 실패');
    }
  } else {
    console.log('  ❌ package.json 없음');
  }

  // 3. 스킬 추천
  console.log('\n💡 추천 스킬...');

  // 기본 스킬
  analysis.suggestedSkills.push('backend', 'frontend', 'database');

  // 기술 스택 기반 추천
  if (analysis.techStack.some(t => t.name.includes('OpenAI') || t.name.includes('Anthropic') || t.name.includes('AI'))) {
    analysis.suggestedSkills.push('ai');
    console.log('  🤖 AI 스킬 추천 (AI 라이브러리 감지)');
  }

  if (analysis.techStack.some(t => t.name.includes('Auth'))) {
    analysis.suggestedSkills.push('auth');
    console.log('  🔐 Auth 스킬 추천 (인증 라이브러리 감지)');
  }

  // 중복 제거
  analysis.suggestedSkills = [...new Set(analysis.suggestedSkills)];
  console.log(`\n  추천: ${analysis.suggestedSkills.join(', ')}`);

  // 4. 결과 출력
  console.log('\n' + '─'.repeat(50));
  console.log('\n📊 분석 결과 요약\n');

  // 모드 추천
  if (analysis.existingDocs.prd && analysis.existingDocs.claude) {
    console.log('🎯 추천 모드: Mode 5 (문서 검증)');
    console.log('   → Claude Code에서 "프로젝트 분석해줘" 실행\n');
  } else if (analysis.techStack.length > 0) {
    console.log('🎯 추천 모드: Mode 4 (코드 역분석)');
    console.log('   → Claude Code에서 "PRD 만들어줘" 실행\n');
  } else {
    console.log('🎯 추천 모드: Mode 1 (새 프로젝트)');
    console.log('   → Claude Code에서 "새 프로젝트 시작해줘" 실행\n');
  }

  // JSON 출력 (옵션)
  if (options.output) {
    fs.writeFileSync(options.output, JSON.stringify(analysis, null, 2));
    console.log(`📄 분석 결과 저장: ${options.output}\n`);
  }

  console.log('다음 단계:');
  console.log('  1. claude-skill init 실행 (아직 안 했다면)');
  console.log('  2. Claude Code에서 추천 모드 실행\n');
}

module.exports = analyze;
