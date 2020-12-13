import process from './../src/main';

type github = { context: { payload: { pull_request?: { head: { ref: string; } }; }, ref: string; sha: string; } };
const DEFAULT_BRANCH = 'master';

test('push branch', () => {
    const github: github = {
        context: {
            payload: {},
            ref: 'refs/heads/develop',
            sha: '955e639d'
        }
    };
    expect(process(github, DEFAULT_BRANCH)).toStrictEqual({
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
    expect(process(github, DEFAULT_BRANCH)).toStrictEqual({
        version: '1.0.0'
    });
});

test('Pull request into default branch', () => {
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
    expect(process(github, DEFAULT_BRANCH)).toStrictEqual({
        version: '1.0.1'
    });
});

test('Pull request into custom default branch', () => {
    const github: github = {
        context: {
            payload: {
                pull_request: {
                    head: {
                        ref: 'release/first-1.0.1'
                    }
                }
            },
            ref: 'refs/heads/main',
            sha: '955e639d'
        }
    };
    expect(process(github, 'main')).toStrictEqual({
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
    expect(process(github, DEFAULT_BRANCH)).toStrictEqual({
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
    expect(process(github, DEFAULT_BRANCH)).toStrictEqual({
        error: 'Invalid source branch name "invalid". Please follow the following regex for naming: /[a-zA-Z][a-zA-Z0-9_]*-(\\d+\\.\\d+\\.\\d+)/'
    });
});
