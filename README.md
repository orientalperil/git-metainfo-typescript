# git-metainfo

## Generate git metadata JSON

Output git metadata:

By default, author and committer names and emails are omitted:

```bash
$ git-metainfo
{
  "hash": "40b71138b4ef89496645e377008e11eedbe207d6",
  "short_hash": "40b7113",
  "author_date": "2026-05-08 22:06:47 -0700",
  "author_date_iso": "2026-05-08T22:06:47-07:00",
  "committer_date": "2026-05-08 22:06:47 -0700",
  "committer_date_iso": "2026-05-08T22:06:47-07:00",
  "message": "Code",
  "branch": "master",
  "detached_head": false
}
```

Include names and emails with `--include-identity`:

```bash
$ git-metainfo --include-identity
{
  "hash": "40b71138b4ef89496645e377008e11eedbe207d6",
  "short_hash": "40b7113",
  "author_name": "John Doe",
  "author_email": "john@doe.com",
  "author_date": "2026-05-08 22:06:47 -0700",
  "author_date_iso": "2026-05-08T22:06:47-07:00",
  "committer_name": "John Doe",
  "committer_email": "john@doe.com",
  "committer_date": "2026-05-08 22:06:47 -0700",
  "committer_date_iso": "2026-05-08T22:06:47-07:00",
  "message": "Code",
  "branch": "master",
  "detached_head": false
}
```

Output to a file:

`git-metainfo --output file.json`

Use as library:

```typescript
import { getGitData, GitData } from "git-metainfo"

const data: GitData = getGitData()

// Include author and committer names and emails
const dataWithIdentity: GitData = getGitData(true)
```

# See also:

[Python version](https://github.com/orientalperil/git-metainfo-python)
