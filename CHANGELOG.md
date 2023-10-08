# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [16.0.0](https://github.com/Phillip9587/nx-stylelint/compare/v16.0.0-beta.0...v16.0.0) (2023-10-08)

### Features

- add migration to bring stylelint-config-standard packages up to date ([c3292a9](https://github.com/Phillip9587/nx-stylelint/commit/c3292a9f4d43dcecaf14f6c7b19f066b38039314))
- added a scss option to the configuration generator and deprecated the scss generator ([06d70a4](https://github.com/Phillip9587/nx-stylelint/commit/06d70a49a41f4f293383e41b91f7ce3a48012cc2))

### Bug Fixes

- fixed root stylelint creation ([bb05744](https://github.com/Phillip9587/nx-stylelint/commit/bb05744551e75e501a82a68fa7ccfa66df0479f7))

## [16.0.0-beta.0](https://github.com/Phillip9587/nx-stylelint/compare/v15.0.0...v16.0.0-beta.0) (2023-10-08)

### ⚠ BREAKING CHANGES

- Support for Node.js v14, v16 and v19 has been removed.
- Support for Nx v15 has been removed

### Features

- drop support for Node.js 14, 16 and 19 ([e907b11](https://github.com/Phillip9587/nx-stylelint/commit/e907b1171cc0dc75fd431abe85bd02ba12324694))
- update to Nx 16 ([f9b6887](https://github.com/Phillip9587/nx-stylelint/commit/f9b6887ad6cc430e2bddb7002f07110a1e253ce2))

### Bug Fixes

- prevent generators crashing when no dependencies ([#511](https://github.com/Phillip9587/nx-stylelint/issues/511)) ([ee6e452](https://github.com/Phillip9587/nx-stylelint/commit/ee6e452c05f037c391228e4dc659975aafdccff7))

## [15.0.0](https://github.com/Phillip9587/nx-stylelint/compare/v15.0.0-beta.0...v15.0.0) (2023-02-16)

### Features

- export executor, generators and schemas ([d7e2a1c](https://github.com/Phillip9587/nx-stylelint/commit/d7e2a1c23ab58f9f6b14448908810afe47d7d3c2))

### Documentation

- update readme ([f9a8f5f](https://github.com/Phillip9587/nx-stylelint/commit/f9a8f5fe45afd8928f1f771a40153b84ef4433c5))

## [15.0.0-beta.0](https://github.com/Phillip9587/nx-stylelint/compare/v14.0.2...v15.0.0-beta.0) (2023-02-16)

### ⚠ BREAKING CHANGES

- support for stylelint < v15 has been removed
- Support for Nx v14 has been removed

### Features

- drop support for Nx v14 ([93f8af3](https://github.com/Phillip9587/nx-stylelint/commit/93f8af34d0ee7f2aa57c454ab8db1dcdde234378))
- support stylelint 15 ([00881ca](https://github.com/Phillip9587/nx-stylelint/commit/00881ca3ec28eccb47b15ea738f681eb96c0fbcf))
- support targetDefault and namedInputs ([1f7d436](https://github.com/Phillip9587/nx-stylelint/commit/1f7d4364ed3ac6b8fd7906000d227885f7b56355))

### Bug Fixes

- add migrate-to-inputs migration to migrations.json ([b9306d2](https://github.com/Phillip9587/nx-stylelint/commit/b9306d26ac4acad9c659bce823d64db7fe780cb5))
- use joinPathFragements in init generator ([d946641](https://github.com/Phillip9587/nx-stylelint/commit/d9466412f539fe9f6aa23f78232243d68cc901f6))

### Tests

- **e2e:** updated e2e tests ([34513e0](https://github.com/Phillip9587/nx-stylelint/commit/34513e0641c7ef95c405134dc598774f1b926f0d))
- fix failing executor tests ([92f4635](https://github.com/Phillip9587/nx-stylelint/commit/92f4635f835293e55bedd6049ea9ad607feb4687))

### [14.0.2](https://github.com/Phillip9587/nx-stylelint/compare/v14.0.1...v14.0.2) (2022-10-08)

### Bug Fixes

- remove peer dependency on @nrwl/workspace ([f74ebc1](https://github.com/Phillip9587/nx-stylelint/commit/f74ebc157973073b2260aeb3b8ca8eec5d8e819a))

### Tests

- **e2e:** fixed failing e2e test caused by nx making workspace.json otpional ([894793d](https://github.com/Phillip9587/nx-stylelint/commit/894793d526018893cb88f655bf1f72d6e3659da6))
- fix failing test related to Nx update ([0a398f4](https://github.com/Phillip9587/nx-stylelint/commit/0a398f45847a7a00a4becef88338d607e1196f60))

### [14.0.1](https://github.com/Phillip9587/nx-stylelint/compare/v14.0.0...v14.0.1) (2022-09-14)

### Bug Fixes

- **generator:** add `github` formatter to generator schema ([907b17c](https://github.com/Phillip9587/nx-stylelint/commit/907b17c35fc1e969982073ac8f2d2d03c27ad9de))

### Documentation

- add `github` formatter to `formatter` options ([f60e2d3](https://github.com/Phillip9587/nx-stylelint/commit/f60e2d35dc823e8ff507203bd2713ec83a880311))

## [14.0.0](https://github.com/Phillip9587/nx-stylelint/compare/v13.5.3...v14.0.0) (2022-09-13)

### ⚠ BREAKING CHANGES

- Support for Nx v12 and v13 has been removed
- Support for Stylelint < v14.10.0 has been removed.
- Support for Node.js v12 and v17 has been removed.

### Features

- drop support for Node.js 12 and 17 ([3ffe2b5](https://github.com/Phillip9587/nx-stylelint/commit/3ffe2b51383516a47afcb7970021e1b31d0b05ad))
- drop support for Nx v12 and v13 ([eb5b68b](https://github.com/Phillip9587/nx-stylelint/commit/eb5b68b4ed90c9fc9019c0e07924a6851108d3e1))
- drop support for Stylelint < v14.10.0 ([76533a2](https://github.com/Phillip9587/nx-stylelint/commit/76533a27a0b55efec68df50eebb9822b8752c417))
- updated tsconfig target version ([8bfc67a](https://github.com/Phillip9587/nx-stylelint/commit/8bfc67aeebddd716f9b244d282e95d92a50b2671))

### Bug Fixes

- **executor:** added github formatter to json schema ([fe33ddd](https://github.com/Phillip9587/nx-stylelint/commit/fe33dddd92e7f1bc4a188dbc3405482ea5f7b837))
- **init:** update stylelint version to ^14.10.0 ([1d6512f](https://github.com/Phillip9587/nx-stylelint/commit/1d6512fe164aa926c12e7f66495cb69ff6fa28c1))

### Documentation

- updated compatibility table ([0115b5f](https://github.com/Phillip9587/nx-stylelint/commit/0115b5fccbd0eadb2bbf8fc76b3d68ef8551f3a0))

### [13.5.3](https://github.com/Phillip9587/nx-stylelint/compare/v13.5.2...v13.5.3) (2022-08-19)

### Bug Fixes

- support all stylelint core formatters ([a8d3e48](https://github.com/Phillip9587/nx-stylelint/commit/a8d3e48b50dc2c766a4e37aee002c4863d48d0f6))

### Tests

- fix mocked stylelint result ([cef6c8a](https://github.com/Phillip9587/nx-stylelint/commit/cef6c8a339cb162b38c175276e6d03811d9ad4c5))

### [13.5.2](https://github.com/Phillip9587/nx-stylelint/compare/v13.5.1...v13.5.2) (2022-07-11)

### Bug Fixes

- **executor:** accept unplanned positional arguments ([5d7444e](https://github.com/Phillip9587/nx-stylelint/commit/5d7444e5f706fa636658fd5322bd2d7383710c1e))

### [13.5.1](https://github.com/Phillip9587/nx-stylelint/compare/v13.5.0...v13.5.1) (2022-07-04)

### Bug Fixes

- lower node requirement to 16.10 ([701dc78](https://github.com/Phillip9587/nx-stylelint/commit/701dc78ceebc14c1ecb951cb5098d448a7c7e196))
- Lower Node requirement to 16.10 ([cb147bf](https://github.com/Phillip9587/nx-stylelint/commit/cb147bf5d149671c01b39660687aca6e03127714))

## [13.5.0](https://github.com/Phillip9587/nx-stylelint/compare/v13.4.0...v13.5.0) (2022-06-22)

### Features

- migrate to latest stylelint-config-standard ([bf82bd8](https://github.com/Phillip9587/nx-stylelint/commit/bf82bd81ab5db432a63020a58eab7b0ff06d5d60))
- support new stylelint-config-\* versions ([c38bfad](https://github.com/Phillip9587/nx-stylelint/commit/c38bfad58b447f10b09c1eff0276011bc7d81b43))

## [13.4.0](https://github.com/Phillip9587/nx-stylelint/compare/v13.4.0-beta.1...v13.4.0) (2022-05-28)

## [13.4.0-beta.1](https://github.com/Phillip9587/nx-stylelint/compare/v13.4.0-beta.0...v13.4.0-beta.1) (2022-05-28)

### Tests

- fixed failing test after version update ([762505e](https://github.com/Phillip9587/nx-stylelint/commit/762505e29084148b2f472af31d04e1bc46907531))

## [13.4.0-beta.0](https://github.com/Phillip9587/nx-stylelint/compare/v13.3.0...v13.4.0-beta.0) (2022-05-28)

### Features

- support stylelint-config-standard-scss v4 ([a341755](https://github.com/Phillip9587/nx-stylelint/commit/a34175579eca7bb758ce88c419a34c4f386c2755))

### Bug Fixes

- update e2e jest config ([c46f7e0](https://github.com/Phillip9587/nx-stylelint/commit/c46f7e0b492d50481ef6f65296923e1c7362ac71))

### Refactorings

- simpler asset definition after Nx fixed it ([37b7a44](https://github.com/Phillip9587/nx-stylelint/commit/37b7a446dbda3198c7da5023af85933122920d81))

## [13.3.0](https://github.com/Phillip9587/nx-stylelint/compare/v13.2.1...v13.3.0) (2022-03-07)

### Features

- **generators:** export generators from index.ts ([3a2f428](https://github.com/Phillip9587/nx-stylelint/commit/3a2f4282cd5e8ea033cc830de0fd261c6e1a112e))

### [13.2.1](https://github.com/Phillip9587/nx-stylelint/compare/v13.2.0...v13.2.1) (2022-02-09)

### Documentation

- added a compatibility table ([bf3791c](https://github.com/Phillip9587/nx-stylelint/commit/bf3791c2c1c36775ae3b7d88caf1ac5d312e995d))
- changed headline and fixed typos ([9048ba5](https://github.com/Phillip9587/nx-stylelint/commit/9048ba5e27ae70f3024e384beea9f3a4e1a2a69c))

## [13.2.0](https://github.com/Phillip9587/nx-stylelint/compare/v13.2.0-beta.3...v13.2.0) (2022-01-27)

### Documentation

- add readme section for custom formatters ([df54d95](https://github.com/Phillip9587/nx-stylelint/commit/df54d9579762c6915ea10ec3a84a4109b2ecc854))

## [13.2.0-beta.3](https://github.com/Phillip9587/nx-stylelint/compare/v13.2.0-beta.2...v13.2.0-beta.3) (2022-01-27)

### Features

- **executor:** support local customFormatters and customFormatters from node_modules ([df06e55](https://github.com/Phillip9587/nx-stylelint/commit/df06e55ef0e54d425642446c17db211a100f3e34))

## [13.2.0-beta.2](https://github.com/Phillip9587/nx-stylelint/compare/v13.2.0-beta.1...v13.2.0-beta.2) (2022-01-27)

### Bug Fixes

- **executor:** use require.resolve for loadFormatters ([9e07bb4](https://github.com/Phillip9587/nx-stylelint/commit/9e07bb454ba2e85d227c4e00425e18a5422d503a))

## [13.2.0-beta.1](https://github.com/Phillip9587/nx-stylelint/compare/v13.2.0-beta.0...v13.2.0-beta.1) (2022-01-27)

## [13.2.0-beta.0](https://github.com/Phillip9587/nx-stylelint/compare/v13.1.2...v13.2.0-beta.0) (2022-01-27)

### Features

- **executor:** add `cache` and `cacheLocation` option ([1bb119d](https://github.com/Phillip9587/nx-stylelint/commit/1bb119d25e4918e0a15726c19b513c932d197be1))
- **executor:** add `ignoreDisables` option ([85a19e7](https://github.com/Phillip9587/nx-stylelint/commit/85a19e77c6ffeb4d3d3cd12dc34a63efdfc1f4f5))
- **executor:** add `ignorePath` option ([542581e](https://github.com/Phillip9587/nx-stylelint/commit/542581ec987e5f110173349a8a03d8a6e2bb44b4))
- **executor:** add `quiet` option ([1933307](https://github.com/Phillip9587/nx-stylelint/commit/193330752ced04a93d694b5134ae3fdb8cb02bf4))
- **executor:** add `reportInvalidScopeDisables` option ([0e5f465](https://github.com/Phillip9587/nx-stylelint/commit/0e5f46543c05ba04672b51b4cb35c49cef9e6df4))
- **executor:** add `reportNeedlessDisables` option ([1f3bc6e](https://github.com/Phillip9587/nx-stylelint/commit/1f3bc6e7b334d175b560b61e11094f29b13f8b0d))
- **executor:** add `reportNeedlessDisables` option ([d9bce5b](https://github.com/Phillip9587/nx-stylelint/commit/d9bce5b8e37b4ff31d68077c4f410a045955f4bc))
- **executor:** add support for custom formatters ([9e73921](https://github.com/Phillip9587/nx-stylelint/commit/9e739212849cdc8c146e6e0de5a71b39aa007081))

### Bug Fixes

- add stylelint-config-standard and stylelint-config-standard-scss as optional peer dpendencies ([091ed0c](https://github.com/Phillip9587/nx-stylelint/commit/091ed0cb464f7e5e69fa79f6a3b252a70a8da06d))
- **migrations:** fixed migrations so that optional dependencies are not always added to package.json ([9d836d4](https://github.com/Phillip9587/nx-stylelint/commit/9d836d411994617263bde832bf5a4a651fd4666a))

### Tests

- **e2e:** increase e2e test timeouts ([667e869](https://github.com/Phillip9587/nx-stylelint/commit/667e8698d0bc50584958b6102e423795d0cb2e8b))

### Documentation

- replaced link to nx target configuration ([85c4ddc](https://github.com/Phillip9587/nx-stylelint/commit/85c4ddc56636191aba02322e888eaf2a61035839))

### Refactorings

- **executor:** cleanup options and removed unnecessary test ([35c2045](https://github.com/Phillip9587/nx-stylelint/commit/35c2045a02df19fef8bebfd11a8ef73557262222))
- rename the config option to configFile to align with the stylelint nodejs API ([ea5c96a](https://github.com/Phillip9587/nx-stylelint/commit/ea5c96ace0c785ee95429c3678975bad5285e2f2))

### [13.1.2](https://github.com/Phillip9587/nx-stylelint/compare/v13.1.1...v13.1.2) (2022-01-24)

### Bug Fixes

- update generators to install newer versions of configs and stylelint and added migration ([9230df4](https://github.com/Phillip9587/nx-stylelint/commit/9230df4e9fb9fdc51385a96e99a61bd5daa597e1))

### [13.1.1](https://github.com/Phillip9587/nx-stylelint/compare/v13.1.0...v13.1.1) (2022-01-24)

### Bug Fixes

- **generators:** formatters util should not depend on stylelint ([c4f6761](https://github.com/Phillip9587/nx-stylelint/commit/c4f67618da4d8c618604a0b26875d467d9ab6afb))

## [13.1.0](https://github.com/Phillip9587/nx-stylelint/compare/v13.0.0...v13.1.0) (2021-12-06)

### Features

- **executor:** add the allow-empty-input option of stylelint ([05c4337](https://github.com/Phillip9587/nx-stylelint/commit/05c4337b5b7d24d5f8f4248b3fcc54ed99d0ba17))

### Tests

- increase test timeout to fix failing CI runs ([c44b0a1](https://github.com/Phillip9587/nx-stylelint/commit/c44b0a16888a3536fbede05a3fb40030e09ee046))

## [13.0.0](https://github.com/Phillip9587/nx-stylelint/compare/v13.0.0-beta.4...v13.0.0) (2021-11-15)

### Documentation

- added scss generator and ignore markdown files for CI runs ([e841f2d](https://github.com/Phillip9587/nx-stylelint/commit/e841f2d8214ca536332e46e4cce6414b50dc76ae))

## [13.0.0-beta.4](https://github.com/Phillip9587/nx-stylelint/compare/v13.0.0-beta.3...v13.0.0-beta.4) (2021-11-15)

### Bug Fixes

- **migrations:** always add the packages to package.json ([757c496](https://github.com/Phillip9587/nx-stylelint/commit/757c4962e51aa3a781fd67a7dad2ad5e12ca2467))

## [13.0.0-beta.3](https://github.com/Phillip9587/nx-stylelint/compare/v13.0.0-beta.2...v13.0.0-beta.3) (2021-11-15)

### Features

- added migration to remove config target option if it is in project root ([15862f3](https://github.com/Phillip9587/nx-stylelint/commit/15862f3271e58e63e80ac67821aac98f9dee5fe2))

## [13.0.0-beta.2](https://github.com/Phillip9587/nx-stylelint/compare/v13.0.0-beta.1...v13.0.0-beta.2) (2021-11-15)

### Features

- **executor:** let stylelint resolve config file when not explicitly defined in target config ([b46d88b](https://github.com/Phillip9587/nx-stylelint/commit/b46d88b7c530952df063c38596c1c92fa240a37a))

### Bug Fixes

- fixed glob patters for generated .stylelintrc.json configs ([d971ccb](https://github.com/Phillip9587/nx-stylelint/commit/d971ccbf6fecbf511944b82eddac0a688e5dafab))

## [13.0.0-beta.1](https://github.com/Phillip9587/nx-stylelint/compare/v13.0.0-beta.0...v13.0.0-beta.1) (2021-11-15)

### Bug Fixes

- add migrations.json to assets ([37f8889](https://github.com/Phillip9587/nx-stylelint/commit/37f888980f1f201868148746a5b1514f1b2a8c64))

## [13.0.0-beta.0](https://github.com/Phillip9587/nx-stylelint/compare/v12.3.1...v13.0.0-beta.0) (2021-11-15)

### ⚠ BREAKING CHANGES

- Stylelint 13 Support removed. Only Stylelint 14 supported.
- **nx-stylelint:lint executor:** Format option has been renamed to formatter to match stylelint.
- **nx-stylelint:configuration generator:** Format option has been renamed to formatter to match stylelint.
- **nx-stylelint:configuration generator:** Style option removed. Please use the `nx-stylelint:scss` generator to add scss support. Other syntaxes must be configured manually

### feature

- Stylelint 14 support ([e8ea536](https://github.com/Phillip9587/nx-stylelint/commit/e8ea5360a57fd9d6fa13bbf130d2353038c4a2d2)), closes [#146](https://github.com/Phillip9587/nx-stylelint/issues/146)

### [12.3.1](https://github.com/Phillip9587/nx-stylelint/compare/v12.3.0...v12.3.1) (2021-10-28)

### Bug Fixes

- updated stylelint peer dependency version to only support stylelint 13 ([499c4da](https://github.com/Phillip9587/nx-stylelint/commit/499c4daae14fe9eb22890a6c22874fe291818d26))
- **configuration:** fixed configuration generator removing all other targets of the project ([8a37fc3](https://github.com/Phillip9587/nx-stylelint/commit/8a37fc31cb26d2f04e9bf5f42785a09631b79669)), closes [#145](https://github.com/Phillip9587/nx-stylelint/issues/145)

## [12.3.0](https://github.com/Phillip9587/nx-stylelint/compare/v12.2.0...v12.3.0) (2021-09-17)

### Features

- **core:** update supported range of node version to only include LTS and current versions ([47deacc](https://github.com/Phillip9587/nx-stylelint/commit/47deacce731dbcc2071b336f7b13f000a0b13a2c))

### Bug Fixes

- should fix Nx using the architect instead of the executor ([f88cf42](https://github.com/Phillip9587/nx-stylelint/commit/f88cf4239e652a835f50ca8bb612919ad972987e)), closes [#110](https://github.com/Phillip9587/nx-stylelint/issues/110)

## [12.2.0](https://github.com/Phillip9587/nx-stylelint/compare/v12.1.2...v12.2.0) (2021-06-02)

### Features

- added schematics and builders support ([f0b1e19](https://github.com/Phillip9587/nx-stylelint/commit/f0b1e197a5fda8697342ee50320ff361424f5f77))

### Bug Fixes

- updated schema id to use field instead of the deprecated id field ([960844b](https://github.com/Phillip9587/nx-stylelint/commit/960844b36fd5852ee2f2e28599b1279c00c3026e))

### [12.1.2](https://github.com/Phillip9587/nx-stylelint/compare/v12.1.1...v12.1.2) (2021-06-01)

### Refactorings

- **configuration generator:** improve install step during configuration ([a1b2fc8](https://github.com/Phillip9587/nx-stylelint/commit/a1b2fc84b7c233dcc8c616797e20fe105b04392d))

### [12.1.1](https://github.com/Phillip9587/nx-stylelint/compare/v12.1.0...v12.1.1) (2021-06-01)

### Bug Fixes

- **configuration generator:** run install step during configuration ([fbe9be3](https://github.com/Phillip9587/nx-stylelint/commit/fbe9be3e21f7ebd15e474eeb7d4ade0d138a9878)), closes [#70](https://github.com/Phillip9587/nx-stylelint/issues/70)

## [12.1.0](https://github.com/Phillip9587/nx-stylelint/compare/v12.1.0-beta.0...v12.1.0) (2021-05-26)

### Documentation

- documented the style option of the configuration generator and fixed some typos ([eca9df8](https://github.com/Phillip9587/nx-stylelint/commit/eca9df89e3e8f4c5f1f38bebf55640992b521a33))

### Tests

- **e2e:** increase e2e test timeout from 60s to 90s ([3453993](https://github.com/Phillip9587/nx-stylelint/commit/34539938a9be9a95b938f2d56ea77595654e910a))

## [12.1.0-beta.0](https://github.com/Phillip9587/nx-stylelint/compare/v12.0.0...v12.1.0-beta.0) (2021-05-26)

### Features

- **configuration generator:** added a style option to the configuration generator ([ef5c0de](https://github.com/Phillip9587/nx-stylelint/commit/ef5c0de6e479e200de40016acc8c27c16472cb1f))
- added supported Node.js versions to package.json ([8915ebf](https://github.com/Phillip9587/nx-stylelint/commit/8915ebfa65168d3dc5ad7bec59c35d6fc7750c09))
- **configuration generator:** removed unnecessary usage of normalizePath ([b7076dd](https://github.com/Phillip9587/nx-stylelint/commit/b7076dd298c7d096f4a214a70d365578b14e6512))
- **nx:** enable smart analysis of configuration files ([0ba68aa](https://github.com/Phillip9587/nx-stylelint/commit/0ba68aa2cc90ca1a8247c0531fe21f1d3425d677))

### Bug Fixes

- **ci:** ensure that e2e matrix does not read from nx cache ([04c0cea](https://github.com/Phillip9587/nx-stylelint/commit/04c0ceac0322621d4335b06320fd6cac09b534d2))
- remove .gitkeep from generators directory ([0939290](https://github.com/Phillip9587/nx-stylelint/commit/0939290bc2fb61d5a79b4bb23ce0a8c6758c6de7))

### Documentation

- **readme:** fixed alignment of nx-stylelint logo and header area ([c1c05f8](https://github.com/Phillip9587/nx-stylelint/commit/c1c05f80b82ff53535c0f4140a1800897179a09a))

## [12.0.0](https://github.com/Phillip9587/nx-stylelint/compare/v11.2.1...v12.0.0) (2021-04-12)

### Features

- update peerDependency @nrwl/workspace to 12.0.0 ([0a2d9b7](https://github.com/Phillip9587/nx-stylelint/commit/0a2d9b740a7f85dbd07b155396cf1ccfe0aa4e5d))

### Bug Fixes

- **deps:** update dependency @nrwl/devkit to v12 ([#22](https://github.com/Phillip9587/nx-stylelint/issues/22)) ([dc07c2e](https://github.com/Phillip9587/nx-stylelint/commit/dc07c2e519f0cd26ac6482bcbd2296e5d4a828ba))

### [11.2.1](https://github.com/Phillip9587/nx-stylelint/compare/v11.2.0...v11.2.1) (2021-04-12)

### Bug Fixes

- **executor:** fixed executor maxWarnings option ([8baf5dd](https://github.com/Phillip9587/nx-stylelint/commit/8baf5dd9662b2d04b493c67a8df505fe11f81f3d))

### Documentation

- replaced align with style attribute and added alt attribute to img ([fa5be34](https://github.com/Phillip9587/nx-stylelint/commit/fa5be3484fe30bdb5863618ae613e6fd48cc2ab1))

## [11.2.0](https://github.com/Phillip9587/nx-stylelint/compare/v11.1.1...v11.2.0) (2021-03-22)

### Features

- **init:** should skip installation of dependencies needed for recommended configuration ([f627d06](https://github.com/Phillip9587/nx-stylelint/commit/f627d065a4fdc4304e3dc711eee3925af52ceaff))

### [11.1.1](https://github.com/Phillip9587/nx-stylelint/compare/v11.1.0...v11.1.1) (2021-03-22)

### Bug Fixes

- restore removed backslash from jest.config.js ([ebb804d](https://github.com/Phillip9587/nx-stylelint/commit/ebb804dfd3ad3f74228392d6b5b2f48366d87761))

### Documentation

- updated logo to display in github dark mode ([ea2a321](https://github.com/Phillip9587/nx-stylelint/commit/ea2a3216e9e32b5ae26a75d662e7c6e8beab70f8))

## [11.1.0](https://github.com/Phillip9587/nx-stylelint/compare/v11.0.0...v11.1.0) (2021-03-22)

### Features

- added the option to select a formatter to the configuration generator ([67c9ca7](https://github.com/Phillip9587/nx-stylelint/commit/67c9ca76594c29b78a51b248e5ead5de4c1985bf))

### Bug Fixes

- reduce bundle size by removing Changelog and test files ([009e1a1](https://github.com/Phillip9587/nx-stylelint/commit/009e1a1570a18606d1210fefe9292e8dbbff402f))
- removed somehow generated backslashes from configuration files ([96933cd](https://github.com/Phillip9587/nx-stylelint/commit/96933cd2ddf8f6067779d278aab9defb33719345))

## [11.0.0](https://github.com/Phillip9587/nx-stylelint/compare/v1.1.1...v11.0.0) (2021-03-20)

### [1.1.1](https://github.com/Phillip9587/nx-stylelint/compare/v1.1.0...v1.1.1) (2021-03-19)

### Bug Fixes

- fixed creation of the cacheableOperations in nx.json when not set before run and added tests ([3b27705](https://github.com/Phillip9587/nx-stylelint/commit/3b27705d96f5c3c63fa7aba29df966211e74a06a))

## [1.1.0](https://github.com/Phillip9587/nx-stylelint/compare/v1.0.2...v1.1.0) (2021-03-19)

### Features

- added init and configuration generators and renamed executor to lint ([f3748f8](https://github.com/Phillip9587/nx-stylelint/commit/f3748f86e3d148947148033dc6c920d1e4fb2451))

### Bug Fixes

- **generator:** fix typo in configuration generator schema ([91fca03](https://github.com/Phillip9587/nx-stylelint/commit/91fca03418cbf8de03519da7f52650fa0ad4edfb))

### [1.0.2](https://github.com/Phillip9587/nx-stylelint/compare/v1.0.1...v1.0.2) (2021-03-19)

### Bug Fixes

- **executor:** fixed the sucess status of the executor ([5814700](https://github.com/Phillip9587/nx-stylelint/commit/5814700ef4b60d87655c9287592065bcca770e7e))

### [1.0.1](https://github.com/Phillip9587/nx-stylelint/compare/v1.0.0...v1.0.1) (2021-03-19)

### Bug Fixes

- **readme:** removed README.md in nested folder ([f991936](https://github.com/Phillip9587/nx-stylelint/commit/f991936b9c8388ab86ec1fc1158c9f1d604b773a))

## 1.0.0 (2021-03-19)

### Bug Fixes

- **jest:** fixed deprecated jest tsConfig config entry ([483ece7](https://github.com/Phillip9587/nx-stylelint/commit/483ece7aa2d4cf4132a83b4ddb8fdcf6f4ee2f71))
