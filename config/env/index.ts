import 'dotenv/config';
import { Environment, Network } from '../types';

export const ENV: Environment = {
  ALCHEMY_KEY: process.env.ALCHEMY_KEY ?? '',
  INFURA_KEY: process.env.INFURA_KEY ?? '',
  FORKING_NETWORK: process.env.FORKING_NETWORK
    ? (process.env.FORKING_NETWORK as Network)
    : undefined,
  FORKING_BLOCK_NUMBER: process.env.FORKING_BLOCK_NUMBER
    ? parseInt(process.env.FORKING_BLOCK_NUMBER)
    : undefined,
};
