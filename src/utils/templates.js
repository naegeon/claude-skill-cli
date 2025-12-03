const fs = require('fs');
const path = require('path');
const { ensureDir } = require('./file-helpers');

// 템플릿 디렉토리 (패키지 내부)
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

const AVAILABLE_SKILLS = [
  { name: 'backend', description: 'API 개발 가이드 (인증, 에러처리, Zod 검증)' },
  { name: 'frontend', description: 'UI 개발 가이드 (컴포넌트, 상태관리, 접근성)' },
  { name: 'database', description: 'DB 개발 가이드 (ORM, 마이그레이션, 쿼리)' },
  { name: 'design-system', description: '디자인 시스템 (색상, 타이포그래피, 컴포넌트)' },
  { name: 'api-spec', description: 'API 명세 (엔드포인트, 요청/응답 형식)' },
  { name: 'environment', description: '환경 설정 (환경변수, 설정 파일)' },
];

function getTemplatePath(relativePath) {
  return path.join(TEMPLATES_DIR, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(getTemplatePath(relativePath));
}

function copyTemplate(relativePath, destPath) {
  const srcPath = getTemplatePath(relativePath);

  if (!fs.existsSync(srcPath)) {
    // 템플릿이 없으면 빈 파일 생성 (동적 생성용)
    ensureDir(path.dirname(destPath));
    fs.writeFileSync(destPath, `# ${path.basename(relativePath)}\n\n<!-- 동적 생성 필요 -->\n`);
    return;
  }

  ensureDir(path.dirname(destPath));
  fs.copyFileSync(srcPath, destPath);
}

function readTemplate(relativePath) {
  const srcPath = getTemplatePath(relativePath);
  if (!fs.existsSync(srcPath)) {
    return null;
  }
  return fs.readFileSync(srcPath, 'utf-8');
}

function listAvailable() {
  return AVAILABLE_SKILLS;
}

function getAllTemplateFiles() {
  const files = [];

  function scan(dir, prefix = '') {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        scan(path.join(dir, entry.name), relativePath);
      } else {
        files.push(relativePath);
      }
    }
  }

  scan(TEMPLATES_DIR);
  return files;
}

module.exports = {
  getTemplatePath,
  exists,
  copyTemplate,
  readTemplate,
  listAvailable,
  getAllTemplateFiles,
  TEMPLATES_DIR
};
