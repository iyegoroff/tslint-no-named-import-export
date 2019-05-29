# tslint-no-named-export
[![npm version](https://badge.fury.io/js/tslint-no-named-export.svg?t=1495378566925)](https://badge.fury.io/js/tslint-no-named-export)
[![CircleCI](https://circleci.com/gh/iyegoroff/tslint-no-named-export.svg?style=svg)](https://circleci.com/gh/iyegoroff/tslint-no-named-export)
[![Dependency Status](https://david-dm.org/iyegoroff/tslint-no-named-export.svg?t=1495378566925)](https://david-dm.org/iyegoroff/tslint-no-named-export)
[![devDependencies Status](https://david-dm.org/iyegoroff/tslint-no-named-export/dev-status.svg)](https://david-dm.org/iyegoroff/tslint-no-named-export?type=dev)
[![npm](https://img.shields.io/npm/l/express.svg?t=1495378566925)](https://www.npmjs.com/package/tslint-no-named-export)

Disallows named exports in ES6-style modules just like [eslint-plugin-import/no-named-export](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-export.md).
Can be used to mimic "module interface" with default export.

## Getting started

`$ npm i tslint-no-named-export -D`

## Usage

```json
  // tslint.json
  "extends": [
    "tslint-no-named-export"
  ],
  ...
```

Since using default exports is widely considered a bad practice this rule should be enabled per file rather than in tslint.json

```typescript
// tslint:enable:no-named-export
```
