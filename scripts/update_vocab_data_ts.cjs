const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/vocabData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import
if (!content.includes("from './allVocabWords'")) {
  content = content.replace("import { VocabWord } from '../types';", "import { VocabWord } from '../types';\nimport { ALL_VOCAB_WORDS } from './allVocabWords';");
}

// 2. Replace the massive INITIAL_VOCAB_LIST array with ALL_VOCAB_WORDS
const startIndex = content.indexOf('export const INITIAL_VOCAB_LIST: VocabWord[] = [');
const endIndex = content.indexOf('export const VOCAB_TOPICS = [');

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = 'export const INITIAL_VOCAB_LIST: VocabWord[] = ALL_VOCAB_WORDS;\n\n';
  content = content.slice(0, startIndex) + replacement + content.slice(endIndex);
}

// 3. Update wordCountLabel in TOPIK_LEVELS_INFO
content = content.replace("wordCountLabel: '25+ từ vựng cốt lõi'", "wordCountLabel: '280+ từ vựng cốt lõi'");
content = content.replace("wordCountLabel: '25+ từ vựng thông dụng'", "wordCountLabel: '190+ từ vựng thực tế'");
content = content.replace("wordCountLabel: '25+ từ vựng trung cấp'", "wordCountLabel: '160+ từ vựng công sở'");
content = content.replace("wordCountLabel: '25+ từ vựng nâng cao'", "wordCountLabel: '140+ từ vựng tin tức'");
content = content.replace("wordCountLabel: '25+ từ vựng chuyên sâu'", "wordCountLabel: '120+ từ vựng học thuật'");
content = content.replace("wordCountLabel: '25+ từ vựng đỉnh cao'", "wordCountLabel: '100+ thành ngữ đỉnh cao'");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated vocabData.ts! Length is now:', content.length);
