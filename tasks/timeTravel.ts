import {task, types} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";

import parse from "parse-duration";
import {Signer} from "@ethersproject/abstract-signer";
import {Provider} from "@ethersproject/abstract-provider";
import {ContractInterface} from "@ethersproject/contracts/src.ts";
import {mine} from "@nomicfoundation/hardhat-network-helpers";

export const printLastBlockTime = async (hre: HardhatRuntimeEnvironment) => {
    const latestBlock = await hre.ethers.provider.getBlock("latest");
    console.log("Block datetime: %s (%s)", new Date(latestBlock.timestamp * 1000).toUTCString(), latestBlock.timestamp);
};

task("addtime", "Increase the timestamp of the last block by the time interval.")
    .addVariadicPositionalParam("time", "You can specify 1y2b3w4d5h6m7s", undefined, types.string)
    .setAction(async ({time}, hre) => {
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
    .setAction(async ({token, holder, recipient, amount}, hre) => {
        const holderAcc = await hre.ethers.getSigner(
            holder,
        );
        const provider = hre.network.provider;

        await provider.request({
            method: "hardhat_impersonateAccount",
            params: [holder],
        });

        const abi = [{
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [{"name": "", "type": "string"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "guy", "type": "address"}, {"name": "wad", "type": "uint256"}],
            "name": "approve",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{"name": "", "type": "uint256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "src", "type": "address"}, {"name": "dst", "type": "address"}, {
                "name": "wad",
                "type": "uint256"
            }],
            "name": "transferFrom",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "wad", "type": "uint256"}],
            "name": "withdraw",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{"name": "", "type": "uint8"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "", "type": "uint256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [{"name": "", "type": "string"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "dst", "type": "address"}, {"name": "wad", "type": "uint256"}],
            "name": "transfer",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "address"}],
            "name": "allowance",
            "outputs": [{"name": "", "type": "uint256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {"payable": true, "stateMutability": "payable", "type": "fallback"}, {
            "anonymous": false,
            "inputs": [{"indexed": true, "name": "src", "type": "address"}, {
                "indexed": true,
                "name": "guy",
                "type": "address"
            }, {"indexed": false, "name": "wad", "type": "uint256"}],
            "name": "Approval",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{"indexed": true, "name": "src", "type": "address"}, {
                "indexed": true,
                "name": "dst",
                "type": "address"
            }, {"indexed": false, "name": "wad", "type": "uint256"}],
            "name": "Transfer",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{"indexed": true, "name": "dst", "type": "address"}, {
                "indexed": false,
                "name": "wad",
                "type": "uint256"
            }],
            "name": "Deposit",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{"indexed": true, "name": "src", "type": "address"}, {
                "indexed": false,
                "name": "wad",
                "type": "uint256"
            }],
            "name": "Withdrawal",
            "type": "event"
        }]
        const tokenInstance = new hre.ethers.Contract(token, abi, holderAcc)

        await (
            await tokenInstance.transfer(recipient, hre.ethers.utils.parseEther(amount))
        ).wait()
    });

task("addBalanceETH", "add balance to user")
    .addParam("recipient", "ox......", undefined, types.string)
    .addParam("holder", "ox......", undefined, types.string)
    .addParam("amount", "You can specify 1000", undefined, types.string)
    .setAction(async ({holder, amount, recipient}, hre) => {
        const holderAc = await hre.ethers.getSigner(
            holder,
        );
        const provider = hre.network.provider;

        await provider.request({
            method: "hardhat_impersonateAccount",
            params: [holder],
        });
        await(await holderAc.sendTransaction({
            to: recipient,
            value: hre.ethers.utils.parseEther(amount)
        })).wait()
    });

task("mine", "mine block")
    // .addParam("count", "100", undefined, types.string)
    .setAction(async ({}, hre) => {
        await hre.network.provider.send("evm_mine");
    });

