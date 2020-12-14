const BASE_VERSION = '0.0.1';
const TAG_REF = 'refs/tags/';
const PULL_REQUEST_SOURCE_BRANCH_NAME_REGEX = /[a-zA-Z][a-zA-Z0-9_]*-(\d+\.\d+\.\d+)/;

export type ProcessResult = { version?: string; error?: string | Error };

export default (github: any): ProcessResult => {
    try {
        if (isPullRequest(github.context.payload.pull_request)) {
            const base_ref: string = github.context.payload.pull_request.head.ref;
            return handlePullRequest(github, base_ref);
        } else {
            // PUSH operation.
            const ref = github.context.ref;
            const branch = extractBranchNameFromRef(ref);
            if (isTag(ref)) {
                return { version: branch };
            } else {
                const sha = github.context.sha.substr(0, 11);
                return { version: `${branch}-${sha}` };
            }
        }
    } catch (error) {
        return { error: error.message };
    }
};

function handlePullRequest(github: any, source_branch: string): ProcessResult {
    const ref: string = github.context.payload.pull_request.base.ref;
    const branch = extractBranchNameFromRef(ref);
    const sha: string = github.context.sha.substr(0, 11);

    if (!source_branch.match(PULL_REQUEST_SOURCE_BRANCH_NAME_REGEX)) {
        const version_name = `${branch}-${sha}`;
        return { version: version_name };
    } else {
        const version = extractVersionNumber(source_branch);
        const version_name = `${branch}-${version}-${sha}`;
        return { version: version_name };
    }
}

function isPullRequest(pull_request: any): boolean {
    return pull_request != null;
}

function isTag(ref: string): boolean { return ref.startsWith(TAG_REF) }

// function isDefaultBranch(ref: string, default_branch: string): boolean { return ref === `${BRANCH_REF}${default_branch}`; }

// function isReleaseBranch(ref: string): boolean { return ref.startsWith(`${BRANCH_REF}release`); }
// function isDevelopBranch(ref: string): boolean { return ref.startsWith(`${BRANCH_REF}develop`); }
// function isFeatureBranch(ref: string): boolean { return ref.startsWith(`${BRANCH_REF}feature`); }
// function isHotfixBranch(ref: string): boolean { return ref.startsWith(`${BRANCH_REF}hotfix`); }

function extractBranchNameFromRef(ref: string): string {
    return ref.substr(ref.lastIndexOf('/') + 1);
}

function extractVersionNumber(source_branch: string): string {
    const groups = source_branch.match(PULL_REQUEST_SOURCE_BRANCH_NAME_REGEX);
    return groups ? groups[1] : BASE_VERSION;
}
