# Hardhat Reef chain plugin

Plugin allows the user to run costum scripts, deployes, ... on the reef chain.

## Installation

To start using the plugin run:

```
yarn build
yarn link
```

In new hardhat project link the plugin with:
```
yarn link hardhat-reef-chain
```

## Testing

Running `yarn test` will run every test located in the `test/` folder. They
use [mocha](https://mochajs.org) and [chai](https://www.chaijs.com/).

We recommend creating unit tests for your own modules, and integration tests for
the interaction of the plugin with Hardhat and its dependencies.

## Linting and autoformat

All of Hardhat projects use [prettier](https://prettier.io/) and
[tslint](https://palantir.github.io/tslint/).

You can check if your code style is correct by running `yarn lint`, and fix
it with `yarn lint:fix`.
