import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import parse from "parse-duration";

export const printLastBlockTime = async (hre: HardhatRuntimeEnvironment) => {
  const latestBlock = await hre.ethers.provider.getBlock("latest");
  console.log(
    "Block datetime: %s (%s)",
    new Date(latestBlock.timestamp * 1000).toUTCString(),
    latestBlock.timestamp
  );
};

task(
  "addtime",
  "Increase the timestamp of the last block by the time interval."
)
  .addVariadicPositionalParam(
    "time",
    "You can specify 1y2b3w4d5h6m7s",
    undefined,
    types.string
  )
  .setAction(async ({ time }, hre) => {
    const deltaTime = parse(time, "s");
    await hre.network.provider.send("evm_increaseTime", [deltaTime]);
    await hre.network.provider.send("evm_mine");

    await printLastBlockTime(hre);
  });

task("now", "Show current time in blockchain").setAction(async ({}, hre) => {
  await printLastBlockTime(hre);
});

task("addBalance", "add balance to user")
  .addParam("token", "ox......", undefined, types.string)
  .addParam("holder", "ox......", undefined, types.string)
  .addParam("recipient", "ox......", undefined, types.string)
  .addParam("amount", "You can specify 1000", undefined, types.string)
  .setAction(async ({ token, holder, recipient, amount }, hre) => {
    const holderAcc = await hre.ethers.getSigner(holder);
    const provider = hre.network.provider;

    await provider.request({
      method: "hardhat_impersonateAccount",
      params: [holder],
    });

    const abi = [
      {
        constant: false,
        inputs: [
          { name: "dst", type: "address" },
          { name: "wad", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const tokenInstance = new hre.ethers.Contract(token, abi, holderAcc);

    const decimals = await tokenInstance.decimals();

    await (
      await tokenInstance.transfer(
        recipient,
        hre.ethers.utils.parseUnits(amount, +decimals)
      )
    ).wait();
  });

task("addBalanceETH", "add balance to user")
  .addParam("recipient", "ox......", undefined, types.string)
  .addParam("holder", "ox......", undefined, types.string)
  .addParam("amount", "You can specify 1000", undefined, types.string)
  .setAction(async ({ holder, amount, recipient }, hre) => {
    const holderAc = await hre.ethers.getSigner(holder);
    const provider = hre.network.provider;

    await provider.request({
      method: "hardhat_impersonateAccount",
      params: [holder],
    });
    await (
      await holderAc.sendTransaction({
        to: recipient,
        value: hre.ethers.utils.parseEther(amount),
      })
    ).wait();
  });

task("mine", "mine block")
  // .addParam("count", "100", undefined, types.string)
  .setAction(async ({}, hre) => {
    await hre.network.provider.send("evm_mine");
  });
