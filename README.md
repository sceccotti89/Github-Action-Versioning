# Semantic versioning action

This action generates a semantic versioning number based on the current branch and type of operation.

## Outputs

### `version`

The generated version.

## Example usage

Add the following snippet into your workflow:

```
- name: Generate Version
  id: versioning
  uses: actions/Github-Action-Versioning@v1.0.0
- name: Get the output version
  run: echo "Version = ${{ steps.versioning.outputs.version }}"
```
