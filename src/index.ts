import * as core from '@actions/core';
import * as github from '@actions/github';

const BASE_VERSION = '0.0.1';
const BRANCH_REF = 'refs/heads/';
const PULL_REQUEST_SOURCE_BRANCH_NAME_REGEX = /[a-zA-Z][a-zA-Z0-9_]*-(\d+\.\d+\.\d+)/;

try {
    // const payload = JSON.stringify(github.context, undefined, 2);
    // console.log(`The event payload: ${payload}`);

    const base_ref: string = github.context.payload.base_ref;
    if (isPullRequest(base_ref)) {
        const source_branch = extractBranchNameFromRef(base_ref);
        if (!source_branch.match(PULL_REQUEST_SOURCE_BRANCH_NAME_REGEX)) {
            core.setFailed('Invalid source branch name. Please follow the following regex for naming: ' + PULL_REQUEST_SOURCE_BRANCH_NAME_REGEX);
        } else {
            const version = extractVersionNumber(base_ref);
        
            const ref = github.context.ref;
            const sha = github.context.sha.substr(0, 8);
            let version_name;

            if (isMainBranch(ref)) {
                version_name = `${version}`;
            } else {
                const branch = extractBranchNameFromRef(ref);
                if (isReleaseBranch(ref) || isDevelopBranch(ref) || isFeatureBranch(ref)) {
                    version_name = `${branch}-${version}-${sha}`;
                } else {
                    core.setFailed('Unrecognized branch name: ' + branch);
                }
            }
        
            if (version_name) {
                core.setOutput('version', version_name);
            }
        }
    } else {
        const ref = github.context.ref;
        const branch = extractBranchNameFromRef(ref);
        const sha = github.context.sha.substr(0, 8);
        core.setOutput("version", `${branch}-${sha}`);
    }

} catch (error) {
    core.setFailed(error.message);
}

function isMainBranch(ref: string): boolean { return ref.startsWith(`${BRANCH_REF}main`); }
function isReleaseBranch(ref: string): boolean { return ref.startsWith(`${BRANCH_REF}release`); }
function isDevelopBranch(ref: string): boolean { return ref.startsWith(`${BRANCH_REF}develop`); }
function isFeatureBranch(ref: string): boolean { return ref.startsWith(`${BRANCH_REF}release`); }

function isPullRequest(base_ref: string): boolean {
    return base_ref != null;
}

function extractBranchNameFromRef(ref: string): string {
    return ref.substr(ref.lastIndexOf('/') + 1);
}

function extractVersionNumber(base_ref: string): string {
    const sub_base_ref = base_ref.substr(base_ref.lastIndexOf('/') + 1);
    const groups = sub_base_ref.match(PULL_REQUEST_SOURCE_BRANCH_NAME_REGEX);
    return groups ? groups[1] : BASE_VERSION;
}
