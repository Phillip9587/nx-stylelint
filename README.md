<p align="center"><img src="https://raw.githubusercontent.com/Phillip9587/nx-stylelint/main/nx-stylelint.png"/>
</p>

<div align="center">

# Nx Stylelint

Stylelint executors and generators for Nx.

[![Build](https://img.shields.io/github/workflow/status/phillip9587/nx-stylelint/CI?label=build&style=flat-square)](https://github.com/Phillip9587/nx-stylelint/actions/workflows/ci.yml)
[![LICENSE](https://img.shields.io/github/license/phillip9587/nx-stylelint?style=flat-square)](https://github.com/phillip9587/nx-stylelint/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/nx-stylelint?style=flat-square)](https://www.npmjs.com/package/nx-stylelint)

</div>

<hr/><br/>

## 📖 Features

Nx Stylelint provides a set of power ups on [Nx](https://nx.dev) to lint your projects with [Stylelint](https://stylelint.io).

- **Executor**: Provides a executor to lint your styles with stylelint.
- **Only Affected**: Uses Nx to only lint affected projects.
- **Cache**: Uses the Nx cache to cache already linted projects.
- **Generators**: Automatically add a stylelint configuration and target to your projects.

<br>

## 📦 Installation

**using `npm`**

```shell
npm i -D nx-stylelint
```

**using `yarn`**

```shell
yarn add -D nx-stylelint
```

**using `pnpm`**

```shell
pnpm add -D nx-stylelint
```

## 🛠️ Configuring Stylelint for a project

To add a stylelint configuration to a project you just have to run the `nx-stylelint:configuration` generator.

```shell
nx g nx-stylelint:configuration --project <projectName>
```

The generator adds a `.stylelintrc.json` at the project root which extends the root `.stylelintrc.json` and adds a stylelint target to the project.

At the first run the generator installs all required dependencies and creates a `.stylelintrc.json` file at the workspace root. It also adds the stylelint target to the cacheable operations of the default task runner and adds the root `.stylelintrc.json` to the implicit dependencies in the `nx.json` file.

## 🎯 Run Stylelint for affected projects

To run Stylelint for all affected projects run:

```shell
nx affected --target=stylelint
```
