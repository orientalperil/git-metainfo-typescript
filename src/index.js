import { execSync } from 'child_process'
import { mkdirSync, writeFileSync } from 'fs'
import { dirname } from 'path'

export class GitMetaInfoError extends Error {}

export class GitNotInstalledError extends GitMetaInfoError {}

export class NotGitRepositoryError extends GitMetaInfoError {}

function runGitCommand(command) {
  try {
    return execSync(command, {
      stdio: ['ignore', 'pipe', 'pipe']
    })
      .toString()
      .trim()

  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new GitNotInstalledError(
        'git executable was not found in PATH'
      )
    }

    const stderr = err.stderr
      ?.toString()
      .toLowerCase()

    if (
      stderr?.includes('not a git repository')
    ) {
      throw new NotGitRepositoryError(
        'current directory is not a git repository'
      )
    }

    throw new GitMetaInfoError(stderr)
  }
}

export function getGitData() {
  const branch = runGitCommand(
    'git rev-parse --abbrev-ref HEAD'
  )

  const detached = branch === 'HEAD'

  return {
    hash: runGitCommand(
      'git rev-parse HEAD'
    ),
    short_hash: runGitCommand(
      'git rev-parse --short HEAD'
    ),
    author_name: runGitCommand(
      'git log -1 --pretty=%an'
    ),
    author_email: runGitCommand(
      'git log -1 --pretty=%ae'
    ),
    author_date: runGitCommand(
      'git log -1 --pretty=%ai'
    ),
    author_date_iso: runGitCommand(
      'git log -1 --pretty=%aI'
    ),
    committer_name: runGitCommand(
      'git log -1 --pretty=%cn'
    ),
    committer_email: runGitCommand(
      'git log -1 --pretty=%ce'
    ),
    committer_date: runGitCommand(
      'git log -1 --pretty=%ci'
    ),
    committer_date_iso: runGitCommand(
      'git log -1 --pretty=%cI'
    ),
    message: runGitCommand(
      'git log -1 --pretty=%B'
    ),
    branch: detached ? null : branch,
    detached_head: detached
  }
}

export function writeGitMetaInfo(
  output = 'git-metainfo.json'
) {
  const data = getGitData()

  mkdirSync(dirname(output), {
    recursive: true
  })

  writeFileSync(
    output,
    JSON.stringify(data, null, 2)
  )

  return output
}
