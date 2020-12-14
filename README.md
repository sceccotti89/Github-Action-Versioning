# Semantic versioning action

This action generates a semantic versioning number based on the current branch and type of operation (push or pull_request).

## Example usage

Add the following snippet into your workflow:

```
- name: Generate Version
  id: versioning
  uses: sceccotti89/Github-Action-Versioning@v1.0.5
- name: Get the output version
  run: echo "Version = ${{ steps.versioning.outputs.version }}"
```

### Output

|  Operation   | Branch | Output |
| ------------ | ------ | ------ |
| Push         | any    | \<branch\>-\<sha\> |
| Tag          | any    | \<branch\>-\<tag\> |
| Pull Request | <ul><li>\<source-branch\>-\<semver-number\></li><li>otherwise</li></ul> | <ul><li>\<destination-branch\>-\<semver-number\>-\<sha\></li><li>\<destination-branch\>-\<sha\></li></ul> |