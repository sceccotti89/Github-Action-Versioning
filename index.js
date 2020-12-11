const core = require('@actions/core');
const github = require('@actions/github');

const version = '1.0.0';

try {
    console.log('Ref:', github.context.ref);
    
    //const payload = JSON.stringify(github.context.payload, undefined, 2);
    //console.log(`The event payload: ${payload}`);

    console.log('Branch: ', github.context.payload.ref);
    
    core.setOutput("version", '1.0.0');
} catch (error) {
    core.setFailed(error.message);
}