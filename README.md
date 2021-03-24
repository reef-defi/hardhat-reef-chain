# Hardhat Reef chain plugin

The plugin allows the user to run custom scripts, deploys, ... on the reef chain.

## Installation

To start using the plugin run.
```
yarn build
```

Create a link to the plugin.
```
yarn link
```

## Usage 

In the new hardhat project link the plugin with.
```
yarn link hardhat-reef-chain
```

Don't forget to import the plugin in `hardhat.config.js`!
```
require("hardhat-reef-chain");
```

Run script on Reef chain.
```
npx hardhat reefrun path/to/script
```

Users can optionally set the path of the Reef chain, which is used to manage the chain.
```
npx hardhat reefrun path/to/script --chainPath path/to/chain
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
