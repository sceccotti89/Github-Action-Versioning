const core = require('@actions/core');
const github = require('@actions/github');

const version = '1.0.0';

try {
    //const payload = JSON.stringify(github.context.payload, undefined, 2);
    //console.log(`The event payload: ${payload}`);

    const ref = github.context.ref;
    const branch = ref.substr(ref.lastIndexOf('/') + 1);
    console.log('Branch:', branch);
    
    const finalVersion = `${branch}-${version}`;

    core.setOutput("version", finalVersion);
} catch (error) {
    core.setFailed(error.message);
}