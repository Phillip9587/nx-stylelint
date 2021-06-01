# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [12.1.1](https://github.com/Phillip9587/nx-stylelint/compare/v12.1.0...v12.1.1) (2021-06-01)


### Bug Fixes

* **configuration generator:** run install step during configuration ([fbe9be3](https://github.com/Phillip9587/nx-stylelint/commit/fbe9be3e21f7ebd15e474eeb7d4ade0d138a9878)), closes [#70](https://github.com/Phillip9587/nx-stylelint/issues/70)


### Others

* **deps:** update dependency @nrwl/nx-cloud to v12.1.3 ([#65](https://github.com/Phillip9587/nx-stylelint/issues/65)) ([bc6d58e](https://github.com/Phillip9587/nx-stylelint/commit/bc6d58e62abe74e5a8c69825840bf1bc58929ec5))
* **deps:** update dependency @types/stylelint to v13 ([#68](https://github.com/Phillip9587/nx-stylelint/issues/68)) ([3338f12](https://github.com/Phillip9587/nx-stylelint/commit/3338f128d837d128aa39f0823305e9d1e9904544))
* **deps:** update nrwl monorepo to v12.3.5 ([#67](https://github.com/Phillip9587/nx-stylelint/issues/67)) ([4d122dc](https://github.com/Phillip9587/nx-stylelint/commit/4d122dc5ad8d620a709ea866d45cc2b631b25f0d))
* **deps:** update typescript-eslint monorepo to v4.26.0 ([#60](https://github.com/Phillip9587/nx-stylelint/issues/60)) ([f4ea276](https://github.com/Phillip9587/nx-stylelint/commit/f4ea2765968debe55b0b58731be990f0589b729e))

## [12.1.0](https://github.com/Phillip9587/nx-stylelint/compare/v12.1.0-beta.0...v12.1.0) (2021-05-26)


### Documentation

* documented the style option of the configuration generator and fixed some typos ([eca9df8](https://github.com/Phillip9587/nx-stylelint/commit/eca9df89e3e8f4c5f1f38bebf55640992b521a33))


### Tests

* **e2e:** increase e2e test timeout from 60s to 90s ([3453993](https://github.com/Phillip9587/nx-stylelint/commit/34539938a9be9a95b938f2d56ea77595654e910a))


### Others

* **changelog:** updated conventional changelog configuration to show additional sections ([1b1845f](https://github.com/Phillip9587/nx-stylelint/commit/1b1845f15dcb091e86533753bb695798034bdba1))

## [12.1.0-beta.0](https://github.com/Phillip9587/nx-stylelint/compare/v12.0.0...v12.1.0-beta.0) (2021-05-26)


### Features

* **configuration generator:** added a style option to the configuration generator ([ef5c0de](https://github.com/Phillip9587/nx-stylelint/commit/ef5c0de6e479e200de40016acc8c27c16472cb1f))
* added supported Node.js versions to package.json ([8915ebf](https://github.com/Phillip9587/nx-stylelint/commit/8915ebfa65168d3dc5ad7bec59c35d6fc7750c09))
* **configuration generator:** removed unnecessary usage of normalizePath ([b7076dd](https://github.com/Phillip9587/nx-stylelint/commit/b7076dd298c7d096f4a214a70d365578b14e6512))
* **nx:** enable smart analysis of configuration files ([0ba68aa](https://github.com/Phillip9587/nx-stylelint/commit/0ba68aa2cc90ca1a8247c0531fe21f1d3425d677))


### Bug Fixes

* **ci:** ensure that e2e matrix does not read from nx cache ([04c0cea](https://github.com/Phillip9587/nx-stylelint/commit/04c0ceac0322621d4335b06320fd6cac09b534d2))
* remove .gitkeep from generators directory ([0939290](https://github.com/Phillip9587/nx-stylelint/commit/0939290bc2fb61d5a79b4bb23ce0a8c6758c6de7))


### Documentation

* **readme:** fixed alignment of nx-stylelint logo and header area ([c1c05f8](https://github.com/Phillip9587/nx-stylelint/commit/c1c05f80b82ff53535c0f4140a1800897179a09a))


### Others

* **deps:** update dependency @nrwl/nx-cloud to v12 ([#37](https://github.com/Phillip9587/nx-stylelint/issues/37)) ([8a86f35](https://github.com/Phillip9587/nx-stylelint/commit/8a86f352758493e0f5c0612a7a823e78f4f9fe51))
* **deps:** update dependency @nrwl/nx-cloud to v12.0.2 ([#39](https://github.com/Phillip9587/nx-stylelint/issues/39)) ([0039fcc](https://github.com/Phillip9587/nx-stylelint/commit/0039fccde5cfae2eb8349cff2bf76cb185231276))
* **deps:** update dependency @nrwl/nx-cloud to v12.1.1 ([#55](https://github.com/Phillip9587/nx-stylelint/issues/55)) ([330b78f](https://github.com/Phillip9587/nx-stylelint/commit/330b78f742a80ca6dc3c0aed53c1c91730b3d900))
* **deps:** update dependency @nrwl/nx-cloud to v12.1.2 ([#61](https://github.com/Phillip9587/nx-stylelint/issues/61)) ([b55bf28](https://github.com/Phillip9587/nx-stylelint/commit/b55bf280a2392ed51264cab47a0113611ba5694c))
* **deps:** update dependency @types/jest to v26.0.23 ([#36](https://github.com/Phillip9587/nx-stylelint/issues/36)) ([501fffa](https://github.com/Phillip9587/nx-stylelint/commit/501fffad9df9567e4c162cfb7c4817351e784d7d))
* **deps:** update dependency @types/node to v14.14.41 ([#29](https://github.com/Phillip9587/nx-stylelint/issues/29)) ([44e752c](https://github.com/Phillip9587/nx-stylelint/commit/44e752ce1ae438b6ca58a0289a32eae6a998113b))
* **deps:** update dependency @types/node to v14.14.44 ([#38](https://github.com/Phillip9587/nx-stylelint/issues/38)) ([8fdfd58](https://github.com/Phillip9587/nx-stylelint/commit/8fdfd5845eaf048323fcaaef8e506f21c17b62ac))
* **deps:** update dependency @types/node to v14.17.0 ([#54](https://github.com/Phillip9587/nx-stylelint/issues/54)) ([adc7589](https://github.com/Phillip9587/nx-stylelint/commit/adc758900be34cb40622946c679ae295a102e29e))
* **deps:** update dependency @types/node to v14.17.1 ([#62](https://github.com/Phillip9587/nx-stylelint/issues/62)) ([35a7d79](https://github.com/Phillip9587/nx-stylelint/commit/35a7d791863e295abf0b6523bb53198177131cff))
* **deps:** update dependency commitizen to v4.2.4 ([#49](https://github.com/Phillip9587/nx-stylelint/issues/49)) ([593ebc4](https://github.com/Phillip9587/nx-stylelint/commit/593ebc4b843819f8a1d4c421f8748ae333e30061))
* **deps:** update dependency eslint to v7.25.0 ([#33](https://github.com/Phillip9587/nx-stylelint/issues/33)) ([290a059](https://github.com/Phillip9587/nx-stylelint/commit/290a0592ba5130eaaa7805d1dfc89356efc6e712))
* **deps:** update dependency eslint to v7.26.0 ([#50](https://github.com/Phillip9587/nx-stylelint/issues/50)) ([2a2eba4](https://github.com/Phillip9587/nx-stylelint/commit/2a2eba4795b6a4bbfe23a80f41cdbbd729e44a8c))
* **deps:** update dependency eslint to v7.27.0 ([#58](https://github.com/Phillip9587/nx-stylelint/issues/58)) ([5afe3f6](https://github.com/Phillip9587/nx-stylelint/commit/5afe3f6e54e9e028e6657087c893cd273676c98b))
* **deps:** update dependency eslint-config-prettier to v8.2.0 ([#27](https://github.com/Phillip9587/nx-stylelint/issues/27)) ([93720bd](https://github.com/Phillip9587/nx-stylelint/commit/93720bd56792225fd4390ea95319bd6e0bd124ee))
* **deps:** update dependency eslint-config-prettier to v8.3.0 ([#34](https://github.com/Phillip9587/nx-stylelint/issues/34)) ([dfdb959](https://github.com/Phillip9587/nx-stylelint/commit/dfdb9598e382e2148537bbc682d2eca2d85536d3))
* **deps:** update dependency stylelint to v13.13.0 ([#35](https://github.com/Phillip9587/nx-stylelint/issues/35)) ([07889c6](https://github.com/Phillip9587/nx-stylelint/commit/07889c60fff356f98502312f3a0dcd537a4fa635))
* **deps:** update dependency ts-jest to v26.5.5 ([#30](https://github.com/Phillip9587/nx-stylelint/issues/30)) ([6c13f48](https://github.com/Phillip9587/nx-stylelint/commit/6c13f48153955a1ad755e0a72a1682efb76d0187))
* **deps:** update nrwl monorepo to v12.0.3 ([#26](https://github.com/Phillip9587/nx-stylelint/issues/26)) ([9c3dcfd](https://github.com/Phillip9587/nx-stylelint/commit/9c3dcfd076962b376657ffaaae3cd00225ca8cef))
* **deps:** update nrwl monorepo to v12.0.7 ([#28](https://github.com/Phillip9587/nx-stylelint/issues/28)) ([d53a5f5](https://github.com/Phillip9587/nx-stylelint/commit/d53a5f52388d7a61e90f03494b5022b8736b95b7))
* **deps:** update nrwl monorepo to v12.1.0 ([cfc9ec4](https://github.com/Phillip9587/nx-stylelint/commit/cfc9ec4859cd37b6006507ef076405d0ed5a2bad))
* **deps:** update nrwl monorepo to v12.3.3 ([98e8cd5](https://github.com/Phillip9587/nx-stylelint/commit/98e8cd51fc1877858bdc486b787e9642d31c3c96))
* **deps:** update nrwl monorepo to v12.3.4 ([#31](https://github.com/Phillip9587/nx-stylelint/issues/31)) ([6e55f7b](https://github.com/Phillip9587/nx-stylelint/commit/6e55f7b3a03316b3174d88a7566b022b43bb3a5f))
* **deps:** update typescript-eslint monorepo to v4.22.0 ([#25](https://github.com/Phillip9587/nx-stylelint/issues/25)) ([6798072](https://github.com/Phillip9587/nx-stylelint/commit/6798072f5e9ee90b4222096caf3f738008c63233))
* **deps:** update typescript-eslint monorepo to v4.22.1 ([#41](https://github.com/Phillip9587/nx-stylelint/issues/41)) ([c993afa](https://github.com/Phillip9587/nx-stylelint/commit/c993afa21d28dfb8b83cdd12137e55c446050c30))
* **deps:** update typescript-eslint monorepo to v4.24.0 ([#52](https://github.com/Phillip9587/nx-stylelint/issues/52)) ([c40f94b](https://github.com/Phillip9587/nx-stylelint/commit/c40f94bb7a97de5ae83662130b38393a42eb3277))
* **deps:** updated dependencies ([9ad6b6a](https://github.com/Phillip9587/nx-stylelint/commit/9ad6b6a143bfe9076ad96951067c6a544d35ef11))

## [12.0.0](https://github.com/Phillip9587/nx-stylelint/compare/v11.2.1...v12.0.0) (2021-04-12)


### Features

* update peerDependency @nrwl/workspace to 12.0.0 ([0a2d9b7](https://github.com/Phillip9587/nx-stylelint/commit/0a2d9b740a7f85dbd07b155396cf1ccfe0aa4e5d))


### Bug Fixes

* **deps:** update dependency @nrwl/devkit to v12 ([#22](https://github.com/Phillip9587/nx-stylelint/issues/22)) ([dc07c2e](https://github.com/Phillip9587/nx-stylelint/commit/dc07c2e519f0cd26ac6482bcbd2296e5d4a828ba))


### Others

* **deps:** update nrwl monorepo to v12 (major) ([3103199](https://github.com/Phillip9587/nx-stylelint/commit/3103199072beb5770b095d58321d2ec7b7e1a8bd))

### [11.2.1](https://github.com/Phillip9587/nx-stylelint/compare/v11.2.0...v11.2.1) (2021-04-12)


### Bug Fixes

* **executor:** fixed executor maxWarnings option ([8baf5dd](https://github.com/Phillip9587/nx-stylelint/commit/8baf5dd9662b2d04b493c67a8df505fe11f81f3d))


### Documentation

* replaced align with style attribute and added alt attribute to img ([fa5be34](https://github.com/Phillip9587/nx-stylelint/commit/fa5be3484fe30bdb5863618ae613e6fd48cc2ab1))


### Others

* **deps:** update commitlint monorepo to v12.1.1 ([#17](https://github.com/Phillip9587/nx-stylelint/issues/17)) ([01cd131](https://github.com/Phillip9587/nx-stylelint/commit/01cd131548bbae6f8babcd470701e6d9fce7d475))
* **deps:** update dependency @types/jest to v26.0.22 ([#8](https://github.com/Phillip9587/nx-stylelint/issues/8)) ([b15c5ac](https://github.com/Phillip9587/nx-stylelint/commit/b15c5acac0d926f5c81c1962de45d8800a442c86))
* **deps:** update dependency @types/node to v14.14.36 ([#9](https://github.com/Phillip9587/nx-stylelint/issues/9)) ([ab875ba](https://github.com/Phillip9587/nx-stylelint/commit/ab875ba2d9edc27086a75bfafd6056450c444bef))
* **deps:** update dependency @types/node to v14.14.37 ([#12](https://github.com/Phillip9587/nx-stylelint/issues/12)) ([5d6ad31](https://github.com/Phillip9587/nx-stylelint/commit/5d6ad31961fe82fc731fed8e5e3cde758f21fdb1))
* **deps:** update dependency eslint to v7.23.0 ([#11](https://github.com/Phillip9587/nx-stylelint/issues/11)) ([c4a1755](https://github.com/Phillip9587/nx-stylelint/commit/c4a17554b5d90e212f97b8abed91e85854683e62))
* **deps:** update dependency eslint to v7.24.0 ([#24](https://github.com/Phillip9587/nx-stylelint/issues/24)) ([3b046a2](https://github.com/Phillip9587/nx-stylelint/commit/3b046a2c9d7f066b579ba528e7a966a8962464fb))
* **deps:** update dependency husky to v6 ([#15](https://github.com/Phillip9587/nx-stylelint/issues/15)) ([5b36ac4](https://github.com/Phillip9587/nx-stylelint/commit/5b36ac43a19309a0c9748730d596b65c7fe965c8))
* **deps:** update dependency standard-version to v9.2.0 ([#20](https://github.com/Phillip9587/nx-stylelint/issues/20)) ([6220142](https://github.com/Phillip9587/nx-stylelint/commit/6220142bf722c2eae6fddd7ae1177882652d197f))
* **deps:** update dependency tslib to v2.2.0 ([#19](https://github.com/Phillip9587/nx-stylelint/issues/19)) ([aeaf964](https://github.com/Phillip9587/nx-stylelint/commit/aeaf9649b6d5245b97b806e8bb9c37a902518fdd))
* **deps:** update dependency typescript to v4.2.4 ([#21](https://github.com/Phillip9587/nx-stylelint/issues/21)) ([d38bb78](https://github.com/Phillip9587/nx-stylelint/commit/d38bb78e1ddd99aa531b312feb0f999c37f6613f))
* **deps:** update nrwl monorepo to v11.6.0 ([#13](https://github.com/Phillip9587/nx-stylelint/issues/13)) ([853bdeb](https://github.com/Phillip9587/nx-stylelint/commit/853bdeb64bc644cdf2b7d1dc26c19232a128a528))
* **deps:** update nrwl monorepo to v11.6.1 ([#16](https://github.com/Phillip9587/nx-stylelint/issues/16)) ([820878d](https://github.com/Phillip9587/nx-stylelint/commit/820878d8abc968e1ded7bd27d3c3df5c1513e507))
* **deps:** update nrwl monorepo to v11.6.2 ([#23](https://github.com/Phillip9587/nx-stylelint/issues/23)) ([4f98f0e](https://github.com/Phillip9587/nx-stylelint/commit/4f98f0e905f807c09847c3833c4b2a64a0c3016e))
* **deps:** update typescript-eslint monorepo to v4.19.0 ([#7](https://github.com/Phillip9587/nx-stylelint/issues/7)) ([1d3efeb](https://github.com/Phillip9587/nx-stylelint/commit/1d3efeb4dbf0a80623abb79b65720f1e66efd9a2))
* **deps:** update typescript-eslint monorepo to v4.20.0 ([#14](https://github.com/Phillip9587/nx-stylelint/issues/14)) ([cab226c](https://github.com/Phillip9587/nx-stylelint/commit/cab226c6b5e8d6a1698f2f3f842b9e3a309d2ea2))
* **deps:** update typescript-eslint monorepo to v4.21.0 ([#18](https://github.com/Phillip9587/nx-stylelint/issues/18)) ([c28483e](https://github.com/Phillip9587/nx-stylelint/commit/c28483ee1646cccc5a5bf3ed154df5604cec6c91))

## [11.2.0](https://github.com/Phillip9587/nx-stylelint/compare/v11.1.1...v11.2.0) (2021-03-22)


### Features

* **init:** should skip installation of dependencies needed for recommended configuration ([f627d06](https://github.com/Phillip9587/nx-stylelint/commit/f627d065a4fdc4304e3dc711eee3925af52ceaff))

### [11.1.1](https://github.com/Phillip9587/nx-stylelint/compare/v11.1.0...v11.1.1) (2021-03-22)


### Bug Fixes

* restore removed backslash from jest.config.js ([ebb804d](https://github.com/Phillip9587/nx-stylelint/commit/ebb804dfd3ad3f74228392d6b5b2f48366d87761))


### Documentation

* updated logo to display in github dark mode ([ea2a321](https://github.com/Phillip9587/nx-stylelint/commit/ea2a3216e9e32b5ae26a75d662e7c6e8beab70f8))

## [11.1.0](https://github.com/Phillip9587/nx-stylelint/compare/v11.0.0...v11.1.0) (2021-03-22)


### Features

* added the option to select a formatter to the configuration generator ([67c9ca7](https://github.com/Phillip9587/nx-stylelint/commit/67c9ca76594c29b78a51b248e5ead5de4c1985bf))


### Bug Fixes

* reduce bundle size by removing Changelog and test files ([009e1a1](https://github.com/Phillip9587/nx-stylelint/commit/009e1a1570a18606d1210fefe9292e8dbbff402f))
* removed somehow generated backslashes from configuration files ([96933cd](https://github.com/Phillip9587/nx-stylelint/commit/96933cd2ddf8f6067779d278aab9defb33719345))


### Others

* **deps:** update dependency husky to v5.2.0 ([#6](https://github.com/Phillip9587/nx-stylelint/issues/6)) ([02181a6](https://github.com/Phillip9587/nx-stylelint/commit/02181a66e0122222c562f5fcaa614199bd5ad009))

## [11.0.0](https://github.com/Phillip9587/nx-stylelint/compare/v1.1.1...v11.0.0) (2021-03-20)

### Others

- follow the nx versioning scheme ([57206aa](https://github.com/Phillip9587/nx-stylelint/commit/57206aa79d9102512749eb47e3838667432aafdd))
- **deps:** update actions/setup-node action to v2 ([#5](https://github.com/Phillip9587/nx-stylelint/issues/5)) ([a6c72d3](https://github.com/Phillip9587/nx-stylelint/commit/a6c72d3c70aedc50704d9bb34496c43d9b8094f1))
- **renovate:** moved renovate config to .github folder ([d85a196](https://github.com/Phillip9587/nx-stylelint/commit/d85a1960f930f0dd535ea30aef13990e8716371d))

### [1.1.1](https://github.com/Phillip9587/nx-stylelint/compare/v1.1.0...v1.1.1) (2021-03-19)

### Bug Fixes

- fixed creation of the cacheableOperations in nx.json when not set before run and added tests ([3b27705](https://github.com/Phillip9587/nx-stylelint/commit/3b27705d96f5c3c63fa7aba29df966211e74a06a))

### Others

- **deps:** pin dependencies ([#3](https://github.com/Phillip9587/nx-stylelint/issues/3)) ([6aad285](https://github.com/Phillip9587/nx-stylelint/commit/6aad2858afcd1bb3af522e7a24d6de8f0713d7df))
- **deps:** update nrwl monorepo to v11.5.2 ([#4](https://github.com/Phillip9587/nx-stylelint/issues/4)) ([a1e9d5e](https://github.com/Phillip9587/nx-stylelint/commit/a1e9d5e892fff6a34a1fd6d3f287f29165330ecb))

## [1.1.0](https://github.com/Phillip9587/nx-stylelint/compare/v1.0.2...v1.1.0) (2021-03-19)

### Features

- added init and configuration generators and renamed executor to lint ([f3748f8](https://github.com/Phillip9587/nx-stylelint/commit/f3748f86e3d148947148033dc6c920d1e4fb2451))

### Bug Fixes

- **generator:** fix typo in configuration generator schema ([91fca03](https://github.com/Phillip9587/nx-stylelint/commit/91fca03418cbf8de03519da7f52650fa0ad4edfb))

### Others

- updated readme ([68adf54](https://github.com/Phillip9587/nx-stylelint/commit/68adf542e9f2a085ece1837f9e83812d32e373d6))

### [1.0.2](https://github.com/Phillip9587/nx-stylelint/compare/v1.0.1...v1.0.2) (2021-03-19)

### Bug Fixes

- **executor:** fixed the sucess status of the executor ([5814700](https://github.com/Phillip9587/nx-stylelint/commit/5814700ef4b60d87655c9287592065bcca770e7e))

### Others

- **npm:** updated typescript to 4.2.3 ([4f20dce](https://github.com/Phillip9587/nx-stylelint/commit/4f20dce5e4d2d300a3cd1b0f6537ef1f431c2a5f))

### [1.0.1](https://github.com/Phillip9587/nx-stylelint/compare/v1.0.0...v1.0.1) (2021-03-19)

### Bug Fixes

- **readme:** removed README.md in nested folder ([f991936](https://github.com/Phillip9587/nx-stylelint/commit/f991936b9c8388ab86ec1fc1158c9f1d604b773a))

### Others

- updated default branch ([bb1c43c](https://github.com/Phillip9587/nx-stylelint/commit/bb1c43c6ceb5387a7c5cae9a364ab35bf8e1a902))
- **readme:** updated readme and added github ci status batch ([8312c19](https://github.com/Phillip9587/nx-stylelint/commit/8312c19ddb634a34c9d319a7a56394b10e79aef4))

## 1.0.0 (2021-03-19)

### Bug Fixes

- **jest:** fixed deprecated jest tsConfig config entry ([483ece7](https://github.com/Phillip9587/nx-stylelint/commit/483ece7aa2d4cf4132a83b4ddb8fdcf6f4ee2f71))

### Others

- prepare first release ([c83b4fc](https://github.com/Phillip9587/nx-stylelint/commit/c83b4fcc32c3bf898e0552ea00c6d34bc4604c07))
