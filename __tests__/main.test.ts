import process from './../src/main';

type github = { context: { payload: { pull_request?: { base: { ref: string; }; head: { ref: string; } }; }, ref: string; sha: string; } };

test('Push Branch', () => {
    const github: github = {
        context: {
            payload: {},
            ref: 'refs/heads/develop',
            sha: '955e639d'
        }
    };
    expect(process(github)).toStrictEqual({
        version: 'develop-955e639d'
    });
});

test('Push Tag', () => {
    const github: github = {
        context: {
            payload: {},
            ref: 'refs/tags/1.0.0',
            sha: '955e639d'
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
            sha: '955e639d'
        }
    };
    expect(process(github)).toStrictEqual({
        version: 'develop-1.0.1-955e639d'
    });
});
