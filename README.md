# tslint-no-named-export
[![npm version](https://badge.fury.io/js/tslint-no-named-export.svg?t=1495378566925)](https://badge.fury.io/js/tslint-no-named-export)
[![CircleCI](https://circleci.com/gh/iyegoroff/tslint-no-named-export.svg?style=svg)](https://circleci.com/gh/iyegoroff/tslint-no-named-export)
[![Dependency Status](https://david-dm.org/iyegoroff/tslint-no-named-export.svg?t=1495378566925)](https://david-dm.org/iyegoroff/tslint-no-named-export)
[![devDependencies Status](https://david-dm.org/iyegoroff/tslint-no-named-export/dev-status.svg)](https://david-dm.org/iyegoroff/tslint-no-named-export?type=dev)
[![npm](https://img.shields.io/npm/l/express.svg?t=1495378566925)](https://www.npmjs.com/package/tslint-no-named-export)

Functions for representing plain objects as typesafe immutable dictionaries

## Getting started

`$ npm install tslint-no-named-export --save`

## Usage

```typescript
import { Dict, put, omit, toArray, dict } from 'tslint-no-named-export'

// explicitly initialize a Dict with plain object
const initial: Dict<number> = { key: 1 }
// or infer entry value type with dict function
const alt = dict({ key: 1 })

console.log(initial) // { key: 1 }
console.log(alt)     // { key: 1 }

// immutability
// ERROR - Index signature in type 'Dict<number>' only permits reading:
initial['test'] = 123
// ERROR - Index signature in type 'Dict<number>' only permits reading:
delete initial['key']

// type safety
// ERROR - Type 'number | undefined' is not assignable to type 'number':
const x: number = initial['test']
// OK:
const y: number | undefined = initial['test']

// create another Dict by adding an entry to existing Dict
const another = put(initial, 'test', 123)

console.log(another) // { key: 1, test: 123 }
console.log(initial) // { key: 1 }

// create new Dict by removing an entry from existing Dict
const newDict = omit(another, 'key')

console.log(newDict) // { test: 123 }
console.log(another) // { key: 1, test: 123 }

// converting Dict to readonly array
const arr = toArray(another)

console.log(arr) // [['key', 1], ['test', 123]]

// entries with undefined values will be removed from toArray result
const oops = dict({ key: 1, oops: undefined, test: 123 })

console.log(toArrray(oops)) // [['key', 1], ['test', 123]]

```
