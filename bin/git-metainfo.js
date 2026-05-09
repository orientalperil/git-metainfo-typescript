#!/usr/bin/env node

import { getGitData, writeGitMetaInfo } from '../src/index.ts'

const args = process.argv.slice(2)
let output

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--output' || args[i] === '-o') {
    output = args[i + 1]
    i += 1
  }
}

const data = getGitData()
const json = JSON.stringify(data, null, 2)

if (output) {
  writeGitMetaInfo(output, data)
} else {
  process.stdout.write(`${json}\n`)
}
