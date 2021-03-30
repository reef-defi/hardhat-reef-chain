import "hardhat/types/config";
import "hardhat/types/runtime";

declare module "hardhat/types/config" {
  export interface ProjectPathsUserConfig {
    newPath?: string;
  }
  export interface ProjectPathsConfig {
    newPath: string;
  }
}
