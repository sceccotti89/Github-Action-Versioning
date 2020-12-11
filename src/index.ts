import * as core from '@actions/core';
import * as github from '@actions/github';
import process, { ProcessResult } from './main'

const result: ProcessResult = process(github);
if (result.error) {
    core.setFailed(result.error);
} else {
    core.setOutput('version', result.version);
}
