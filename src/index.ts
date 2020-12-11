import * as core from '@actions/core';
import * as github from '@actions/github';

const BASE_VERSION = '0.0.1';
const BRANCH_REF = 'refs/heads/';
const TAG_REF    = 'refs/tags/';

const TAG_REF_REGEX = /\d+\.\d+\.\d+/;
const PULL_REQUEST_BRANCH_NAME_REGEX = /[a-zA-Z][a-zA-Z0-9_]*-(\d+\.\d+\.\d+)/g;

try {
    // const payload = JSON.stringify(github.context, undefined, 2);
    // console.log(`The event payload: ${payload}`);

    //const base_ref: string = github.context.payload.base_ref;
    const base_ref: string = 'refs/heads/release/first-1.0.0';
    if (isPullRequest(base_ref)) {
        if (!base_ref.substr(base_ref.lastIndexOf('/') + 1).match(PULL_REQUEST_BRANCH_NAME_REGEX)) {
            core.setFailed('Invalid source branch name. Please follow the following regex for naming: ' + PULL_REQUEST_BRANCH_NAME_REGEX);
        } else {
            const version = extractVersionNumber(base_ref);
        
            const ref = github.context.ref;
            const sha = github.context.sha.substr(0, 8);
            let version_name = '';
        
            if (isMainBranchOrTag(ref)) {
                version_name = `${version}`;
            } else {
                const branch = ref.substr(ref.indexOf(BRANCH_REF) + 1);
                version_name = `${branch}-${version}-${sha}`;
            }
        
            core.setOutput("version", version_name);
        }
    } else {
        // TODO
        core.setOutput("version", BASE_VERSION);
    }

} catch (error) {
    core.setFailed(error.message);
}

function isMainBranchOrTag(ref: string) {
    if (ref.startsWith(TAG_REF) || isMainBranch(ref)) {
        return true;
    }
    return false;
}

function isTag(ref: string) { return ref.startsWith(TAG_REF); }
function isMainBranch(ref: string) { return ref.startsWith(`${BRANCH_REF}main`); }
function isDevelopBranch(ref: string) { return ref.startsWith(`${BRANCH_REF}develop`); }
function isReleaseBranch(ref: string) { return ref.startsWith(`${BRANCH_REF}release`); }

function isPullRequest(base_ref: string) {
    return base_ref != null;
}

function extractVersionNumber(base_ref: string): string {
    const sub_base_ref = base_ref.substr(base_ref.lastIndexOf('/') + 1);
    const groups = sub_base_ref.match(PULL_REQUEST_BRANCH_NAME_REGEX);
    if (groups) {
        return groups[1];
    }
    return BASE_VERSION;
}