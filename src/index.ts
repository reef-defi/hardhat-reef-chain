import { extendConfig, subtask, task } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import path from "path";

import fsExtra from "fs-extra";
import { runScriptWithHardhat } from "hardhat/internal/util/scripts-runner";


import ReefChainService from "./ReefChainService";
import { RUN_REEF_CHAIN, STOP_REEF_CHAIN } from "./task-names";
// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";
import { HardhatError } from "hardhat/internal/core/errors";
import { ERRORS } from "hardhat/internal/core/errors-list";
import { TASK_RUN } from "hardhat/builtin-tasks/task-names";

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
  .addPositionalParam("chain", "Path to chain")
  .setAction(async (
    { chain }: { chain: string },
    {}
  ) => {
    const reefChain = new ReefChainService(chain);
    reefChain.createService();
  });

subtask(STOP_REEF_CHAIN, "Stop Reef chain")
  .addPositionalParam("chain", "Path to chain")
  .setAction(async (
    { chain }: { chain: string },
    {}
  ) => {
    const reefChain = new ReefChainService(chain);
    reefChain.stopService();
  });

task(TASK_RUN, "Run script on Reef chain")
  .addOptionalParam("chain", "Path to the chain", "/Users/frenki/Workspace/Blockchain/reef/reef-chain/")
  .setAction( async (
    { script, chain }: { script: string, chain: string }, 
    { run, hardhatArguments }) => {
      if (!(await fsExtra.pathExists(script))) {
        throw new HardhatError(ERRORS.BUILTIN_TASKS.RUN_FILE_NOT_FOUND, {
          script,
        });
      }
      
      try {
        run(RUN_REEF_CHAIN, { chain })
        await runScriptWithHardhat(hardhatArguments, script)
        run(STOP_REEF_CHAIN, { chain })
      } catch (error) {
        throw new HardhatError(
          ERRORS.BUILTIN_TASKS.RUN_SCRIPT_ERROR,
          { script, error: error.message },
          error
        );
      }
  });
