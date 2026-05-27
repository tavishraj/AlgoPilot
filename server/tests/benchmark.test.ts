import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { runAnalyzer } from './utils/runner.js';

import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function generateCode(locCount: number): string {
    const lines = [];
    for (let i = 0; i < locCount / 10; i++) {
        lines.push(`function generateFunction_${i}() {`);
        lines.push(`    let x = ${i};`);
        lines.push(`    let y = x * 2;`);
        lines.push(`    for (let j = 0; j < 10; j++) {`);
        lines.push(`        x += j;`);
        lines.push(`        if (x % 2 === 0) y++;`);
        lines.push(`    }`);
        lines.push(`    return x + y;`);
        lines.push(`}`);
        lines.push(``); // Empty line for spacing
    }
    return lines.join('\n');
}

test('Phase 5: Performance Benchmarking', async (t) => {
    const benchmarks = [100, 1000, 5000];
    const results: any[] = [];

    for (const loc of benchmarks) {
        await t.test(`Benchmark: ${loc} LOC`, () => {
            const code = generateCode(loc);
            
            // Warm-up run
            runAnalyzer('function a(){}', 'js');

            const start = performance.now();
            const report = runAnalyzer(code, 'js');
            const end = performance.now();
            const durationMs = end - start;
            
            results.push({
                loc,
                durationMs,
                // Time per LOC should ideally remain relatively flat (linear scaling)
                msPerLoc: durationMs / loc
            });

            console.log(`\n--- BENCHMARK: ${loc} LOC ---`);
            console.log(`Execution time: ${durationMs.toFixed(2)} ms`);
            console.log(`Reported Analysis Time: ${report.analysisTimeMs.toFixed(2)} ms`);
            console.log(`Actual LOC: ${report.metrics.lineCount}`);

            assert.ok(durationMs < 5000, `Analyzer is too slow! Took ${durationMs}ms for ${loc} LOC`);
        });
    }

    fs.mkdirSync(path.join(__dirname, 'reports'), { recursive: true });
    fs.writeFileSync(
        path.join(__dirname, 'reports', 'benchmark-report.json'),
        JSON.stringify(results, null, 2)
    );
});
