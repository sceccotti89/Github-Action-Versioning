const core = require('@actions/core');
const github = require('@actions/github');

try {
  core.setOutput("version", '1.0.0');

  console.log(`Ref:`, github.context.ref);

  const payload = JSON.stringify(github.context, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}