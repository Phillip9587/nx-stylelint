<p align="center"><img src="https://raw.githubusercontent.com/Phillip9587/nx-stylelint/main/banner.svg" alt="nx-stylelint Banner"/></p>

<div align="center">

# nx-stylelint

**[Nx](https://nx.dev) plugin to use [Stylelint](https://stylelint.io) in your Nx workspace.**

[![Nx peer dependency version](https://img.shields.io/npm/dependency-version/nx-stylelint/@nx/devkit?label=Nx&logo=nx&style=flat-square)](https://nx.dev)
[![Stylelint peer dependency version](https://img.shields.io/npm/dependency-version/nx-stylelint/peer/stylelint?label=Stylelint&logo=stylelint&style=flat-square)](https://stylelint.io)
[![CI](https://img.shields.io/github/actions/workflow/status/Phillip9587/nx-stylelint/ci.yml?branch=main&label=CI&style=flat-square&logo=github)](https://github.com/Phillip9587/nx-stylelint/actions/workflows/ci.yml)
[![LICENSE](https://img.shields.io/github/license/phillip9587/nx-stylelint?style=flat-square)](https://github.com/phillip9587/nx-stylelint/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/nx-stylelint?style=flat-square&logo=npm)](https://www.npmjs.com/package/nx-stylelint)
[![npm](https://img.shields.io/npm/dt/nx-stylelint?style=flat-square&logo=npm)](https://www.npmjs.com/package/nx-stylelint)
[![OpenSSF Scorecard](https://img.shields.io/ossf-scorecard/github.com/Phillip9587/nx-stylelint?style=flat-square&label=openssf%20scorecard)](https://scorecard.dev/viewer/?uri=github.com/Phillip9587/nx-stylelint)


</div>

<hr/>

# 🚀 Features

nx-stylelint provides a set of power-ups for [Nx](https://nx.dev) to lint your projects with [Stylelint](https://stylelint.io).

- **Plugin**: Provides a experimental plugin to infer your stylelint target when a configuration file exists.
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

At the first run the generator installs all required dependencies and creates a `.stylelintrc.json` file at the workspace root. It also configures the `namedInputs` for the stylelint targets.

## Using the Experimental Plugin

Read the official NX docs to understand Infered Tasks: https://nx.dev/concepts/inferred-tasks

Adding the plugin is currently not supported by the generators.

To add the plugin add the following to your `nx.json`:

```json
{
  "plugins": [
    {
      "plugin": "nx-stylelint/plugin",
      "options": {
        "targetName": "stylelint",
        "extensions": ["css"]
      }
    }
  ]
}
```

targetDefaults can be configured e.g. `--allow-empty-input`:

```json
"targetDefaults": {
    "stylelint": {
        "options": {
            "args": ["--allow-empty-input"]
        }
    }
}
```

You don't need a `stylelint` target in your `project.json` files anymore. If you want to configure options for a single project provide the target and add the stylelint CLI arguments as documented at https://stylelint.io/user-guide/cli#options.

```json
"targets": {
    "stylelint": {
        "options": {
            "args": [
                "--report-descriptionless-disables"
            ]
        }
    }
}
```

# Examples

Run nx-stylelint for a project

```shell
nx stylelint {{projectName}}
```

Run nx-stylelint for all projects

```shell
nx run-many --target=stylelint
```

Run nx-stylelint for affected projects

```shell
nx affected --target=stylelint
```

# 📖 Documentation

## `nx-stylelint:configuration` generator

Add stylelint configuration to a project.

### Usage

Add configuration to a project:

`nx g nx-stylelint:configuration --project projectName`

### Options

| Option       | Value                                                                       | Description                                                                           |
| ------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `formatter`  | `compact` \| `github` \| `json` \| `string` \| `tap` \| `unix` \| `verbose` | Stylelint Output formatter (https://stylelint.io/user-guide/usage/options#formatter). |
| `project`    | `string`                                                                    | The name of the project.                                                              |
| `scss`       | `boolean`                                                                   | Add SCSS Language support.                                                            |
| `skipFormat` | `boolean`                                                                   | Skip formatting files.                                                                |

## `nx-stylelint:lint` executor

Run stylelint on a project.

Target Options can be configured in `project.json` or when the executor is invoked.

See: https://nx.dev/configuration/projectjson#targets

### Options

| Option                          | Value      | Default  | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowEmptyInput`               | `boolean`  | `true`   | The executor exits without throwing an error when 'lintFilePatterns' match no files.                                                                                                                                                                                                                                                                                                        |
| `cache`                         | `boolean`  | `false`  | Store the results of processed files so that Stylelint only operates on the changed ones.                                                                                                                                                                                                                                                                                                   |
| `cacheLocation`                 | `string`   |          | Path to a file or directory for the cache location.                                                                                                                                                                                                                                                                                                                                         |
| `configFile`                    | `string`   |          | Path to a stylelint configuration file.                                                                                                                                                                                                                                                                                                                                                     |
| `fix`                           | `boolean`  | `false`  | Fixes linting errors (may overwrite linted files).                                                                                                                                                                                                                                                                                                                                          |
| `force`                         | `boolean`  | `false`  | Succeeds even if there were linting errors.                                                                                                                                                                                                                                                                                                                                                 |
| `formatter`                     | `string`   | `string` | Specify the formatter to format your results ([Stylelint Docs](https://stylelint.io/user-guide/usage/options#formatter)). `compact` \| `github` \| `json` \| `string` \| `tap` \| `unix` \| `verbose` or a npm package (e.g. [`stylelint-formatter-pretty`](https://www.npmjs.com/package/stylelint-formatter-pretty)) or a path to a local formatter (e.g. `tools/stylelint-formatter.js`) |
| `ignoreDisables`                | `boolean`  | `false`  | Ignore `stylelint-disable` comments.                                                                                                                                                                                                                                                                                                                                                        |
| `ignorePath`                    | `string`   |          | A path to a file containing patterns describing files to ignore. The path can be absolute or relative to `process.cwd()`. By default, Stylelint looks for `.stylelintignore` in `process.cwd()`.                                                                                                                                                                                            |
| `lintFilePatterns`              | `string[]` |          | One or more files/dirs/globs to pass directly to Stylelint's lint() method.                                                                                                                                                                                                                                                                                                                 |
| `maxWarnings`                   | `number`   |          | Number of warnings to trigger a nonzero exit code.                                                                                                                                                                                                                                                                                                                                          |
| `outputFile`                    | `string`   |          | File to write the report to.                                                                                                                                                                                                                                                                                                                                                                |
| `quiet`                         | `boolean`  | `false`  | Only register problems for rules with an "error"-level severity (ignore "warning"-level).                                                                                                                                                                                                                                                                                                   |
| `reportDescriptionlessDisables` | `boolean`  | `false`  | Report `stylelint-disable` comments without a description.                                                                                                                                                                                                                                                                                                                                  |
| `reportInvalidScopeDisables`    | `boolean`  | `false`  | Report `stylelint-disable` comments that don't match rules that are specified in the configuration object.                                                                                                                                                                                                                                                                                  |
| `reportNeedlessDisables`        | `boolean`  | `true`  | Report `stylelint-disable` comments that don't actually match any lints that need to be disabled.                                                                                                                                                                                                                                                                                           |
| `silent`                        | `boolean`  | `false`  | Hide output text.                                                                                                                                                                                                                                                                                                                                                                           |

# Custom Formatters

nx-stylelint supports custom stylelint formatters. You can either install them with your package manager or write your own formatter.

For a guide on writing custom formatters see: https://stylelint.io/developer-guide/formatters

For a list of installable formatters take a look at:

- https://github.com/stylelint/awesome-stylelint#formatters
- https://www.npmjs.com/search?q=stylelint-formatter

## Usage

To use a custom formatter you have to configure the `formatter` option of your `stylelint` target. Target Options can be configured in the `project.json` file of your project or when invoking it (https://nx.dev/configuration/projectjson#targets).

You can provide a path to your custom formatter:

```json
{
  "projectType": "library",
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

**nx-stylelint** depends on **Nx** and **Stylelint**. This table provides the compatibility matrix between versions of **nx-stylelint**, **Nx** and **Stylelint**.

| nx-stylelint Version | Nx Version                          | Stylelint Version      |
| -------------------- | ----------------------------------- | ---------------------- |
| `^18.0.0`            | `^19.0.0 \|\| ^20.0.0`              | `^16.0.0`              |
| `^17.1.0`            | `^17.0.0 \|\| ^18.0.0 \|\| ^19.0.0` | `^15.0.0 \|\| ^16.0.0` |
| `^17.0.0`            | `^17.0.0 \|\| ^18.0.0`              | `^15.0.0`              |
| `^16.0.0`            | `^16.0.0`                           | `^15.0.0`              |
| `^15.0.0`            | `^15.0.0`                           | `^15.0.0`              |
| `^14.0.0`            | `^14.0.0`                           | `^14.10.0`             |
| `^13.0.0`            | `>=12.0.0`                          | `^14.0.0`              |
| `^12.0.0`            | `>=12.0.0`                          | `^13.0.0`              |
| `^11.0.0`            | `^11.0.0`                           | `^13.0.0`              |
