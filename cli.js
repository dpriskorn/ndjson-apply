#!/usr/bin/env node
const path = require('path')
const [ fnModulePath ] = process.argv.slice(2)

if (!fnModulePath) throw new Error('missing function module path')

const resolvedPath = path.resolve(fnModulePath)
const transformFn = require(resolvedPath)

if (typeof transformFn !== 'function') throw new Error(`${resolvedPath} doesn't export a function`)

const split = require('split')
const through = require('through')
const { isAsyncFunction } = require('./lib/utils')
const lineTransformers = require('./lib/line_transformers')

const transformer = isAsyncFunction(transformFn) ? lineTransformers.async : lineTransformers.sync

process.stdin
.pipe(split())
.pipe(through(transformer(transformFn)))
// .on('data', transformer(transformFn))
.pipe(process.stdout)
