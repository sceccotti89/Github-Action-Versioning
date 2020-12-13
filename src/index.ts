import * as core from '@actions/core';
import * as github from '@actions/github';
import process, { ProcessResult } from './main'

const DEFAULT_BRANCH = 'master';

const default_branch = core.getInput('default-branch') || DEFAULT_BRANCH;
const result: ProcessResult = process(github, default_branch);
if (result.error) {
    core.setFailed(result.error);
} else {
    core.setOutput('version', result.version);
}
