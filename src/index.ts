import { execSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"

export class GitMetaInfoError extends Error {}
export class GitNotInstalledError extends GitMetaInfoError {}
export class NotGitRepositoryError extends GitMetaInfoError {}

function runGitCommand(command: string): string {
  try {
    return execSync(command, {
      stdio: ["ignore", "pipe", "pipe"],
    })
      .toString()
      .trim()
  } catch (error) {
    const err = error as NodeJS.ErrnoException & { stderr?: Buffer }

    if (err.code === "ENOENT") {
      throw new GitNotInstalledError("git executable was not found in PATH")
    }

    const stderr = err.stderr?.toString().toLowerCase()

    if (stderr?.includes("not a git repository")) {
      throw new NotGitRepositoryError("current directory is not a git repository")
    }

    throw new GitMetaInfoError(stderr)
  }
}

export interface GitData {
  hash: string
  short_hash: string
  author_name?: string
  author_email?: string
  author_date: string
  author_date_iso: string
  author_date_unix: string
  committer_name?: string
  committer_email?: string
  committer_date: string
  committer_date_iso: string
  committer_date_unix: string
  message: string
  branch: string | null
  detached_head: boolean
}

export function getGitData(includeIdentity = false): GitData {
  const branch = runGitCommand("git rev-parse --abbrev-ref HEAD")
  const detached = branch === "HEAD"

  return {
    hash: runGitCommand("git rev-parse HEAD"),
    short_hash: runGitCommand("git rev-parse --short HEAD"),
    ...(includeIdentity && {
      author_name: runGitCommand("git log -1 --pretty=%an"),
      author_email: runGitCommand("git log -1 --pretty=%ae"),
    }),
    author_date: runGitCommand("git log -1 --pretty=%ai"),
    author_date_iso: runGitCommand("git log -1 --pretty=%aI"),
    author_date_unix: runGitCommand("git log -1 --pretty=%at"),
    ...(includeIdentity && {
      committer_name: runGitCommand("git log -1 --pretty=%cn"),
      committer_email: runGitCommand("git log -1 --pretty=%ce"),
    }),
    committer_date: runGitCommand("git log -1 --pretty=%ci"),
    committer_date_iso: runGitCommand("git log -1 --pretty=%cI"),
    committer_date_unix: runGitCommand("git log -1 --pretty=%ct"),
    message: runGitCommand("git log -1 --pretty=%B"),
    branch: detached ? null : branch,
    detached_head: detached,
  }
}

export function writeGitMetaInfo(output: string, data: GitData): void {
  mkdirSync(dirname(output), {
    recursive: true,
  })

  writeFileSync(output, JSON.stringify(data, null, 2))
}
