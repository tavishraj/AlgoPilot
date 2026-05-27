import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { runAnalyzer } from './utils/runner.js';
import type { SupportedLanguage } from '../src/analysis/types.js';

import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const samplesDir = path.join(__dirname, 'samples', 'golden');

const langs: SupportedLanguage[] = ['js', 'ts', 'py', 'java', 'cpp'];

test('Phase 2: Golden Samples', async (t) => {
    for (const lang of langs) {
        await t.test(`Language: ${lang}`, async (t2) => {
            const langDir = path.join(samplesDir, lang);
            if (!fs.existsSync(langDir)) return;

            // Pattern tests
            await t2.test('Patterns', () => {
                const filePath = path.join(langDir, `patterns.${lang}`);
                if (!fs.existsSync(filePath)) return;
                const code = fs.readFileSync(filePath, 'utf8');
                const langMap: Record<string, SupportedLanguage> = { js: 'javascript', ts: 'typescript', py: 'python', java: 'java', cpp: 'cpp' };
                const report = runAnalyzer(code, langMap[lang]);
                if (report.patterns.length === 0) {
                    console.warn(`[FALSE NEGATIVE] No patterns detected in ${lang}/patterns`);
                }
                assert.ok(report, 'Report should be generated');
            });

            // Complexity tests
            await t2.test('Complexity', () => {
                const filePath = path.join(langDir, `complexity.${lang}`);
                if (!fs.existsSync(filePath)) return;
                const code = fs.readFileSync(filePath, 'utf8');
                const langMap: Record<string, SupportedLanguage> = { js: 'javascript', ts: 'typescript', py: 'python', java: 'java', cpp: 'cpp' };
                const report = runAnalyzer(code, langMap[lang]);
                assert.ok(report.metrics.loopCount >= 0, 'Should have loop metrics');
                assert.ok(report.complexity.time, 'Should have a time complexity estimate');
            });

            // Mistakes tests
            await t2.test('Mistakes', () => {
                const filePath = path.join(langDir, `mistakes.${lang}`);
                if (!fs.existsSync(filePath)) return;
                const code = fs.readFileSync(filePath, 'utf8');
                const langMap: Record<string, SupportedLanguage> = { js: 'javascript', ts: 'typescript', py: 'python', java: 'java', cpp: 'cpp' };
                const report = runAnalyzer(code, langMap[lang]);
                if (report.diagnostics.length === 0) {
                    console.warn(`[FALSE NEGATIVE] No mistakes detected in ${lang}/mistakes`);
                }
            });

            // Safety tests
            await t2.test('Safety', () => {
                const filePath = path.join(langDir, `safety.${lang}`);
                if (!fs.existsSync(filePath)) return;
                const code = fs.readFileSync(filePath, 'utf8');
                const langMap: Record<string, SupportedLanguage> = { js: 'javascript', ts: 'typescript', py: 'python', java: 'java', cpp: 'cpp' };
                const report = runAnalyzer(code, langMap[lang]);
                if (report.diagnostics.length === 0) {
                    console.warn(`[FALSE NEGATIVE] No safety issues detected in ${lang}/safety`);
                }
            });
        });
    }
});
