import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import parse from "parse-duration";


export const printLastBlockTime = async (hre:HardhatRuntimeEnvironment) => {
  const latestBlock = await hre.ethers.provider.getBlock("latest");
  console.log("Block datetime: %s (%s)", new Date(latestBlock.timestamp*1000).toUTCString(), latestBlock.timestamp);
} 

task("addtime", "Increase the timestamp of the last block by the time interval.")
  .addVariadicPositionalParam("time", "You can specify 1y2b3w4d5h6m7s", undefined, types.string)
  .setAction(async ({ time }, hre) => {
    const deltaTime = parse(time, "s");
    await hre.network.provider.send("evm_increaseTime", [deltaTime]);
    await hre.network.provider.send("evm_mine");
    
    await printLastBlockTime(hre);
  });

task("now", "Show current time in blockchain")
  .setAction(async ({}, hre) => {
    await printLastBlockTime(hre);
  });
