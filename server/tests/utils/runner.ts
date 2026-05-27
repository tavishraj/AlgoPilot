import { analyzeCodeStatic } from '../../src/analysis/index.js';
import type { SupportedLanguage, StaticAnalysisReport } from '../../src/analysis/types.js';

export function runAnalyzer(code: string, language: SupportedLanguage): StaticAnalysisReport {
  return analyzeCodeStatic(code, language);
}
