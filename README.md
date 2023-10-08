<p align="center"><img src="https://raw.githubusercontent.com/Phillip9587/nx-stylelint/main/banner.svg" alt="Nx Stylelint Banner"/></p>

<div align="center">

# Nx Stylelint

**Nx plugin to use [Stylelint](https://stylelint.io) in your Nx workspace.**

[![Nx peer dependency version](https://img.shields.io/npm/dependency-version/nx-stylelint/@nx/devkit?label=Nx&logo=nx&style=flat-square)](https://nx.dev)
[![Stylelint peer dependency version](https://img.shields.io/npm/dependency-version/nx-stylelint/peer/stylelint?label=Stylelint&logo=stylelint&style=flat-square)](https://stylelint.io)
[![CI](https://img.shields.io/github/actions/workflow/status/Phillip9587/nx-stylelint/ci.yml?branch=main&label=CI&style=flat-square&logo=github)](https://github.com/Phillip9587/nx-stylelint/actions/workflows/ci.yml)
[![LICENSE](https://img.shields.io/github/license/phillip9587/nx-stylelint?style=flat-square)](https://github.com/phillip9587/nx-stylelint/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/nx-stylelint?style=flat-square&logo=npm)](https://www.npmjs.com/package/nx-stylelint)
[![npm](https://img.shields.io/npm/dt/nx-stylelint?style=flat-square&logo=npm)](https://www.npmjs.com/package/nx-stylelint)

</div>

<hr/>

# 🚀 Features

Nx Stylelint provides a set of power-ups for [Nx](https://nx.dev) to lint your projects with [Stylelint](https://stylelint.io).

- **Executor**: Provides an executor to lint your styles with Stylelint.
- **Generators**: Helping you to configure your projects.
- **Configuration**: Per Project configuration of Stylelint extending a workspace configuration.
- **Only Affected**: Uses Nx to support linting only affected projects.
- **Cache**: Uses Nx to cache already linted projects.

# 📦 Installation

**using [npm](https://npmjs.com)**

```shell
npm i -D nx-stylelint
```

**using [yarn](https://yarnpkg.com)**

```shell
yarn add -D nx-stylelint
```

**using [pnpm](https://pnpm.io)**

```shell
pnpm add -D nx-stylelint
```

# 🛠️ Configuring Stylelint for a project

To add a stylelint configuration to a project you just have to run the `nx-stylelint:configuration` generator.

```shell
nx g nx-stylelint:configuration --project <projectName>
```

The generator adds a `.stylelintrc.json` at the project root which extends the root `.stylelintrc.json` and adds a stylelint target to the project.

At the first run the generator installs all required dependencies and creates a `.stylelintrc.json` file at the workspace root. It also adds the stylelint target to the cacheable operations of the default task runner and configures the `namedInputs` for the stylelint targets.

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

#### `formatter`

Stylelint Output formatter (https://stylelint.io/user-guide/usage/options#formatter).

Type: `string`

Possible values: `compact`, `github`, `json`, `string`, `tap`, `unix`, `verbose`

Default: `string`

#### `project`

The name of the project.

Type: `string`

#### `scss`

Add SCSS Language support.

Type: `boolean`

Default: `false`

#### `skipFormat`

Skip formatting files.

Type: `boolean`

Default: `false`

## DEPRECATED `nx-stylelint:scss` generator

**This generator is deprecated and will be removed in v17. Use the configuration generator with the scss option instead**

Add scss support to a nx-stylelint configuration.

### Usage

`nx g nx-stylelint:scss --project projectName`

### Options

#### `project`

The name of the project.

Type: `string`

#### `skipFormat`

Skip formatting files.

Type: `boolean`

Default: `false`

## `nx-stylelint:lint` executor

Run stylelint on a project.

Target Options can be configured in `project.json` or `workspace.json`/`angular.json` when defining the target, or when invoking it.

See: https://nx.dev/configuration/projectjson#targets

### Options

#### `allowEmptyInput`

The executor exits without throwing an error when 'lintFilePatterns' match no files.

Type: `boolean`

Default: `true`

#### `cache`

Store the results of processed files so that Stylelint only operates on the changed ones.

Type: `boolean`

Default: `false`

#### `cacheLocation`

Path to a file or directory for the cache location.

Type: `string`

#### `configFile`

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

#### `formatter`

Stylelint Output formatter (https://stylelint.io/user-guide/usage/options#formatter).

Type: `string`

Possible values: `compact`, `github`, `json`, `string`, `tap`, `unix`, `verbose`, a npm package (e.g. [`stylelint-formatter-pretty`](https://www.npmjs.com/package/stylelint-formatter-pretty)) or a path to a local formatter (e.g. `tools/stylelint-formatter.js`)

Default: `string`

#### `ignoreDisables`

Ignore `stylelint-disable` comments.

Type: `boolean`

Default: `false`

#### `ignorePath`

A path to a file containing patterns describing files to ignore. The path can be absolute or relative to `process.cwd()`. By default, Stylelint looks for `.stylelintignore` in `process.cwd()`.

Type: `string`

#### `lintFilePatterns`

One or more files/dirs/globs to pass directly to Stylelint's lint() method.

Type: `array`

#### `maxWarnings`

Number of warnings to trigger a nonzero exit code.

Type: `number`

#### `outputFile`

File to write the report to.

Type: `string`

#### `quiet`

Only register problems for rules with an "error"-level severity (ignore "warning"-level).

Type: `boolean`

Default: `false`

#### `reportDescriptionlessDisables`

Report `stylelint-disable` comments without a description.

Type: `boolean`

Default: `false`

#### `reportInvalidScopeDisables`

Report `stylelint-disable` comments that don't match rules that are specified in the configuration object.

Type: `boolean`

Default: `false`

#### `reportNeedlessDisables`

Report `stylelint-disable` comments that don't actually match any lints that need to be disabled.

Type: `boolean`

Default: `true`

#### `silent`

Hide output text.

Type: `boolean`

Default: `false`

# Custom Formatters

Nx Stylelint supports custom Stylelint Formatters. You can either install them with your Package Manager or write your own formatter.

For a guide on writing custom formatters see: https://stylelint.io/developer-guide/formatters

For a list of installable formatters take a look at:

- https://github.com/stylelint/awesome-stylelint#formatters
- https://www.npmjs.com/search?q=stylelint-formatter

## Usage

To use a custom formatter you have to configure the `formatter` option of your `stylelint` target. Target Options can be configured in the `project.json` file of your project or `workspace.json`/`angular.json`, when defining the target or when invoking it (https://nx.dev/configuration/projectjson#targets).

You can provide a path to your custom formatter:

```json
{
  "projectType": "library",
  "root": "libs/styles",
  "sourceRoot": "libs/styles/src",
  "targets": {
    "stylelint": {
      "executor": "nx-stylelint:lint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": ["libs/styles/**/*.css"],
        "formatter": "tools/my-own-stylelint-formatter.js"
      }
    }
  }
}
```

Or the name of your installed formatter package e.g. [`stylelint-formatter-pretty`](https://www.npmjs.com/package/stylelint-formatter-pretty). Scoped packages are also supported:

```json
{
  "projectType": "library",
  "root": "libs/styles",
  "sourceRoot": "libs/styles/src",
  "targets": {
    "stylelint": {
      "executor": "nx-stylelint:lint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": ["libs/styles/**/*.css"],
        "formatter": "stylelint-formatter-pretty"
      }
    }
  }
}
```

# Compatibility with Nx and Stylelint

**Nx Stylelint** depends on **Nx** and **Stylelint**. This table provides the compatibility matrix between versions of **Nx Stylelint**, **Nx** and **Stylelint**.

| Nx Stylelint Version | Nx Version | Stylelint Version |
| -------------------- | ---------- | ----------------- |
| `^16.0.0`            | `>=16.0.0` | `^15.0.0`         |
| `^15.0.0`            | `>=15.0.0` | `^15.0.0`         |
| `^14.0.0`            | `>=14.0.0` | `^14.10.0`        |
| `^13.0.0`            | `>=12.0.0` | `^14.0.0`         |
| `^12.0.0`            | `>=12.0.0` | `^13.0.0`         |
| `^11.0.0`            | `^11.0.0`  | `^13.0.0`         |
