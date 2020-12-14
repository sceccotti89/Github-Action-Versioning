import process from './../src/main';

type github = { context: { payload: { pull_request?: { base: { ref: string; }; head: { ref: string; } }; }, ref: string; sha: string; } };

test('Push Branch', () => {
    const github: github = {
        context: {
            payload: {},
            ref: 'refs/heads/develop',
            sha: 'e763c514eb8ebd6f5967139aea9ad0dbd373dace'
        }
    };
    expect(process(github)).toStrictEqual({
        version: 'develop-e763c514eb8'
    });
});

test('Push Tag', () => {
    const github: github = {
        context: {
            payload: {},
            ref: 'refs/tags/1.0.0',
            sha: 'e763c514eb8ebd6f5967139aea9ad0dbd373dace'
        }
    };
    expect(process(github)).toStrictEqual({
        version: '1.0.0'
    });
});

test('Pull Request', () => {
    const github: github = {
        context: {
            payload: {
                pull_request: {
                    base: {
                        ref: 'refs/heads/develop'
                    },
                    head: {
                        ref: 'release/first-1.0.1'
                    }
                }
            },
            ref: null,
            sha: 'e763c514eb8ebd6f5967139aea9ad0dbd373dace'
        }
    };
    expect(process(github)).toStrictEqual({
        version: 'develop-1.0.1-e763c514eb8'
    });
});
