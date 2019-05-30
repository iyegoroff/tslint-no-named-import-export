# tslint-no-named-import-export
[![npm version](https://badge.fury.io/js/tslint-no-named-import-export.svg?t=1495378566925)](https://badge.fury.io/js/tslint-no-named-import-export)
[![CircleCI](https://circleci.com/gh/iyegoroff/tslint-no-named-import-export.svg?style=svg)](https://circleci.com/gh/iyegoroff/tslint-no-named-import-export)
[![Dependency Status](https://david-dm.org/iyegoroff/tslint-no-named-import-export.svg?t=1495378566925)](https://david-dm.org/iyegoroff/tslint-no-named-import-export)
[![devDependencies Status](https://david-dm.org/iyegoroff/tslint-no-named-import-export/dev-status.svg)](https://david-dm.org/iyegoroff/tslint-no-named-import-export?type=dev)
[![npm](https://img.shields.io/npm/l/express.svg?t=1495378566925)](https://www.npmjs.com/package/tslint-no-named-import-export)

Disallows named imports and exports in ES6-style modules.
Can be used to mimic "module interface".

## Getting started

`$ npm i tslint-no-named-import-export -D`

## Usage

Specify affected files/modules with regex pattern or list of patterns:

```json
  // tslint.json
  "extends": [
    "tslint-no-named-import-export"
  ],
  "rules": {
    "no-named-export": [true, "^view\\.(native|web|ios|android)\\.tsx?$"],
    "no-named-import": [true, "^view$"]
    ...
  }
  ...
```
