/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IRewarder,
  IRewarderInterface,
} from "../../../contracts/interface/IRewarder";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "pid",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "sushiAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "newLpAmount",
        type: "uint256",
      },
    ],
    name: "onIZNReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "pid",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "sushiAmount",
        type: "uint256",
      },
    ],
    name: "pendingTokens",
    outputs: [
      {
        internalType: "contract IERC20[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IRewarder__factory {
  static readonly abi = _abi;
  static createInterface(): IRewarderInterface {
    return new utils.Interface(_abi) as IRewarderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRewarder {
    return new Contract(address, _abi, signerOrProvider) as IRewarder;
  }
}
