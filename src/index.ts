import { subtask } from "hardhat/config";
import ReefChainService from "./ReefChainService";
import { RUN_REEF_CHAIN, STOP_REEF_CHAIN } from "./task-names";
import "./type-extensions";

subtask(RUN_REEF_CHAIN, "Run Reef chain")
  .addOptionalParam("chain", "Path to chain", "./../reef/reef-chain/")
  .setAction(async (
    { chain }: { chain: string },
    {}
  ) => {
    const reefChain = new ReefChainService(chain);
    reefChain.createService();
  });

subtask(STOP_REEF_CHAIN, "Stop Reef chain")
  .addOptionalParam("chain", "Path to chain", "./../reef/reef-chain/")
  .setAction(async (
    { chain }: { chain: string },
    {}
  ) => {
    const reefChain = new ReefChainService(chain);
    reefChain.stopService();
  });
