<div style="text-align: center;" align="center">

# untiljs

Promised one-time watch for changes

[![NPM version][npm-image]][npm-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![tree shaking][tree-shaking-image]][tree-shaking-url]
![typescript][typescript-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![gzip][gzip-image]][gzip-url]
[![License][license-image]][license-url]

[![Sonar][sonar-image]][sonar-url]

</div>

<div style="text-align: center; margin-bottom: 20px;" align="center">

### **[Documentation](https://www.saqqdy.com/untiljs)** • **[Change Log](./CHANGELOG.md)**

**Read this in other languages: English | [简体中文](./README-zh_CN.md)**

</div>

- [untiljs](#untiljs)
  - [Experience online](#experience-online)
  - [Installation](#installation)
  - [Usage](#usage)
    - [1. Wait for some async data to be ready](#wait-for-some-async-data-to-be-ready)
    - [2. Wait for custom conditions](#wait-for-custom-conditions)
    - [3. Wait until timeout](#wait-until-timeout)
    - [4. More Examples](#more-xamples)
  - [Using unpkg CDN](#using-unpkg-cdn)
  - [Support & Issues](#support--issues)
  - [License](#license)

## Experience online

Experience the untiljs features online [Edit in CodeSandbox](https://codesandbox.io/p/sandbox/github/saqqdy/untiljs/tree/master/examples)

## Installing

```bash
# use pnpm
$ pnpm install untiljs

# use npm
$ npm install untiljs --save

# use yarn
$ yarn add untiljs
```

## Usage

### 1. Wait for some async data to be ready

```ts
import { ref } from 'vue'
import until from 'untiljs'

const val = ref(1)

setTimeout(() => {
  val.value = 2
}, 1000)
;(async () => {
  await until(val).toBe(2)
  // state is now ready
})()
```

### 2. Wait for custom conditions

```ts
import { ref } from 'vue'
import until from 'untiljs'

const val = ref(1)

setTimeout(() => {
  val.value = 2
}, 1000)
;(async () => {
  await until(val).toMatch(value => value > 1)
  // state is now ready
})()
```

### 3. Wait until timeout

```ts
import { ref } from 'vue'
import until from 'untiljs'

const val = ref(1)

setTimeout(() => {
  val.value = 2
}, 1000)
;(async () => {
  await until(val).not.toBe(ref(2), { timeout: 500, throwOnTimeout: true })
  // reject timeout
})()
```

### 4. More Examples

```ts
import { ref } from 'vue'
import until from 'untiljs'

const val = ref(1)

setTimeout(() => {
  val.value = 2
}, 1000)
;(async () => {
  await until(ref).toBe(true)
  await until(ref).toMatch(v => v > 5 && v < 10)
  await until(ref).changed()
  await until(ref).changedTimes(2)
  await until(ref).toBeTruthy()
  await until(ref).toBeNull()

  await until(ref).not.toBeNull()
  await until(ref).not.toBeTruthy()
})()
```

## Using unpkg CDN

```html
<script src="https://unpkg.com/vue-demi@latest/lib/index.iife.js"></script>
<script src="https://unpkg.com/untiljs@latest/dist/index.min.js"></script>
<script>
  await until(val).toBe(true)
  // ...
</script>
```

## Support & Issues

Please open an issue [here](https://github.com/saqqdy/untiljs/issues).

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/untiljs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/untiljs
[codacy-image]: https://app.codacy.com/project/badge/Grade/f70d4880e4ad4f40aa970eb9ee9d0696
[codacy-url]: https://www.codacy.com/gh/saqqdy/untiljs/dashboard?utm_source=github.com&utm_medium=referral&utm_content=saqqdy/untiljs&utm_campaign=Badge_Grade
[tree-shaking-image]: https://badgen.net/bundlephobia/tree-shaking/untiljs
[tree-shaking-url]: https://bundlephobia.com/package/untiljs
[typescript-url]: https://badgen.net/badge/icon/typescript?icon=typescript&label
[codecov-image]: https://img.shields.io/codecov/c/github/saqqdy/untiljs.svg?style=flat-square
[codecov-url]: https://codecov.io/github/saqqdy/untiljs?branch=master
[download-image]: https://img.shields.io/npm/dm/untiljs.svg?style=flat-square
[download-url]: https://npmjs.org/package/untiljs
[gzip-image]: http://img.badgesize.io/https://unpkg.com/untiljs/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS
[gzip-url]: http://img.badgesize.io/https://unpkg.com/untiljs/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS
[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: LICENSE
[sonar-image]: https://sonarcloud.io/api/project_badges/quality_gate?project=saqqdy_untiljs
[sonar-url]: https://sonarcloud.io/dashboard?id=saqqdy_untiljs
