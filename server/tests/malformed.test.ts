import test from 'node:test';
import assert from 'node:assert';
import { runAnalyzer } from './utils/runner.js';

const malformedSnippets = [
    {
        name: 'Broken braces',
        code: `function test() {
            if (true) {
                console.log(1);
            // missing closing braces
        `
    },
    {
        name: 'Missing semicolons and mixed tabs/spaces',
        code: `function	tabsAndSpaces() {
  let x = 1
	let y = 2
    return x + y
}`
    },
    {
        name: 'Partial snippets',
        code: `for (let i = 0; i < 10; i++) {
            arr.push(i);
        }` // no surrounding function
    },
    {
        name: 'Random pasted text',
        code: `The quick brown fox jumps over the lazy dog.
        Exception in thread "main" java.lang.NullPointerException
        `
    },
    {
        name: 'Huge comments',
        code: `/*
        ${'A'.repeat(10000)}
        */
        function test() { return 1; }
        `
    },
    {
        name: 'Weird unicode',
        code: `function 测试(변수) {
            let 😊 = 1;
            return 😊 + 변수;
        }`
    },
    {
        name: 'Emojis in comments',
        code: `// This is a 🔥 function!
        function fire() { return true; } /* 🚀🚀🚀 */`
    },
    {
        name: 'Incomplete recursion',
        code: `function recurse(n) {
            if (n < 0) return 0;
            return recurse( // syntax error here
        }`
    },
    {
        name: 'Invalid syntax combinations',
        code: `class 123Invalid {
            function void public void() {}
            const let var = 1;
        }`
    }
];

test('Phase 3: Malformed Input Testing', async (t) => {
    for (const snippet of malformedSnippets) {
        await t.test(snippet.name, () => {
            // Test across languages to ensure all parsers are resilient
            const langs = ['js', 'ts', 'py', 'java', 'cpp'] as const;
            for (const lang of langs) {
                try {
                    const report = runAnalyzer(snippet.code, lang);
                    assert.ok(report, 'Report should be returned');
                    // Ensure the report format is somewhat stable
                    assert.ok(report.language === lang);
                    assert.ok(Array.isArray(report.diagnostics));
                    assert.ok(Array.isArray(report.patterns));
                } catch (e) {
                    assert.fail(`Analyzer crashed on ${snippet.name} for language ${lang}: ${e}`);
                }
            }
        });
    }
});