task("newprice", "Set new price")
    .addVariadicPositionalParam("price", "You can specify 1000", undefined, types.int)
    .setAction(async ({price}, hre) => {
        const abi = [
            {
                inputs: [{internalType: "string", name: "_name", type: "string"}],
                stateMutability: "nonpayable",
                type: "constructor",
            },
            {
                inputs: [],
                name: "decimals",
                outputs: [{internalType: "uint8", name: "", type: "uint8"}],
                stateMutability: "view",
                type: "function",
            },
            {
                inputs: [],
                name: "description",
                outputs: [{internalType: "string", name: "", type: "string"}],
                stateMutability: "view",
                type: "function",
            },
            {
                inputs: [{internalType: "uint80", name: "_roundId", type: "uint80"}],
                name: "getRoundData",
                outputs: [
                    {internalType: "uint80", name: "roundId", type: "uint80"},
                    {internalType: "int256", name: "answer", type: "int256"},
                    {internalType: "uint256", name: "startedAt", type: "uint256"},
                    {internalType: "uint256", name: "updatedAt", type: "uint256"},
                    {internalType: "uint80", name: "answeredInRound", type: "uint80"},
                ],
                stateMutability: "view",
                type: "function",
            },
            {
                inputs: [],
                name: "lastRoundId",
                outputs: [{internalType: "uint80", name: "", type: "uint80"}],
                stateMutability: "view",
                type: "function",
            },
            {
                inputs: [],
                name: "latestRoundData",
                outputs: [
                    {internalType: "uint80", name: "roundId", type: "uint80"},
                    {internalType: "int256", name: "answer", type: "int256"},
                    {internalType: "uint256", name: "startedAt", type: "uint256"},
                    {internalType: "uint256", name: "updatedAt", type: "uint256"},
                    {internalType: "uint80", name: "answeredInRound", type: "uint80"},
                ],
                stateMutability: "view",
                type: "function",
            },
            {
                inputs: [],
                name: "name",
                outputs: [{internalType: "string", name: "", type: "string"}],
                stateMutability: "view",
                type: "function",
            },
            {
                inputs: [
                    {internalType: "int256", name: "_price", type: "int256"},
                    {internalType: "uint256", name: "ts", type: "uint256"},
                    {internalType: "uint80", name: "_roundId", type: "uint80"},
                ],
                name: "setPrice",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                inputs: [],
                name: "version",
                outputs: [{internalType: "uint256", name: "", type: "uint256"}],
                stateMutability: "view",
                type: "function",
            },
        ];
        const oracl = await hre.ethers.getContractAt(abi, "0xc17bEF693c1cBFa47BF6f789CEe8E51670A0307d");
        const lastID = +(await oracl.latestRoundData()).roundId;
        const latestBlock = await hre.ethers.provider.getBlock("latest");
        await oracl.setPrice(price * 10 ** 8, latestBlock.timestamp, lastID + 1);
    });

