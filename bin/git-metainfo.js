#!/usr/bin/env node

import { writeGitMetaInfo } from '../src/index.js'

const output =
  process.argv[2] || 'git-metainfo.json'

const path = writeGitMetaInfo(output)

console.log(`Wrote ${path}`)
