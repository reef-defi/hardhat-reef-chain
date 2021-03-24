import { extendConfig, extendEnvironment, subtask, task } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import path from "path";

import fsExtra from "fs-extra";
import { runScriptWithHardhat } from "hardhat/internal/util/scripts-runner";


import ReefChainService from "./ReefChainService";
import { RUN_REEF_CHAIN, RUN_REEF_SCRIPT, STOP_REEF_CHAIN } from "./task-names";
// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";
import { HardhatError } from "hardhat/internal/core/errors";
import { ERRORS } from "hardhat/internal/core/errors-list";

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    // We apply our default config here. Any other kind of config resolution
    // or normalization should be placed here.
    //
    // `config` is the resolved config, which will be used during runtime and
    // you should modify.
    // `userConfig` is the config as provided by the user. You should not modify
    // it.
    //
    // If you extended the `HardhatConfig` type, you need to make sure that
    // executing this function ensures that the `config` object is in a valid
    // state for its type, including its extentions. For example, you may
    // need to apply a default value, like in this example.
    const userPath = userConfig.paths?.newPath;

    let newPath: string;
    if (userPath === undefined) {
      newPath = path.join(config.paths.root, "newPath");
    } else {
      if (path.isAbsolute(userPath)) {
        newPath = userPath;
      } else {
        // We resolve relative paths starting from the project's root.
        // Please keep this convention to avoid confusion.
        newPath = path.normalize(path.join(config.paths.root, userPath));
      }
    }

    config.paths.newPath = newPath;
  }
);

subtask(RUN_REEF_CHAIN, "Run Reef chain")
  .addPositionalParam("chainPath", "Path to chain")
  .setAction(async (
    { chainPath },
    {}
  ) => {
    const reefChain = new ReefChainService(chainPath);
    reefChain.createService();
  });

subtask(STOP_REEF_CHAIN, "Stop Reef chain")
  .addPositionalParam("chainPath", "Path to chain")
  .setAction(async (
    { chainPath },
    {}
  ) => {
    const reefChain = new ReefChainService(chainPath);
    reefChain.stopService();
  });

task(RUN_REEF_SCRIPT, "Run script on Reef chain")
  .addPositionalParam("scriptPath", "Script file path")
  .addOptionalParam("chainPath", "Path to the chain", "./../reef/reef-chain/")
  .setAction( async (
    { scriptPath, chainPath }: { scriptPath: string, chainPath: string }, 
    { run, hardhatArguments }) => {
      if (!(await fsExtra.pathExists(scriptPath))) {
        throw new HardhatError(ERRORS.BUILTIN_TASKS.RUN_FILE_NOT_FOUND, {
          script: scriptPath,
        });
      }
      run(RUN_REEF_CHAIN, chainPath)
        .catch((error) => {
          throw new HardhatError(ERRORS.BUILTIN_TASKS.RUN_SCRIPT_ERROR, {}, error)
        });

      try {
        process.exitCode = await runScriptWithHardhat(hardhatArguments, scriptPath);
      } catch (error) {
        throw new HardhatError(
          ERRORS.BUILTIN_TASKS.RUN_SCRIPT_ERROR,
          {
            script: scriptPath,
            error: error.message,
          },
          error
        );
      }
      run(STOP_REEF_CHAIN, chainPath)
        .catch((error) => {
          throw new HardhatError(ERRORS.BUILTIN_TASKS.RUN_SCRIPT_ERROR, {}, error);
        });
  });