task("rebalance", "Rebalance").setAction(async ({}, hre) => {
    const abi = [
        {anonymous: false, inputs: [], name: "Rebalanced", type: "event"},
        {
            anonymous: false,
            inputs: [
                {indexed: true, internalType: "bytes32", name: "role", type: "bytes32"},
                {indexed: true, internalType: "bytes32", name: "previousAdminRole", type: "bytes32"},
                {indexed: true, internalType: "bytes32", name: "newAdminRole", type: "bytes32"},
            ],
            name: "RoleAdminChanged",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {indexed: true, internalType: "bytes32", name: "role", type: "bytes32"},
                {indexed: true, internalType: "address", name: "account", type: "address"},
                {indexed: true, internalType: "address", name: "sender", type: "address"},
            ],
            name: "RoleGranted",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {indexed: true, internalType: "bytes32", name: "role", type: "bytes32"},
                {indexed: true, internalType: "address", name: "account", type: "address"},
                {indexed: true, internalType: "address", name: "sender", type: "address"},
            ],
            name: "RoleRevoked",
            type: "event",
        },
        {
            inputs: [],
            name: "ARBITRAGER_ROLE",
            outputs: [{internalType: "bytes32", name: "", type: "bytes32"}],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [{internalType: "bytes32", name: "", type: "bytes32"}],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "GLOBAL_GOVERNANCE_ROLE",
            outputs: [{internalType: "bytes32", name: "", type: "bytes32"}],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "LOCAL_GOVERNANCE_ROLE",
            outputs: [{internalType: "bytes32", name: "", type: "bytes32"}],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{internalType: "bytes32", name: "role", type: "bytes32"}],
            name: "getRoleAdmin",
            outputs: [{internalType: "bytes32", name: "", type: "bytes32"}],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {internalType: "address", name: "_token", type: "address"},
                {internalType: "address", name: "to", type: "address"},
                {internalType: "uint256", name: "amount", type: "uint256"},
            ],
            name: "govWithdraw",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {internalType: "bytes32", name: "role", type: "bytes32"},
                {internalType: "address", name: "account", type: "address"},
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {internalType: "bytes32", name: "role", type: "bytes32"},
                {internalType: "address", name: "account", type: "address"},
            ],
            name: "hasRole",
            outputs: [{internalType: "bool", name: "", type: "bool"}],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{internalType: "address", name: "protocolConfig", type: "address"}],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [{internalType: "address", name: "_market", type: "address"}],
            name: "isRebalanceNeeded",
            outputs: [{internalType: "bool", name: "", type: "bool"}],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{internalType: "address", name: "_market", type: "address"}],
            name: "rebalance",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {internalType: "bytes32", name: "role", type: "bytes32"},
                {internalType: "address", name: "account", type: "address"},
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {internalType: "bytes32", name: "role", type: "bytes32"},
                {internalType: "address", name: "account", type: "address"},
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {internalType: "address", name: "_market", type: "address"},
                {internalType: "address", name: "_swap", type: "address"},
                {internalType: "bytes", name: "_buySwapEncodedPath", type: "bytes"},
                {internalType: "bytes", name: "_sellSwapEncodedPath", type: "bytes"},
            ],
            name: "setSwap",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [{internalType: "bytes4", name: "interfaceId", type: "bytes4"}],
            name: "supportsInterface",
            outputs: [{internalType: "bool", name: "", type: "bool"}],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{internalType: "address", name: "", type: "address"}],
            name: "swapInfo",
            outputs: [
                {internalType: "bytes", name: "buySwapEncodedPath", type: "bytes"},
                {internalType: "bytes", name: "sellSwapEncodedPath", type: "bytes"},
                {internalType: "address", name: "swapAdapter", type: "address"},
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {internalType: "bytes32", name: "role", type: "bytes32"},
                {internalType: "address", name: "account", type: "address"},
            ],
            name: "userHasRole",
            outputs: [{internalType: "bool", name: "", type: "bool"}],
            stateMutability: "view",
            type: "function",
        },
    ];
    const rebalancer = await hre.ethers.getContractAt(abi, "0xCf28b6BdAC33b0F301E67b9d8Bd8bC1789cBC60e");
    const marketAddress = "0x72228a4DFd7Fc7A67D38408Bf5439eedFDE354B4";
    if (await rebalancer.isRebalanceNeeded(marketAddress)) {
        await rebalancer.rebalance(marketAddress);
    } else {
        console.log("not needed");
    }
});
task("state", "Protocol state").setAction(async ({}, hre) => {
    const abi = [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "market",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "premium",
                    type: "uint256",
                },
            ],
            name: "Canceled",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "market",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "floor",
                    type: "uint256",
                },
            ],
            name: "Claimed",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "market",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "premium",
                    type: "uint256",
                },
            ],
            name: "Closed",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "market",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint16",
                    name: "risk",
                    type: "uint16",
                },
                {
                    indexed: false,
                    internalType: "uint16",
                    name: "term",
                    type: "uint16",
                },
            ],
            name: "Deposited",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "market",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "floor",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint16",
                    name: "risk",
                    type: "uint16",
                },
                {
                    indexed: false,
                    internalType: "uint16",
                    name: "term",
                    type: "uint16",
                },
                {
                    indexed: false,
                    internalType: "bool",
                    name: "autorenew",
                    type: "bool",
                },
            ],
            name: "Protected",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "bytes32",
                    name: "role",
                    type: "bytes32",
                },
                {
                    indexed: true,
                    internalType: "bytes32",
                    name: "previousAdminRole",
                    type: "bytes32",
                },
                {
                    indexed: true,
                    internalType: "bytes32",
                    name: "newAdminRole",
                    type: "bytes32",
                },
            ],
            name: "RoleAdminChanged",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "bytes32",
                    name: "role",
                    type: "bytes32",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "sender",
                    type: "address",
                },
            ],
            name: "RoleGranted",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "bytes32",
                    name: "role",
                    type: "bytes32",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "sender",
                    type: "address",
                },
            ],
            name: "RoleRevoked",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "market",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "int256",
                    name: "reward",
                    type: "int256",
                },
            ],
            name: "Withdrawn",
            type: "event",
        },
        {
            inputs: [],
            name: "ADAPTER_ROLE",
            outputs: [
                {
                    internalType: "bytes32",
                    name: "",
                    type: "bytes32",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "AP",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "AR",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "B",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "BOND",
            outputs: [
                {
                    internalType: "contract IBond",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "BOND_ADDRESS",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "CITaker",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "CP",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "CR",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "D",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
                {
                    internalType: "bytes32",
                    name: "",
                    type: "bytes32",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "DIVIDER_ASSET",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [],
            name: "DIVIDER_STABLE",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [],
            name: "GLOBAL_GOVERNANCE_ROLE",
            outputs: [
                {
                    internalType: "bytes32",
                    name: "",
                    type: "bytes32",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "L",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "LOCAL_GOVERNANCE_ROLE",
            outputs: [
                {
                    internalType: "bytes32",
                    name: "",
                    type: "bytes32",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "RWAP",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "STABLE",
            outputs: [
                {
                    internalType: "contract IERC20Upgradeable",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [],
            name: "STABLE_ADDRESS",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [],
            name: "TOKEN",
            outputs: [
                {
                    internalType: "contract IERC20Upgradeable",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [],
            name: "TOKEN_ADDRESS",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "abandon",
            outputs: [
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            name: "allMakerPositions",
            outputs: [
                {
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "stableAmount",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "start",
                    type: "uint256",
                },
                {
                    internalType: "uint16",
                    name: "term",
                    type: "uint16",
                },
                {
                    internalType: "uint16",
                    name: "risk",
                    type: "uint16",
                },
                {
                    internalType: "bool",
                    name: "autorenew",
                    type: "bool",
                },
                {
                    internalType: "uint256",
                    name: "bumpAmount",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "ci",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "calc",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "calcCITaker",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
                {
                    internalType: "uint80",
                    name: "",
                    type: "uint80",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    internalType: "uint16",
                    name: "term",
                    type: "uint16",
                },
            ],
            name: "calcNewMakerPosition",
            outputs: [
                {
                    internalType: "uint256",
                    name: "fee",
                    type: "uint256",
                },
            ],
            stateMutability: "pure",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "risk",
                    type: "uint256",
                },
                {
                    internalType: "uint16",
                    name: "term",
                    type: "uint16",
                },
            ],
            name: "calcNewTakerPosition",
            outputs: [
                {
                    internalType: "uint256",
                    name: "fee",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "floor",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "cancel",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "claim",
            outputs: [
                {
                    internalType: "uint256",
                    name: "claimAmountInStable",
                    type: "uint256",
                },
            ],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "close",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "config",
            outputs: [
                {
                    internalType: "contract IProtocolConfig",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    internalType: "uint16",
                    name: "risk",
                    type: "uint16",
                },
                {
                    internalType: "uint16",
                    name: "term",
                    type: "uint16",
                },
                {
                    internalType: "bool",
                    name: "autorenew",
                    type: "bool",
                },
                {
                    internalType: "uint256",
                    name: "bumpAmount",
                    type: "uint256",
                },
            ],
            name: "deposit",
            outputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "existsMakerPosition",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "existsTakerPosition",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "feed",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "getMakerPosition",
            outputs: [
                {
                    components: [
                        {
                            internalType: "address",
                            name: "owner",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "stableAmount",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "start",
                            type: "uint256",
                        },
                        {
                            internalType: "uint16",
                            name: "term",
                            type: "uint16",
                        },
                        {
                            internalType: "uint16",
                            name: "risk",
                            type: "uint16",
                        },
                        {
                            internalType: "bool",
                            name: "autorenew",
                            type: "bool",
                        },
                        {
                            internalType: "uint256",
                            name: "bumpAmount",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "ci",
                            type: "uint256",
                        },
                    ],
                    internalType: "struct MakerPosition",
                    name: "",
                    type: "tuple",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "getRiskCalc",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "role",
                    type: "bytes32",
                },
            ],
            name: "getRoleAdmin",
            outputs: [
                {
                    internalType: "bytes32",
                    name: "",
                    type: "bytes32",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "getState",
            outputs: [
                {
                    internalType: "uint256",
                    name: "_AP",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "_AR",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "_CP",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "_CR",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "_B",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "_L",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "_D",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "getTakerPosition",
            outputs: [
                {
                    components: [
                        {
                            internalType: "address",
                            name: "owner",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "assetAmount",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "start",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "floor",
                            type: "uint256",
                        },
                        {
                            internalType: "uint16",
                            name: "risk",
                            type: "uint16",
                        },
                        {
                            internalType: "uint16",
                            name: "term",
                            type: "uint16",
                        },
                        {
                            internalType: "bool",
                            name: "autorenew",
                            type: "bool",
                        },
                        {
                            internalType: "uint256",
                            name: "bumpAmount",
                            type: "uint256",
                        },
                        {
                            internalType: "uint256",
                            name: "ci",
                            type: "uint256",
                        },
                    ],
                    internalType: "struct TakerPosition",
                    name: "",
                    type: "tuple",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_token",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "to",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "govWithdraw",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "role",
                    type: "bytes32",
                },
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "role",
                    type: "bytes32",
                },
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
            ],
            name: "hasRole",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "ixTs",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "lastRoundId",
            outputs: [
                {
                    internalType: "uint80",
                    name: "",
                    type: "uint80",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "minMakerPositionSize",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "minTakerPositionSize",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "int256",
                    name: "deltaAP",
                    type: "int256",
                },
                {
                    internalType: "int256",
                    name: "deltaAR",
                    type: "int256",
                },
                {
                    internalType: "int256",
                    name: "deltaCP",
                    type: "int256",
                },
                {
                    internalType: "int256",
                    name: "deltaCR",
                    type: "int256",
                },
            ],
            name: "onAfterRebalance",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "ownerOfMakerPosition",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "ownerOfTakerPosition",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "premiumOnCancel",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "premiumOnClaim",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "premiumOnClose",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "price",
            outputs: [
                {
                    internalType: "int256",
                    name: "_price",
                    type: "int256",
                },
                {
                    internalType: "uint256",
                    name: "_updatedAt",
                    type: "uint256",
                },
                {
                    internalType: "uint80",
                    name: "_roundId",
                    type: "uint80",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint80",
                    name: "_roundId",
                    type: "uint80",
                },
            ],
            name: "priceAt",
            outputs: [
                {
                    internalType: "int256",
                    name: "_price",
                    type: "int256",
                },
                {
                    internalType: "uint256",
                    name: "_updatedAt",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
                {
                    internalType: "uint16",
                    name: "risk",
                    type: "uint16",
                },
                {
                    internalType: "uint16",
                    name: "term",
                    type: "uint16",
                },
                {
                    internalType: "bool",
                    name: "autorenew",
                    type: "bool",
                },
                {
                    internalType: "uint256",
                    name: "bumpAmount",
                    type: "uint256",
                },
            ],
            name: "protect",
            outputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [],
            name: "rebalancer",
            outputs: [
                {
                    internalType: "contract IRebalancer",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "role",
                    type: "bytes32",
                },
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "role",
                    type: "bytes32",
                },
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "from",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "to",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "safeTransferMakerPosition",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "from",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "to",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "safeTransferTakerPosition",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "minMaker",
                    type: "uint256",
                },
                {
                    internalType: "uint256",
                    name: "minTaker",
                    type: "uint256",
                },
            ],
            name: "setMinPositionSize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_rebalancer",
                    type: "address",
                },
            ],
            name: "setRebalancer",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_calc",
                    type: "address",
                },
            ],
            name: "setRiskCalc",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "_treasury",
                    type: "address",
                },
            ],
            name: "setTreasury",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes4",
                    name: "interfaceId",
                    type: "bytes4",
                },
            ],
            name: "supportsInterface",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "takerPosIndex",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "treasury",
            outputs: [
                {
                    internalType: "address",
                    name: "",
                    type: "address",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "update",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "bytes32",
                    name: "role",
                    type: "bytes32",
                },
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
            ],
            name: "userHasRole",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "withdraw",
            outputs: [
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "yieldOnAbandon",
            outputs: [
                {
                    internalType: "int256",
                    name: "",
                    type: "int256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "id",
                    type: "uint256",
                },
            ],
            name: "yieldOnWithdraw",
            outputs: [
                {
                    internalType: "int256",
                    name: "",
                    type: "int256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
    ];
    const market = await hre.ethers.getContractAt(abi, "0x72228a4DFd7Fc7A67D38408Bf5439eedFDE354B4");
    console.log(
        "AP:  ",
        hre.ethers.utils.formatUnits(await market.AP()),
        "  |",
        "AR:  ",
        hre.ethers.utils.formatUnits(await market.AR()),
        "  |",
        "CP:  ",
        hre.ethers.utils.formatUnits(await market.CP()),
        "  |",
        "CR:   ",
        hre.ethers.utils.formatUnits(await market.CR()),
        "  |",
        "B:   ",
        hre.ethers.utils.formatUnits(await market.B()),
        "  |",
        "L:   ",
        hre.ethers.utils.formatUnits(await market.L()),
        "  |",
        "D:   ",
        hre.ethers.utils.formatUnits(await market.D()),
    );
});
