#!/usr/bin/env node
import { getGitData, writeGitMetaInfo } from "./index.js"

const args = process.argv.slice(2)
let output: string | undefined
let includeIdentity = false

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === "--output" || args[i] === "-o") {
    output = args[i + 1]
    i += 1
  } else if (args[i] === "--include-identity") {
    includeIdentity = true
  }
}

const data = getGitData(includeIdentity)
const json = JSON.stringify(data, null, 2)

if (output) {
  writeGitMetaInfo(output, data)
} else {
  process.stdout.write(`${json}\n`)
}
