const core = require('@actions/core');
const github = require('@actions/github');

const version = '1.0.0';
const BRANCH_REF = 'ref/heads/';
const TAG_REF    = 'ref/tags/';

try {
    const payload = JSON.stringify(github.context, undefined, 2);
    console.log(`The event payload: ${payload}`);

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