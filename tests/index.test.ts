import { execSync } from "child_process"
import {
  getGitData,
  GitMetaInfoError,
  GitNotInstalledError,
  NotGitRepositoryError,
} from "../src/index.js"
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest"

vi.mock("child_process", () => ({
  execSync: vi.fn(),
}))

const mockReturns = (fn: Mock, values: string[]): void => {
  values.forEach((value) => {
    fn.mockReturnValueOnce(Buffer.from(value))
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("git-metainfo", () => {
  it("handles missing git", () => {
    ;(execSync as Mock).mockImplementation(() => {
      const err = new Error("missing") as Error & {
        code: string
      }
      err.code = "ENOENT"
      throw err
    })

    expect(() => getGitData()).toThrow(GitNotInstalledError)
  })

  it("handles non git repo", () => {
    ;(execSync as Mock).mockImplementation(() => {
      const err = new Error("bad repo") as Error & {
        stderr: Buffer
      }

      err.stderr = Buffer.from("fatal: not a git repository")

      throw err
    })

    expect(() => getGitData()).toThrow(NotGitRepositoryError)
  })

  it("handles detached HEAD", () => {
    mockReturns(execSync as Mock, [
      "HEAD",
      "abc123",
      "abc123",
      "John",
      "john@john.com",
      "2026-01-01 00:00:00 +0000",
      "2026-01-01T00:00:00Z",
      "John",
      "john@john.com",
      "2026-01-01 00:00:00 +0000",
      "2026-01-01T00:00:00Z",
      "test commit",
    ])

    const data = getGitData()

    expect(data.detached_head).toBe(true)

    expect(data.branch).toBe(null)
  })

  it("handles normal branch", () => {
    mockReturns(execSync as Mock, [
      "master",
      "abc123",
      "abc123",
      "John",
      "john@john.com",
      "2026-01-01 00:00:00 +0000",
      "2026-01-01T00:00:00Z",
      "John",
      "john@john.com",
      "2026-01-01 00:00:00 +0000",
      "2026-01-01T00:00:00Z",
      "test commit",
    ])

    const data = getGitData()

    expect(data.detached_head).toBe(false)

    expect(data.branch).toBe("master")
  })

  it("handles unknown git errors", () => {
    ;(execSync as Mock).mockImplementation(() => {
      const err = new Error("weird") as Error & {
        stderr: Buffer
      }

      err.stderr = Buffer.from("some other git error")

      throw err
    })

    expect(() => getGitData()).toThrow(GitMetaInfoError)
  })
})
