const core = require('@actions/core');
const github = require('@actions/github');

const BASE_VERSION = '1.0.0';
const BRANCH_REF = 'refs/heads/';
const TAG_REF    = 'refs/tags/';

try {
    const payload = JSON.stringify(github.context, undefined, 2);
    console.log(`The event payload: ${payload}`);

    console.log('NEW VERSION:', incrementPatchVersion(BASE_VERSION));
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

function isMainBranchOrTag (ref) {
    if (ref.startsWith(TAG_REF) || (ref.startsWith(BRANCH_REF) && ref.startsWith(`${BRANCH_REF}main`))) {
        return true;
    }
    return false;
}

function isPullRequest(payload) {
    return payload.base_ref != null;
}

function incrementPatchVersion(version) {
    const sub_versions = version.split('.').map(sub_version => +sub_version);
    sub_versions[2]++;
    return sub_versions.join('.');
}