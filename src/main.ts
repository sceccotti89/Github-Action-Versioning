const BASE_VERSION = '0.0.1';
const TAG_REF = 'refs/tags/';
const BRANCH_REF = 'refs/heads/';
const PULL_REQUEST_SOURCE_BRANCH_NAME_REGEX = /[a-zA-Z][a-zA-Z0-9_]*-(\d+\.\d+\.\d+)/;

export type ProcessResult = { version?: string; warning?: string; error?: string | Error };

export default (github: any, default_branch: string): ProcessResult => {
    try {
        if (isPullRequest(github.context.payload.pull_request)) {
            const base_ref: string = github.context.payload.pull_request.head.ref;
            return handlePullRequest(github, base_ref, default_branch);
        } else {
            // PUSH operation.
            const ref = github.context.ref;
            const branch = extractBranchNameFromRef(ref);
            if (isTag(ref)) {
                return { version: branch };
            } else {
                const sha = github.context.sha.substr(0, 8);
                return { version: `${branch}-${sha}` };
            }
        }
    } catch (error) {
        return { error: error.message };
    }
};

function handlePullRequest(github: any, source_branch: string, default_branch: string): ProcessResult {
    if (!source_branch.match(PULL_REQUEST_SOURCE_BRANCH_NAME_REGEX)) {
        return { version: '', warning: `Invalid source branch name "${source_branch}". Please follow the following regex for naming: ${PULL_REQUEST_SOURCE_BRANCH_NAME_REGEX}` };
    } else {
        const version = extractVersionNumber(source_branch);
    
        const ref: string = github.context.ref;
        const sha: string = github.context.sha.substr(0, 8);
        let version_name: string;

        if (isDefaultBranch(ref, default_branch)) {
            version_name = `${version}`;
        } else {
            const branch = extractBranchNameFromRef(ref);
            version_name = `${branch}-${version}-${sha}`;
        }
    
        return { version: version_name };
    }
}

function isPullRequest(pull_request: any): boolean {
    return pull_request != null;
}

function isTag(ref: string): boolean { return ref.startsWith(TAG_REF) }

function isDefaultBranch(ref: string, default_branch: string): boolean { return ref === `${BRANCH_REF}${default_branch}`; }

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
