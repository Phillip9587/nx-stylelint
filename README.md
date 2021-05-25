<p align="center"><img src="https://raw.githubusercontent.com/Phillip9587/nx-stylelint/main/nx-stylelint.png" width="600" alt="Nx Stylelint Logo"/></p>

<div align="center">

# Nx Stylelint

Stylelint executors and generators for Nx.

[![Build](https://img.shields.io/github/workflow/status/phillip9587/nx-stylelint/CI?label=build&style=flat-square)](https://github.com/Phillip9587/nx-stylelint/actions/workflows/ci.yml)
[![LICENSE](https://img.shields.io/github/license/phillip9587/nx-stylelint?style=flat-square)](https://github.com/phillip9587/nx-stylelint/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/nx-stylelint?style=flat-square)](https://www.npmjs.com/package/nx-stylelint)

</div>

<hr/>

# 🚀 Features

Nx Stylelint provides a set of power ups on [Nx](https://nx.dev) to lint your projects with [Stylelint](https://stylelint.io).

- **Executor**: Provides a executor to lint your styles with stylelint.
- **Generators**: Helping you to configure your projects.
- **Configuration**: Per Project configuration of stylelint extending a workspace configuration.
- **Only Affected**: Uses Nx to support linting only affected projects.
- **Cache**: Uses Nx to cache already linted projects.

# 📦 Installation

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

# 🛠️ Configuring Stylelint for a project

To add a stylelint configuration to a project you just have to run the `nx-stylelint:configuration` generator.

```shell
nx g nx-stylelint:configuration --project <projectName>
```

The generator adds a `.stylelintrc.json` at the project root which extends the root `.stylelintrc.json` and adds a stylelint target to the project.

At the first run the generator installs all required dependencies and creates a `.stylelintrc.json` file at the workspace root. It also adds the stylelint target to the cacheable operations of the default task runner and adds the root `.stylelintrc.json` to the implicit dependencies in the `nx.json` file.

# 🎯 Run Stylelint for affected projects

To run Stylelint for all affected projects run:

```shell
nx affected --target=stylelint
```

# 📖 Documentation

## `nx-stylelint:init` generator

Add stylelint configuration and dependencies to the workspace.

### Options

#### `skipFormat`

Skip formatting files.

Type: `boolean`

Default: `false`

## `nx-stylelint:configuration` generator

Add stylelint configuration to a project.

### Usage

Add configuration to a project:

`nx g nx-stylelint:configuration --project projectName`

### Options

#### `format`

Stylelint Output formatter (https://stylelint.io/user-guide/usage/options#formatter).

Type: `string`

Possible values: `compact`, `json`, `string`, `tap`, `unix`, `verbose`

Default: `string`

#### `project`

The name of the project.

Type: `string`

#### `skipFormat`

Skip formatting files.

Type: `boolean`

Default: `false`

## `nx-stylelint:lint` executor

Run stylelint on a project.

Options can be configured in `workspace.json` when defining the executor, or when invoking it.

### Options

#### `config`

Path of the stylelint configuration file.

Type: `string`

Example: `packages/lib/.stylelintrc.json`

#### `fix`

Fixes linting errors (may overwrite linted files).

Type: `boolean`

Default: `false`

#### `force`

Succeeds even if there were linting errors.

Type: `boolean`

Default: `false`

#### `format`

Stylelint Output formatter (https://stylelint.io/user-guide/usage/options#formatter).

Type: `string`

Possible values: `compact`, `json`, `string`, `tap`, `unix`, `verbose`

Default: `string`

#### `lintFilePatterns`

One or more files/dirs/globs to pass directly to Stylelint's lint() method.

Type: `array`

#### `maxWarnings`

Number of warnings to trigger a nonzero exit code.

Type: `number`

Default: `-1`

#### `outputFile`

File to write the report to.

Type: `string`

#### `silent`

Hide output text.

Type: `boolean`

Default: `false`
