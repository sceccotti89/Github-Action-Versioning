# Semantic versioning action

This action generates a semantic versioning number based on the current branch and type of operation (push or pull_request).

## Inputs

```
default-branch
```

The default branch name. It's not required, and when not defined it's default value is *master*.

## Outputs

```
version
```

The generated version.

## Example usage

Add the following snippet into your workflow:

```
- name: Generate Version
  id: versioning
  uses: sceccotti89/Github-Action-Versioning@v1.0.4
- name: Get the output version
  run: echo "Version = ${{ steps.versioning.outputs.version }}"
```
