import test from 'node:test';
import assert from 'node:assert';

process.env.DATABASE_URL = 'postgresql://fake:fake@localhost:5432/fake';
process.env.JWT_SECRET = 'fake_secret';
process.env.PORT = '0';

let app: any;

test('Phase 6: API Stability Testing', async (t) => {
    let server: Server;
    let baseUrl: string;

    t.before(async () => {
        // Dynamic import to prevent hoisting before env vars are set
        const module = await import('../src/app.js');
        app = module.default;
        
        // Start server on random port
        return new Promise((resolve) => {
            server = app.listen(0, () => {
                const address = server.address() as any;
                baseUrl = `http://localhost:${address.port}`;
                resolve(undefined);
            });
        });
    });

    t.after((done) => {
        if (server) {
            server.close(done);
        } else {
            done();
        }
    });

    await t.test('POST /api/analysis/analyze - Valid Request', async () => {
        const res = await fetch(`${baseUrl}/api/analysis/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: 'function test() { return 1; }',
                language: 'javascript'
            })
        });

        assert.strictEqual(res.status, 200);
        const data = await res.json() as any;
        assert.ok(data.data, 'Response should have a data object');
        assert.ok(data.data.metrics, 'Report should contain metrics');
    });

    await t.test('POST /api/analysis/analyze - Empty Payload', async () => {
        const res = await fetch(`${baseUrl}/api/analysis/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        // The API should reject it as a validation error (400)
        assert.strictEqual(res.status, 400);
    });

    await t.test('POST /api/analysis/analyze - Null Code', async () => {
        const res = await fetch(`${baseUrl}/api/analysis/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: null, language: 'javascript' })
        });

        assert.strictEqual(res.status, 400);
    });

    await t.test('POST /api/analysis/analyze - Unsupported Language', async () => {
        const res = await fetch(`${baseUrl}/api/analysis/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'test', language: 'brainfuck' })
        });

        assert.strictEqual(res.status, 400);
    });

    await t.test('POST /api/analysis/analyze - Huge File (1MB string)', async () => {
        const hugeCode = 'function a() { return 1; }\n'.repeat(50000); // approx 1.3 MB
        const res = await fetch(`${baseUrl}/api/analysis/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: hugeCode, language: 'javascript' })
        });

        // The API restricts files > 50,000 chars, so it should be 400
        assert.strictEqual(res.status, 400);
    });

    await t.test('POST /api/analysis/analyze - Malformed JSON', async () => {
        const res = await fetch(`${baseUrl}/api/analysis/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{"code": "func", language": "javascript"}' // Invalid JSON syntax
        });

        // Express body-parser should catch this and return 400
        assert.strictEqual(res.status, 400);
    });
});
