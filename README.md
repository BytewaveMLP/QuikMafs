# QuikMafs

> A Discord bot which parses and renders LaTeX math

## Installation

### Prerequisites

- Node.js v12 or greater

### Install dependencies

```shell
$ yarn
```

### Create config file

```shell
$ cp config.example.toml config.toml
$ $EDITOR config.toml
```

## Usage

By default, QuikMafs uses a prefix of `$$`. To render math, use this prefix, then add your LaTeX. You may optionally follow a message with the prefix again, to emulate inline math (it will simply be stripped before passing to MathJax).

## Contributing

PRs and bug reports welcome. This is a bit of a joke project, so don't expect super active support.

## License

Copyright (c) Eliot Partridge, 2020. Licensed under [the MIT license](/LICENSE).
