import process from './../src/main';

type github = { context: { payload: { pull_request?: { head: { ref: string; } }; }, ref: string; sha: string; } };

test('push branch', () => {
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

test('push tag', () => {
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

test('Pull request into master branch', () => {
    const github: github = {
        context: {
            payload: {
                pull_request: {
                    head: {
                        ref: 'release/first-1.0.1'
                    }
                }
            },
            ref: 'refs/heads/master',
            sha: '955e639d'
        }
    };
    expect(process(github)).toStrictEqual({
        version: '1.0.1'
    });
});

test('Pull request into branch different from master', () => {
    const github: github = {
        context: {
            payload: {
                pull_request: {
                    head: {
                        ref: 'release/first-1.0.1'
                    }
                }
            },
            ref: 'refs/heads/develop',
            sha: '955e639d'
        }
    };
    expect(process(github)).toStrictEqual({
        version: 'develop-1.0.1-955e639d'
    });
});

test('Invalid source branch on pull request', () => {
    const github: github = {
        context: {
            payload: {
                pull_request: {
                    head: {
                        ref: 'invalid'
                    }
                }
            },
            ref: 'refs/heads/master',
            sha: '955e639d'
        }
    };
    expect(process(github)).toStrictEqual({
        error: 'Invalid source branch name "invalid". Please follow the following regex for naming: /[a-zA-Z][a-zA-Z0-9_]*-(\\d+\\.\\d+\\.\\d+)/'
    });
});

test('Invalid destination branch on pull request', () => {
    const github: github = {
        context: {
            payload: {
                pull_request: {
                    head: {
                        ref: 'release/first-1.0.1'
                    }
                }
            },
            ref: 'refs/heads/invalid',
            sha: '955e639d'
        }
    };
    expect(process(github)).toStrictEqual({
        error: 'Unrecognized destination branch name: invalid'
    });
});
