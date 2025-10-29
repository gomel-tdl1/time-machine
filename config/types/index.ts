type NetworkBase = 'mainnet';
type RpcNetwork = NetworkBase;
export type Network = NetworkBase | 'base' | 'hardhat' | 'localhost';
export type RpcUrl =
  | `https://eth-${RpcNetwork}.g.alchemy.com/v2/${string}`
  | `https://${RpcNetwork}.infura.io/v3/${string}`
  | `http://localhost:${number}`
  | `https://${string}.${string}`;

export type ConfigPerNetwork<T> = Record<Network, T>;

export interface Environment {
  readonly ALCHEMY_KEY?: string;
  readonly INFURA_KEY?: string;
  readonly FORKING_NETWORK?: Network;
  readonly FORKING_BLOCK_NUMBER?: number;
}
