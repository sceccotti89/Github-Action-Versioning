import * as core from '@actions/core';
import * as github from '@actions/github';
import { WebhookPayload } from '@actions/github/lib/interfaces';

const BASE_VERSION = '0.0.1';
const BRANCH_REF = 'refs/heads/';
const TAG_REF    = 'refs/tags/';

const PULL_REQUEST_BRANCH_NAME = /[a-zA-Z][a-zA-Z0-9_]*-\d+\.\d+\.\d+/;

try {
    const payload = JSON.stringify(github.context, undefined, 2);
    console.log(`The event payload: ${payload}`);

    const version = (isPullRequest(github.context.payload)) ? incrementPatchVersion(BASE_VERSION) : BASE_VERSION ;

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
} catch (error) {
    core.setFailed(error.message);
}

function isMainBranchOrTag(ref: string) {
    if (ref.startsWith(TAG_REF) || isMainBranch(ref)) {
        return true;
    }
    return false;
}

function isMainBranch(ref: string) { return ref.startsWith(`${BRANCH_REF}main`); }
function isDevelopBranch(ref: string) { return ref.startsWith(`${BRANCH_REF}develop`); }
function isReleaseBranch(ref: string) { return ref.startsWith(`${BRANCH_REF}release`); }

function isPullRequest(payload: WebhookPayload) {
    return payload.base_ref != null;
}

function extractVersionNumber(base_ref: string) {

}

function incrementPatchVersion(version: string) {
    const sub_versions = version.split('.').map(sub_version => +sub_version);
    sub_versions[2]++;
    return sub_versions.join('.');
}