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

- Push Operation

```
<branch>-<sha>
```

- Tagging

```
<source-branch>-<tag>-<sha>
```

- Pull Request

If the source branch follows this structure:

```
<source-branch>-<semver-number>-<sha>
```

then the resulting version would be:

```
<destination-branch>-<semver-number>-<sha>
```

otherwise:

```
<destination-branch>-<sha>
```