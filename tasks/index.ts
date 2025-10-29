import { task, types } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export const printLastBlockTime = async (hre: HardhatRuntimeEnvironment) => {
  const latestBlock = await hre.ethers.provider.getBlock('latest');
  console.log(
    'Block datetime: %s (%s)',
    new Date(latestBlock.timestamp * 1000).toUTCString(),
    latestBlock.timestamp,
  );
};

task(
  'addtime',
  'Increase the timestamp of the last block by the time interval.',
)
  .addVariadicPositionalParam(
    'time',
    'You can specify 1y2w3d4h5m6s (e.g. 1h30m)',
    undefined,
    types.string,
  )
  .setAction(async ({ time }, hre) => {
    const timeArg = (Array.isArray(time) ? time.join('') : time).trim();
    const unitToSeconds: Record<string, number> = {
      y: 365 * 24 * 60 * 60,
      w: 7 * 24 * 60 * 60,
      d: 24 * 60 * 60,
      h: 60 * 60,
      m: 60,
      s: 1,
    };
    let deltaSeconds = 0;
    const regex = /(\d+(?:\.\d+)?)([ywdhms])/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(timeArg)) !== null) {
      const value = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      deltaSeconds += Math.floor(value * unitToSeconds[unit]);
    }
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) {
      throw new Error('Invalid time format. Example: 1h30m, 2d, 45m');
    }

    await hre.network.provider.send('evm_increaseTime', [deltaSeconds]);
    await hre.network.provider.send('evm_mine');
    await printLastBlockTime(hre);
  });

task('now', 'Show current time in blockchain').setAction(async ({}, hre) => {
  await printLastBlockTime(hre);
});

task('addBalance', 'Transfer ERC20 tokens from holder to recipient')
  .addParam('token', 'Token address (0x...)', undefined, types.string)
  .addParam('holder', 'Holder address (0x...)', undefined, types.string)
  .addParam('recipient', 'Recipient address (0x...)', undefined, types.string)
  .addParam('amount', 'Human value, e.g. 1000', undefined, types.string)
  .setAction(async ({ token, holder, recipient, amount }, hre) => {
    const provider = hre.network.provider;

    await provider.request({
      method: 'hardhat_impersonateAccount',
      params: [holder],
    });

    const holderSigner = await hre.ethers.getSigner(holder);

    const erc20Abi = [
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];

    const tokenInstance = new hre.ethers.Contract(
      token,
      erc20Abi,
      holderSigner,
    );
    const decimals: number = await tokenInstance.decimals();

    const tx = await tokenInstance.transfer(
      recipient,
      hre.ethers.utils.parseUnits(amount, decimals),
    );
    await tx.wait();

    await provider.request({
      method: 'hardhat_stopImpersonatingAccount',
      params: [holder],
    });
  });

task('addBalanceETH', 'Send ETH from holder to recipient')
  .addParam('recipient', 'Recipient address (0x...)', undefined, types.string)
  .addParam('holder', 'Holder address (0x...)', undefined, types.string)
  .addParam('amount', 'Ether amount, e.g. 0.5', undefined, types.string)
  .setAction(async ({ holder, amount, recipient }, hre) => {
    const provider = hre.network.provider;

    await provider.request({
      method: 'hardhat_impersonateAccount',
      params: [holder],
    });

    const holderSigner = await hre.ethers.getSigner(holder);

    const tx = await holderSigner.sendTransaction({
      to: recipient,
      value: hre.ethers.utils.parseEther(amount),
    });
    await tx.wait();

    await provider.request({
      method: 'hardhat_stopImpersonatingAccount',
      params: [holder],
    });
  });

task('mine', 'Mine a single block')
  // .addParam('count', 'Number of blocks to mine', undefined, types.int)
  .setAction(async ({}, hre) => {
    await hre.network.provider.send('evm_mine');
  });
